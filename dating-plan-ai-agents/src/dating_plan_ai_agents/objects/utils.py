import boto3
import os
import json


def get_secret(secret_name):
    """Helper function to fetch secrets."""
    region_name = os.getenv("AWS_REGION", "ap-southeast-1")
    client = boto3.client("secretsmanager", region_name=region_name)
    response = client.get_secret_value(SecretId=secret_name)
    return json.loads(response["SecretString"])
