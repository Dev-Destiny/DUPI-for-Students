from sentence_transformers import SentenceTransformer
import sys
import logging
import os

# Configure logging to see download progress
logging.basicConfig(level=logging.INFO)

model_name = "sentence-transformers/all-MiniLM-L6-v2"

print(f"--- Attempting to download/load model: {model_name} ---")
try:
    model = SentenceTransformer(model_name)
    print("SUCCESS: Model loaded successfully!")
except Exception as e:
    print(f"FAILURE: Error loading model: {str(e)}")
    # Check internet connectivity
    import socket
    try:
        socket.create_connection(("8.8.8.8", 53), timeout=3)
        print("NETWORK: Internet connection seems OK.")
    except OSError:
        print("NETWORK: No internet connection detected.")
    sys.exit(1)
