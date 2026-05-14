import socket
import sys

try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('127.0.0.1', 0))
    port = s.getsockname()[1]
    print(f"Successfully bound to port {port}")
    s.close()
except Exception as e:
    print(f"Error binding: {e}")
    sys.exit(1)
