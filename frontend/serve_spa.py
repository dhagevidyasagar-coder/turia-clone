import http.server
import socketserver
import os
import urllib.parse

PORT = 8080
DIRECTORY = "/Users/dhagevidyasagar/Desktop/turia-clone/frontend/dist"

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        url_parts = urllib.parse.urlparse(self.path)
        request_path = url_parts.path.strip('/')
        file_path = os.path.join(DIRECTORY, request_path)
        
        if not os.path.isfile(file_path):
            self.path = '/index.html'
            
        return super().do_GET()

class TCPServer(socketserver.TCPServer):
    allow_reuse_address = True

with TCPServer(("127.0.0.1", PORT), SPAHandler) as httpd:
    print(f"Serving at http://127.0.0.1:{PORT}")
    httpd.serve_forever()
