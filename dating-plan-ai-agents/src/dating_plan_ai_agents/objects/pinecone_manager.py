from pinecone import Pinecone, ServerlessSpec
import openai
import pymongo
import pandas as pd
from dating_plan_ai_agents.objects.utils import get_secret


class PineconeManager:

    def __init__(
        self,
        pc_api_key,
        openai_key,
        index_name,
        mongodb_uri=None,
        mongodb_db=None,
        mongodb_collection=None,
    ):
        self.openai_key = openai_key
        self.pc_api_key = pc_api_key
        self.pinecone = Pinecone(api_key=self.pc_api_key)
        self.index_name = index_name
        self.mongodb_uri = mongodb_uri
        self.mongodb_db = mongodb_db
        self.mongodb_collection = mongodb_collection

        if self.index_name not in self.pinecone.list_indexes().names():
            self.pinecone.create_index(
                self.index_name,
                dimension=1536,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
        self.index = self.pinecone.Index(self.index_name)
        self.embedding_model = "text-embedding-3-small"
        if self.mongodb_uri:
            self.mongo_client = pymongo.MongoClient(self.mongodb_uri)
            self.db = self.mongo_client[self.mongodb_db]
            self.collection = self.db[self.mongodb_collection]

    def _generate_one_embedding(self, text):
        # Generate embedding for a single text using OpenAI API
        openai.api_key = self.openai_key
        res = openai.embeddings.create(
            input=text,
            model=self.embedding_model,
        )
        embedding = res.data[0].embedding
        return embedding

    def _ingest_data(self, data, id_field, text_field, batch_size=100):
        """
        Helper function to ingest data (from CSV or MongoDB) into Pinecone.
        - data: DataFrame (for CSV) or Cursor (for MongoDB)
        - id_field: The field name for the document ID
        - text_field: The field name for the document text
        """
        vectors = []
        count = 0
        total_records = 0

        for doc in data:
            # TODO: Add a check if id_field if alrdy exists in pinecone index_id
            # Ensure the document has both the id and text fields
            doc_id = str(doc[id_field])
            text = doc[text_field]
            embedding = self._generate_one_embedding(text)

            vectors.append(
                {
                    "id": doc_id,
                    "values": embedding,
                    "metadata": {"text": text},
                }
            )
            count += 1

            # If the batch size is reached, return the batch of vectors
            if count >= batch_size:
                total_records += len(vectors)
                yield vectors  # Return the current batch
                vectors = []  # Clear vectors for the next batch
                count = 0  # Reset count for the next batch

        # If there are remaining vectors that weren't added to a full batch
        if vectors:
            total_records += len(vectors)
            yield vectors  # Yield the final batch of vectors

        print(f"Processed a total of {total_records} records.")

    def ingest_csv(self, csv_file, id_column, text_column):
        # Load CSV data and ingest into Pinecone
        data = pd.read_csv(csv_file)
        vectors = self._ingest_data(
            data.iterrows(), id_field=id_column, text_field=text_column
        )
        self.index.upsert(vectors=vectors, namespace="default")
        print(
            f"Ingested {len(data)} records from CSV into Pinecone index '{self.index_name}'."
        )

    def ingest_mongodb(self, id_field, text_field, batch_size=100):
        cursor = (
            self.collection.find()
        )  # Retrieve all documents from MongoDB collection

        # Initialize variables for batching
        total_records = 0

        # Loop through each batch of vectors returned by _ingest_data
        for batch_vectors in self._ingest_data(
            cursor, id_field=id_field, text_field=text_field, batch_size=batch_size
        ):
            # Perform the upsert for this batch
            self.index.upsert(vectors=batch_vectors, namespace="default")
            print(f"Upserted {len(batch_vectors)} records into Pinecone.")
            total_records += len(batch_vectors)

        print(
            f"Ingested {total_records} records from MongoDB collection '{self.mongodb_collection}' into Pinecone index '{self.index_name}'."
        )
        return total_records

    def retrieve_similar_documents(self, prompt, top_k=5) -> list[str]:
        # Encode the prompt and retrieve similar documents from Pinecone
        embedding = self._generate_one_embedding(prompt)
        results = self.index.query(vector=embedding, top_k=top_k, include_metadata=True)
        texts = [match["metadata"]["text"] for match in results["matches"]]
        return texts
