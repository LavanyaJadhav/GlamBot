from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import logging
from config import Config

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

# Update your database configuration to use SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@localhost/your_database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Configure CORS to allow all origins in development
CORS(app, supports_credentials=True)

@app.after_request
def after_request(response):
    logger.debug(f"Response headers: {dict(response.headers)}")
    logger.debug(f"Response data: {response.get_data()}")
    
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# User Authentication Routes
@app.route('/api/users/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        logger.debug("Handling OPTIONS request")
        return jsonify({'status': 'ok'})

    try:
        logger.debug(f"Request data: {request.get_data()}")
        data = request.json
        logger.debug(f"Parsed JSON data: {data}")
        
        if not data:
            logger.error("No data provided in request")
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        email = data.get('username')  # Frontend still sends as username
        password = data.get('password')
        logger.debug(f"Login attempt for email: {email}")
        
        if not email or not password:
            logger.error("Missing email or password")
            return jsonify({'success': False, 'message': 'Email and password required'}), 400

        try:
            user = db.session.query(User).filter_by(email=email).first()
            logger.debug(f"Database query result: {user}")
        except Exception as e:
            logger.error(f"Database query failed: {str(e)}")
            return jsonify({'success': False, 'message': 'Database query failed'}), 500
        
        if user:
            if check_password_hash(user.password, password):
                response_data = {
                    'success': True,
                    'user': {
                        'id': user.id,
                        'email': user.email
                    }
                }
                logger.debug(f"Login successful: {response_data}")
                return jsonify(response_data)
        
        logger.error("Invalid credentials")
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

    except Exception as e:
        logger.exception("Login error occurred")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/users/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        email = data.get('username')  # Frontend sends as username
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password required'}), 400

        try:
            new_user = User(email=email, password=generate_password_hash(password))
            db.session.add(new_user)
            db.session.commit()
            
            user = db.session.query(User).filter_by(email=email).first()
            
            return jsonify({
                'success': True,
                'user': {
                    'id': user.id,
                    'email': user.email
                }
            })
        except Exception as e:
            db.session.rollback()
            if 'Duplicate entry' in str(e):
                return jsonify({'success': False, 'message': 'Email already exists'}), 409
            raise e

    except Exception as e:
        logger.exception("Registration error")
        return jsonify({'success': False, 'message': str(e)}), 500

# Style Profile Routes
@app.route('/api/style-profile/<int:user_id>', methods=['GET', 'POST', 'OPTIONS'])
def style_profile(user_id):
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    try:
        if request.method == 'GET':
            user = db.session.query(StyleProfile).filter_by(user_id=user_id).first()
            
            if user:
                return jsonify({
                    'success': True,
                    'profile': {
                        'style_preferences': user.style_preferences,
                        'color_preferences': user.color_preferences
                    }
                })
            return jsonify({'success': False, 'message': 'Profile not found'}), 404
        
        elif request.method == 'POST':
            data = request.json
            if not data:
                return jsonify({'success': False, 'message': 'No data provided'}), 400
                
            style_prefs = data.get('style_preferences')
            color_prefs = data.get('color_preferences')
            
            user = db.session.query(StyleProfile).filter_by(user_id=user_id).first()
            if user:
                user.style_preferences = style_prefs
                user.color_preferences = color_prefs
            else:
                new_profile = StyleProfile(user_id=user_id, style_preferences=style_prefs, color_preferences=color_prefs)
                db.session.add(new_profile)
            
            db.session.commit()
            
            return jsonify({'success': True})

    except Exception as e:
        print(f"Style profile error: {str(e)}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# Helper function to create a test user
@app.route('/api/create-test-user', methods=['POST'])
def create_test_user():
    try:
        username = "test"
        password = "test123"
        hashed_password = generate_password_hash(password)
        
        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        
        logger.info(f"Test user created with username: {username} and password: {password}")
        return jsonify({'success': True, 'message': 'Test user created'})
    except Exception as e:
        logger.exception("Error creating test user")
        return jsonify({'success': False, 'message': str(e)}), 500

# Add this route to check database connection
@app.route('/api/check-db', methods=['GET'])
def check_db():
    try:
        tables = db.session.query(Table).all()
        users = db.session.query(User).all()
        return jsonify({
            'success': True,
            'tables': tables,
            'users': users
        })
    except Exception as e:
        logger.exception("Database check failed")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/check-schema', methods=['GET'])
def check_schema():
    try:
        tables = db.session.query(Table).all()
        
        # Get columns for each table
        schema = {}
        for table in tables:
            table_name = table.name
            columns = db.session.query(Column).filter_by(table_id=table.id).all()
            schema[table_name] = columns
            
        return jsonify({
            'success': True,
            'tables': tables,
            'schema': schema
        })
    except Exception as e:
        logger.exception("Schema check failed")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    logger.info("Server starting on http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0') 