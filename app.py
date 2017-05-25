#!flask/bin/python2.7
from flask import Flask, jsonify, request, redirect, url_for, send_from_directory, make_response
from werkzeug.utils import secure_filename
from PIL import Image
import os

UPLOAD_FOLDER = 'uploads'

app = Flask(__name__, static_url_path='')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    # if user does not select file, browser also
    # submit a empty part without filename
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file:
        filename = secure_filename(file.filename + '.svg')
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return url_for('uploaded_file', filename=filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
