import csv
from pymongo import MongoClient
from dating_plan_ai_agents.mongodb.review import Review


class MongoDBHelper:
    def __init__(self, db_name, collection_name, mongo_uri="mongodb://localhost:27017"):
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def convert_csv_to_mongodb(self, csv_file_path):
        with open(csv_file_path, mode="r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            documents = []
            for row in reader:
                # Validate and create a CinemaReview object
                try:
                    review = Review(
                        index_id=int(row["index_id"]),
                        caption=row["caption"],
                        name=row["name"],
                        overall_rating=float(row["overall_rating"]),
                        category=row["category"],
                        opening_hours=row["opening_hours"],
                    )
                    documents.append(
                        review.model_dump()
                    )  # Convert to dictionary for MongoDB
                except ValueError as e:
                    print(f"Skipping row due to error: {e}")
                    continue

            # Insert all valid documents into MongoDB
            if documents:
                self.collection.insert_many(documents)
                print(
                    f"Inserted {len(documents)} documents into the MongoDB collection."
                )
