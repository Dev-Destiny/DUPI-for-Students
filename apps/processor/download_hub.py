from huggingface_hub import snapshot_download
import os
import sys

model_id = "sentence-transformers/all-MiniLM-L6-v2"
print(f"DEBUG: Downloading {model_id} via huggingface_hub...")

try:
    path = snapshot_download(repo_id=model_id)
    print(f"SUCCESS: Model downloaded to {path}")
except Exception as e:
    print(f"FAILURE: {str(e)}")
    sys.exit(1)
