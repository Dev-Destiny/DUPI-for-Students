import logging
import os
from huggingface_hub import hf_hub_download
from dotenv import load_dotenv

# Set up logging to show everything
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("huggingface_hub")
logger.setLevel(logging.DEBUG)

load_dotenv()
token = os.getenv("HF_TOKEN")

repo_id = "sentence-transformers/all-MiniLM-L6-v2"
filename = "config.json" # Start with a small file

print(f"--- ATTEMPTING DEBUG DOWNLOAD OF {filename} ---")
try:
    path = hf_hub_download(
        repo_id=repo_id, 
        filename=filename, 
        token=token,
        force_download=True
    )
    print(f"SUCCESS: {filename} downloaded to {path}")
except Exception as e:
    print(f"FAILURE: {str(e)}")

filenameLarge = "model.safetensors"
print(f"\n--- ATTEMPTING DEBUG DOWNLOAD OF {filenameLarge} ---")
try:
    # We use a timeout to see if it just hangs
    path = hf_hub_download(
        repo_id=repo_id, 
        filename=filenameLarge, 
        token=token,
        force_download=True
    )
    print(f"SUCCESS: {filenameLarge} downloaded to {path}")
except Exception as e:
    print(f"FAILURE: {str(e)}")
