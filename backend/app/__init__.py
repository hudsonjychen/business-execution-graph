from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
    CORS(app, resources={r"/*": {"origins": "*"}})

    from .routes import main
    app.register_blueprint(main)

    return app