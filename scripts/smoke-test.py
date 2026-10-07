"""Smoke-test a running portfolio API and its SPA bundle (stdlib only)."""
import json
import re
import sys
from urllib.error import HTTPError
from urllib.request import Request, urlopen

base = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8000').rstrip('/')
def request(path, expected, method='GET', body=None):
    req = Request(base + path, data=body, method=method)
    if body is not None:
        req.add_header('Content-Type', 'application/json')
    try:
        response = urlopen(req, timeout=15)
    except HTTPError as error:
        response = error
    with response:
        data = response.read().decode('utf-8')
        assert response.status == expected, (path, response.status, data[:200])
        return data, response.headers

for path in ['/', '/contact', '/projects', '/project/example', '/login', '/error']:
    html, headers = request(path, 200)
    assert 'id="root"' in html and 'text/html' in headers['Content-Type'], path
    assert headers['X-Content-Type-Options'] == 'nosniff'
    if path == '/':
        asset = re.search(r'src="(/assets/[^"]+\.js)"', html).group(1)
        bundle, bundle_headers = request(asset, 200)
        assert 'javascript' in bundle_headers['Content-Type']
for path in ['/api/does-not-exist', '/assets/missing.js', '/images/missing.webp', '/embedding']:
    request(path, 404)
request('/api/Login/me', 401)
request('/api/Login/refresh', 401)
request('/api/Project/1', 401, 'PUT', b'{"id":1}')
for path in ['/api/Chat', '/api/Embedding', '/api/ProjectSearch/search']:
    request(path, 404, 'POST', b'{}')
projects, headers = request('/api/Project', 200)
assert isinstance(json.loads(projects), list)
assert 'application/json' in headers['Content-Type']
request('/robots.txt', 200)
print('SPA routes, bundle, API routing, authorization and retired AI endpoints passed.')
