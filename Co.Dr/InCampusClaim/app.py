from flask import Flask, render_template, request, redirect, flash, session, url_for, send_file, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import qrcode
from io import BytesIO
import os
from PIL import Image
import pyzbar.pyzbar as pyzbar
import io

# Initialize Flask app
app = Flask(__name__)
app.secret_key = "supersecretkey"
app.config['QR_CODE_FOLDER'] = 'static/qrcodes'

# Ensure QR code directory exists
os.makedirs(app.config['QR_CODE_FOLDER'], exist_ok=True)

def get_db_connection():
    """Create and return a database connection"""
    conn = sqlite3.connect('lost_found.db')
    conn.row_factory = sqlite3.Row
    return conn

def initialize_database():
    """Initialize the database tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            roll_number TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            whatsapp TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            item TEXT NOT NULL,
            description TEXT NOT NULL,
            location TEXT NOT NULL,
            contact TEXT NOT NULL,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    conn.commit()
    conn.close()

@app.template_filter('datetime')
def format_datetime(value, format='%d %b %Y at %H:%M'):
    if value is None:
        return ""
    try:
        return datetime.strptime(value, '%Y-%m-%d %H:%M:%S').strftime(format)
    except:
        return value

@app.route('/')
def home():
    return render_template("index.html")
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Get form data
        full_name = request.form.get("full_name", "").strip()
        roll_number = request.form.get("roll_number", "").strip()
        email = request.form.get("email", "").strip().lower()
        whatsapp = request.form.get("whatsapp", "").strip()
        password = request.form.get("password", "").strip()

        # Validate form data
        if not all([full_name, roll_number, email, whatsapp, password]):
            flash("❌ Error: All fields are required.", "danger")
            return redirect("/register")

        # Check if user already exists
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE email = ? OR whatsapp = ?", (email, whatsapp))
            if cursor.fetchone():
                flash("❌ Error: Email or WhatsApp number already exists.", "danger")
                return redirect("/register")

            # Create new user
            hashed_password = generate_password_hash(password)
            cursor.execute(
                "INSERT INTO users (full_name, roll_number, email, whatsapp, password) VALUES (?, ?, ?, ?, ?)",
                (full_name, roll_number, email, whatsapp, hashed_password)
            )
            conn.commit()
            flash("🎉 Registration successful! You can now log in.", "success")
            return redirect("/login")
        except Exception as e:
            flash(f"❌ Error: {str(e)}", "danger")
            return redirect("/register")
        finally:
            conn.close()
    
    return render_template("register.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "").strip()

        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id, password, full_name FROM users WHERE email = ?", (email,))
            user = cursor.fetchone()

            if user and check_password_hash(user["password"], password):
                session["user_id"] = user["id"]
                session["user_name"] = user["full_name"]
                flash("✅ Login successful!", "success")
                return redirect(url_for("dashboard"))
            else:
                flash("❌ Invalid email or password.", "danger")
        finally:
            conn.close()

    return render_template("login.html")

@app.route('/logout')
def logout():
    session.clear()
    flash("👋 You have been logged out.", "info")
    return redirect("/")

@app.route('/dashboard')
def dashboard():
    if "user_id" not in session:
        flash("⚠️ You need to log in first!", "warning")
        return redirect(url_for("login"))
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM reports 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        """, (session["user_id"],))
        reports = cursor.fetchall()
    finally:
        conn.close()

    return render_template(
        "dashboard.html", 
        user_name=session["user_name"], 
        reports=reports
    )

@app.route('/report', methods=['GET', 'POST'])
def report():
    if "user_id" not in session:
        flash("⚠️ You need to log in first!", "warning")
        return redirect(url_for("login"))
    
    if request.method == 'POST':
        item = request.form.get("item", "").strip()
        description = request.form.get("description", "").strip()
        location = request.form.get("location", "").strip()
        contact = request.form.get("contact", "").strip()

        if not all([item, description, location, contact]):
            flash("❌ Error: All fields are required.", "danger")
            return redirect(url_for("report"))
        
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO reports (user_id, item, description, location, contact) 
                VALUES (?, ?, ?, ?, ?)
            """, (session["user_id"], item, description, location, contact))
            conn.commit()
            flash("✅ Item reported successfully!", "success")
            return redirect(url_for("dashboard"))
        except Exception as e:
            flash(f"❌ Error: {str(e)}", "danger")
            return redirect(url_for("report"))
        finally:
            conn.close()
    
    return render_template("report.html")

@app.route('/generate_qr/<int:report_id>')
def generate_qr(report_id):
    if "user_id" not in session:
        flash("⚠️ You need to log in first!", "warning")
        return redirect(url_for("login"))
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM reports WHERE id = ? AND user_id = ?", (report_id, session["user_id"]))
        report = cursor.fetchone()

        if not report:
            flash("❌ Report not found or unauthorized access", "danger")
            return redirect(url_for("dashboard"))

        qr_data = f"LostItemID:{report['id']}|UserID:{report['user_id']}|Item:{report['item']}|Contact:{report['contact']}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        buffer = BytesIO()
        img.save(buffer, "PNG")
        buffer.seek(0)
        
        return send_file(buffer, mimetype="image/png")
    finally:
        conn.close()

@app.route('/verify_item', methods=['POST'])
def verify_item():
    if "user_id" not in session:
        return jsonify({"status": "error", "message": "Authentication required"}), 401
    
    qr_data = request.form.get('qr_data', '')
    uploaded_file = request.files.get('qr_file')

    if uploaded_file and uploaded_file.filename:
        try:
            img = Image.open(io.BytesIO(uploaded_file.read()))
            decoded = pyzbar.decode(img)
            if decoded:
                qr_data = decoded[0].data.decode('utf-8')
            else:
                return jsonify({"status": "error", "message": "No QR code found in image"}), 400
        except Exception as e:
            return jsonify({"status": "error", "message": f"Error processing image: {str(e)}"}), 400

    if not qr_data:
        return jsonify({"status": "error", "message": "No QR data provided"}), 400
    
    try:
        data_parts = qr_data.split('|')
        item_data = {}
        for part in data_parts:
            key, value = part.split(':', 1)
            item_data[key] = value
        
        report_id = int(item_data.get('LostItemID', 0))
        user_id = int(item_data.get('UserID', 0))
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.*, u.full_name, u.email, u.whatsapp 
            FROM reports r
            JOIN users u ON r.user_id = u.id
            WHERE r.id = ? AND r.user_id = ?
        """, (report_id, user_id))
        report = cursor.fetchone()
        
        if report:
            return jsonify({
                "status": "success",
                "data": {
                    "item": report['item'],
                    "description": report['description'],
                    "owner_name": report['full_name'],
                    "contact": report['contact'],
                    "email": report['email'],
                    "whatsapp": report['whatsapp']
                }
            })
        else:
            return jsonify({"status": "error", "message": "Item not found in database"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    initialize_database()
    app.run(debug=True)