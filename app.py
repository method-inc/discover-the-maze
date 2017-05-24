#!flask/bin/python2.7
from flask import Flask, jsonify
import os

app = Flask(__name__, static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/maze', methods=['POST'])
def upload_maze():
    return jsonify({ hello: 'world' })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)