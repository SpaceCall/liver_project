from flask import Flask, request, jsonify
import os
import base64
from pythonfile import show_results
import uuid

app = Flask(__name__)

@app.route('/analyzeImage', methods=['POST'])
def analyze_image_request():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No JSON payload received'}), 400

    try:
        task_type = int(data.get('type'))
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid task_type'}), 400

    sensor = str(data.get('sensor') or 'convex')
    image_data = data.get('image')

    if not image_data:
        return jsonify({'error': 'No image data'}), 400

    # Створення каталогу для збереження
    upload_dir = './images'
    os.makedirs(upload_dir, exist_ok=True)

    filename = f"{uuid.uuid4()}.png"
    file_path = os.path.join(upload_dir, filename)

    try:
        # Декодування та збереження файлу
        with open(file_path, "wb") as f:
            f.write(base64.b64decode(image_data))
    except Exception as e:
        return jsonify({'error': 'Failed to save image', 'details': str(e)}), 500

    try:
        result = show_results(file_path, sensor, task_type)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': 'Model error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3070)
