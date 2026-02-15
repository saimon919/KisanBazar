import os
import subprocess
import signal
import time

def kill_port(port):
    try:
        output = subprocess.check_output(f"netstat -ano | findstr :{port}", shell=True).decode()
        for line in output.splitlines():
            if "LISTENING" in line:
                pid = line.strip().split()[-1]
                print(f"Killing process {pid} on port {port}")
                os.system(f"taskkill /F /PID {pid}")
                time.sleep(1)
    except Exception as e:
        print(f"No process found on port {port} or error: {e}")

if __name__ == "__main__":
    kill_port(5000)
    print("Starting server...")
    # Run node app.js and redirect to server.log
    with open("server.log", "w") as f:
        subprocess.Popen(["node", "app.js"], cwd=os.path.join(os.getcwd(), "server"), stdout=f, stderr=f)
    print("Server starting. Logging to server/server.log")
