import socket
for port in [3000, 5000, 5001, 5173, 5005, 8080]:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(('', port))
        print(f"Success on port {port} with ''")
        s.close()
    except Exception as e:
        print(f"Failed on port {port} with '': {e}")
