import subprocess
import time
import sys
import os

def start_services():
    """
    Orchestrates the Studify AI Processor:
    - Launches the FastAPI Server (Port 8000)
    - Launches the Background Worker (Redis consumer)
    """
    # Find the virtual environment's python interpreter
    # We prefer the current interpreter if it is already in a venv, otherwise we look specifically for ./venv/
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # In Docker, we use the system python. In local dev, we use venv if it exists.
    venv_python_nt = os.path.join(base_dir, "venv", "Scripts", "python.exe")
    venv_python_posix = os.path.join(base_dir, "venv", "bin", "python")
    
    if os.path.exists(venv_python_nt):
        python_path = venv_python_nt
    elif os.path.exists(venv_python_posix):
        python_path = venv_python_posix
    else:
        python_path = sys.executable

    print("\n" + "="*40)
    print("🚀 Studify AI ECOSYSTEM MANAGER")
    print(f"📍 Interpreter: {python_path}")
    print("="*40)
    
    # Set PYTHONPATH to include src directory
    env = os.environ.copy()
    env["PYTHONPATH"] = os.path.abspath(os.path.join(base_dir, "src"))
    
    processes = []
    
    try:
        # 1. Start the API Server (main.py)
        print("📡 [PROCESS] Starting FastAPI Server on port 8000...")
        api_proc = subprocess.Popen([python_path, os.path.join(base_dir, "src", "main.py")], env=env)
        processes.append(api_proc)
        
        # 2. Start the Worker (worker.py)
        print("🤖 [PROCESS] Starting Background Worker...")
        worker_proc = subprocess.Popen([python_path, os.path.join(base_dir, "src", "worker.py")], env=env)
        processes.append(worker_proc)
        
        print("\n✅ All systems online. Press Ctrl+C to terminate all services.\n")
        
        # Keep the script running and monitor processes
        while True:
            for p in processes:
                if p.poll() is not None:
                    name = "API Server" if p == api_proc else "Worker"
                    print(f"⚠️ [WARNING] {name} process has stopped (Exit Code: {p.returncode})")
                    # If one dies, shut everything down for consistency
                    raise KeyboardInterrupt
            time.sleep(2)
            
    except KeyboardInterrupt:
        print("\n\n🛑 [SHUTDOWN] Interrupted by user. Cleaning up processes...")
        for p in processes:
            p.terminate()
            try:
                p.wait(timeout=5)
            except subprocess.TimeoutExpired:
                p.kill()
        print("✨ Goodbye!\n")
        sys.exit(0)

if __name__ == "__main__": 
    start_services()
