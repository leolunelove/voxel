#!/usr/bin/env python3
"""Start the local game without external packages."""
import os
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import webbrowser

os.chdir(Path(__file__).resolve().parent)
url = 'http://127.0.0.1:4317'
try:
    server = ThreadingHTTPServer(('127.0.0.1', 4317), SimpleHTTPRequestHandler)
except OSError:
    print('Port 4317 is occupied. If Voxel is already running, visit ' + url)
    input('Press Enter to close. ')
else:
    print('Voxel is running at ' + url + '\nKeep this terminal open. Press Ctrl+C to stop.')
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
