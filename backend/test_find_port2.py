import socket
for port in range(1024, 65535):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(('localhost', port))
        print(f"Found port: {port}")
        s.close()
        break
    except Exception as e:
        pass
else:
    print("No port found")
