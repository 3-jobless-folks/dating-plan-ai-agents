from pinecone import Pinecone, ServerlessSpec
import pandas as pd
import openai


class PineconeManager:
    def __init__(self, pc_api_key, openai_key, index_name):
        # Initialize Pinecone connection and set up index
        openai.api_key = openai_key
        self.pc_api_key = pc_api_key
        self.pinecone = Pinecone(api_key=self.pc_api_key)
        self.index_name = index_name
        if self.index_name not in self.pinecone.list_indexes().names():
            self.pinecone.create_index(
                self.index_name,
                dimension=1536,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
        self.index = self.pinecone.Index(self.index_name)
        self.embedding_model = "text-embedding-3-small"

    def _generate_one_embedding(self, text):
        res = openai.embeddings.create(
            input=text,
            model=self.embedding_model,
        )
        embedding = res.data[0].embedding
        return embedding

    def ingest_csv(self, csv_file, id_column, text_column):
        # Load CSV data and ingest into Pinecone
        data = pd.read_csv(csv_file)
        vectors = []
        for _, row in data.iterrows():
            text = row[text_column]
            doc_id = str(row[id_column])
            embedding = self._generate_one_embedding(text)
            print(f"Embeddings data: {embedding}")
            vectors.append(
                {
                    "id": doc_id,
                    "values": embedding,
                    "metadata": {"text": text},
                }
            )
        self.index.upsert(vectors=vectors, namespace="default")
        print(f"Ingested {len(data)} records into Pinecone index '{self.index_name}'.")

    def retrieve_similar_documents(self, prompt, top_k=5) -> list[str]:
        # Encode the prompt and retrieve similar documents from Pinecone
        embedding = self._generate_one_embedding(prompt)
        results = self.index.query(vector=embedding, top_k=top_k, include_metadata=True)
        texts = [match["metadata"]["text"] for match in results["matches"]]
        return texts
