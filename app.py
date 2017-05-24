#!flask/bin/python2.7
from flask import Flask, jsonify

app = Flask(__name__, static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/maze', methods=['POST'])
def upload_maze():
    return jsonify({ hello: 'world' })

if __name__ == '__main__':
    app.run(debug=True)
