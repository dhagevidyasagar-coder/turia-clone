import socket
for port in [3000, 5000, 5001, 5173, 8000, 8080, 8888, 9000]:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(('127.0.0.1', port))
        print(f"Success on port {port}")
        s.close()
    except Exception as e:
        print(f"Failed on port {port}: {e}")
