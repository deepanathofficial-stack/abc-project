"""
ABC Consultant — Backend API
-----------------------------
A small Flask app that accepts enquiry submissions from the
frontend (name, phone number, email id) and stores them in a
MySQL database created via database/schema.sql (MySQL Workbench).

Run:
    pip install -r requirements.txt
    python app.py

The API starts on http://localhost:5000
"""

import re
import mysql.connector
from mysql.connector import Error
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow the frontend (served separately) to call this API

# ----------------------------------------------------------------
# Database configuration — edit these to match your MySQL Workbench
# connection (Local instance defaults shown).
# ----------------------------------------------------------------
DB_CONFIG = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "Hari12345.",   # <-- change this
    "database": "abc_consultant",
}

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHONE_RE = re.compile(r"^[0-9+\-\s()]{7,20}$")


def get_connection():
    return mysql.connector.connect(**DB_CONFIG)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/enquiry", methods=["POST"])
def create_enquiry():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    phone = (data.get("phone") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    # ---- validation -------------------------------------------------
    errors = {}
    if not name:
        errors["name"] = "Name is required."
    if not phone:
        errors["phone"] = "Phone number is required."
    elif not PHONE_RE.match(phone):
        errors["phone"] = "Enter a valid phone number."
    if not email:
        errors["email"] = "Email id is required."
    elif not EMAIL_RE.match(email):
        errors["email"] = "Enter a valid email id."

    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    # ---- save to MySQL ------------------------------------------------
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO enquiries (name, phone_number, email_id, message)
            VALUES (%s, %s, %s, %s)
            """,
            (name, phone, email, message),
        )
        conn.commit()
        new_id = cursor.lastrowid
        cursor.close()
        conn.close()
    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500

    return jsonify({"success": True, "id": new_id}), 201


@app.route("/api/enquiries", methods=["GET"])
def list_enquiries():
    """Optional: view all submitted enquiries (e.g. for an admin page)."""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM enquiries ORDER BY created_at DESC")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
    except Error as e:
        return jsonify({"success": False, "error": str(e)}), 500

    for row in rows:
        row["created_at"] = row["created_at"].isoformat()

    return jsonify({"success": True, "data": rows})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
