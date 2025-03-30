import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, session, url_for, redirect
from typing import Optional
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from PyPDF2 import PdfReader
from docx import Document
from pydantic import BaseModel, Field, EmailStr
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import logging
from datetime import timedelta

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
app.config.update({
    'SQLALCHEMY_DATABASE_URI': os.getenv('DATABASE_URL', 'sqlite:///users.db'),
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'JWT_SECRET_KEY': os.getenv('JWT_SECRET_KEY', 'your_strong_secret_key_here'),
    'SECRET_KEY': os.getenv('SECRET_KEY', 'another_strong_secret_key_here'),
    'SESSION_TYPE': 'filesystem',
    'PERMANENT_SESSION_LIFETIME': timedelta(days=1),  # Session lasts 1 day
    'GOOGLE_API_KEY': os.getenv('GOOGLE_API_KEY'),
    'MAX_CONTENT_LENGTH': 5 * 1024 * 1024,  # 5MB max upload size
    'ALLOWED_EXTENSIONS': {'pdf', 'docx', 'doc'}
})

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:8080", "http://127.0.0.1:8080"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Initialize Gemini model
try:
    model = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        temperature=0.5,
        google_api_key=app.config['GOOGLE_API_KEY']
    )
except Exception as e:
    logger.error(f"Failed to initialize Gemini model: {str(e)}")
    raise

# Pydantic model for structured output
class Resume(BaseModel):
    name: str = Field(description="Name of the candidate")
    summary: str = Field(description="Professional summary")
    expert: str = Field(description="Area of expertise")
    linkedin: Optional[str] = Field(description="LinkedIn profile URL")
    github: Optional[str] = Field(description="GitHub profile URL")
    email: EmailStr = Field(description="Email address")
    projects: list[str] = Field(description="List of projects (max 3)")
    education: list[str] = Field(description="Education history")
    certifications: list[str] = Field(description="Certifications")
    skills: list[str] = Field(description="Top skills (max 4)")
    experience: list[str] = Field(description="Work experience (max 3 entries)")
    achievements: list[str] = Field(description="Notable achievements")

try:
    model = model.with_structured_output(Resume)
except Exception as e:
    logger.error(f"Failed to configure structured output: {str(e)}")
    raise

# Database models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)

# Initialize database
with app.app_context():
    db.create_all()

# Utility functions
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def extract_text(file, file_ext):
    """Extract text from PDF or DOCX files"""
    try:
        if file_ext == ".pdf":
            reader = PdfReader(file)
            text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
            if not text.strip():
                raise ValueError("PDF appears to be empty or contains no extractable text")
            return text
        elif file_ext == ".docx":
            doc = Document(file)
            text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
            if not text.strip():
                raise ValueError("DOCX appears to be empty or contains no text")
            return text
        raise ValueError("Unsupported file format")
    except Exception as e:
        logger.error(f"Error extracting text: {str(e)}")
        raise

# Routes
@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/auth', methods=['GET'])
def auth():
    return render_template('auth.html')



@app.route('/demo', methods=['GET'])
def demo():
    return render_template('demo.html')

@app.route('/video.html')
def video_template():
    return render_template('video.html')

@app.route('/teacher.html')
def teacher_template():
    return render_template('teacher.html')

@app.route('/templates.html')
def templates_page():
    return render_template('templates.html')

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        required_fields = ['email', 'password', 'username']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Missing required fields'}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already exists'}), 400

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()
        
        access_token = create_access_token(identity={
            'id': new_user.id,
            'username': new_user.username
        })
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user_id': new_user.id,
            'username': new_user.username,
            'redirect': url_for('home')  # Add this line
        }), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Registration error: {str(e)}")
        return jsonify({'message': 'Registration failed'}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        if 'email' not in data or 'password' not in data:
            return jsonify({'message': 'Missing email or password'}), 400

        user = User.query.filter_by(email=data['email']).first()

        if user and bcrypt.check_password_hash(user.password, data['password']):
            access_token = create_access_token(identity={
                'id': user.id,
                'username': user.username
            })
            return jsonify({
                'access_token': access_token,
                'user_id': user.id,
                'username': user.username,
                'redirect': url_for('home')  # Add this line
            }), 200
        return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'message': 'Login failed'}), 500

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({
        'message': f'Hello, {current_user["username"]}!',
        'user': current_user
    }), 200

@app.route('/analyze_resume', methods=['POST'])
def analyze_resume_route():
    try:
        # Check if file was uploaded
        if 'resume' not in request.files:
            return jsonify({
                "success": False,
                "error": "No file uploaded",
                "message": "Please upload a resume file"
            }), 400
        
        file = request.files['resume']
        
        # Check if file has a name
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No selected file",
                "message": "Please select a file to upload"
            }), 400
        
        # Check file extension
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ['.pdf', '.docx']:
            return jsonify({
                "success": False,
                "error": "Unsupported file type",
                "message": "Please upload a PDF or DOCX file"
            }), 400
        
        # Extract text
        try:
            text = extract_text(file, file_ext)
            logger.info("Successfully extracted text from resume")
        except Exception as e:
            return jsonify({
                "success": False,
                "error": "File processing error",
                "message": f"Could not read file content: {str(e)}"
            }), 400
        
        # Analyze with Gemini
        try:
            prompt = f"""
            Analyze this resume content thoroughly and extract the following structured information:
            {text}

            Please provide complete and accurate information for all fields.
            For lists (projects, education, etc.), include all relevant items.
            """
            
            logger.info("Sending resume to Gemini for analysis...")
            response = model.invoke([
                SystemMessage(content="You are an expert resume parser. Extract all details accurately."),
                HumanMessage(content=prompt)
            ])
            logger.info("Received response from Gemini")
            
            # Build comprehensive response data
            resume_data = {
                "name": response.name,
                "summary": response.summary,
                "expert": response.expert,
                "linkedin": response.linkedin or "Not provided",
                "github": response.github or "Not provided",
                "email": response.email,
                "projects": response.projects or ["No projects listed"],
                "education": response.education or ["No education listed"],
                "certifications": response.certifications or ["No certifications"],
                "experience": response.experience or ["No experience listed"],
                "achievements": response.achievements or ["No achievements listed"],
                "skills": response.skills or ["No skills listed"],
                "accuracy_score": 95,  # Default accuracy score
                "status": "success"
            }
            
            # Store in session for the editor page
            session.permanent = True
            session["resume_data"] = resume_data
            logger.info("Resume data stored in session")
            
            return jsonify({
                "success": True,
                "message": "Resume analyzed successfully",
                "redirect": url_for("editor"),
                "data": resume_data
            })
            
        except Exception as e:
            logger.error(f"Gemini analysis failed: {str(e)}")
            return jsonify({
                "success": False,
                "error": "Analysis failed",
                "message": "Failed to analyze resume content. Please try another file."
            }), 500
            
    except Exception as e:
        logger.error(f"Unexpected error in resume processing: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Processing error",
            "message": "An unexpected error occurred. Please try again."
        }), 500



@app.route("/editor", methods=["GET"])
def editor():
    try:
        if "resume_data" not in session:
            logger.warning("No resume data in session - redirecting to home")
            return redirect(url_for("home"))
        
        resume_data = session.get("resume_data")
        logger.info(f"Rendering editor with resume data: {resume_data.keys() if resume_data else 'None'}")
        
        # Ensure all fields have values for the template
        default_resume = {
            "name": "Your Name",
            "summary": "Professional summary",
            "expert": "Your expertise",
            "linkedin": "#",
            "github": "#",
            "email": "your.email@example.com",
            "projects": ["Project 1", "Project 2"],
            "education": ["Degree from University"],
            "certifications": ["Certification 1"],
            "experience": ["Job at Company"],
            "achievements": ["Notable achievement"],
            "skills": ["Skill 1", "Skill 2"],
            "accuracy_score": 0,
            "status": "default"
        }
        
        # Merge with default values if any fields are missing
        complete_resume = {**default_resume, **resume_data} if resume_data else default_resume
        
        return render_template("demo.html", resume=complete_resume)
    
    except Exception as e:
        logger.error(f"Editor error: {str(e)}")
        return redirect(url_for("home"))

@app.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    try:
        current_user = get_jwt_identity()
        if "resume_data" not in session:
            return redirect(url_for("home"))
        return render_template("dashboard.html", 
                            resume=session.get("resume_data", {}),
                            user=current_user)
    except Exception as e:
        logger.error(f"Dashboard error: {str(e)}")
        return redirect(url_for("home"))

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

# Error handlers
@app.errorhandler(401)
def unauthorized_error(error):
    return jsonify({
        "error": "Unauthorized",
        "message": "Missing or invalid authorization token"
    }), 401

@app.errorhandler(404)
def not_found_error(error):
    return render_template('error.html', 
                         error_code=404,
                         error_message="Page not found"), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('error.html',
                         error_code=500,
                         error_message="Internal server error"), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)