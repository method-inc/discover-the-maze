#!flask/bin/python2.7
from flask import Flask, jsonify, request, redirect, url_for, send_from_directory, make_response
from werkzeug.utils import secure_filename
from PIL import Image
import os
import json

from solver import Solver
from parse_path import path_to_moves

UPLOAD_FOLDER = 'uploads'

app = Flask(__name__, static_url_path='')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    resp = make_response(send_from_directory(app.config['UPLOAD_FOLDER'], filename))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/api/maze', methods=['POST'])
def upload_maze():
    file = request.files['file']
    filename = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
    file.save(filename)
    s = Solver(filename)
    path = s.solve()

    if path:
        return json.dumps({ 'solveable': True, 'moves': path_to_moves(path) })
    else:
        return json.dumps({ 'solveable': False })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
