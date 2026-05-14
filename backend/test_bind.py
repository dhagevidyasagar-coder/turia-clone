import socket
import sys

try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('127.0.0.1', 5005))
    s.listen(1)
    print("Successfully bound to port 5005")
    s.close()
except Exception as e:
    print(f"Error binding to port 5005: {e}")
    sys.exit(1)
