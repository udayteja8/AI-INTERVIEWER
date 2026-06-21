from flask import Blueprint, request, jsonify
from models.user_model import users_collection
import bcrypt

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():

    data = request.json

    name = data.get("username")
    email = data["email"]
    password = data["password"]

    existing = users_collection.find_one(
        {"email": email}
    )

    if existing:
        return jsonify({
            "message": "User already exists"
        }),400

    hashed = bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    )

    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed
    })

    return jsonify({
        "message":"Signup Successful"
    })

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    user = users_collection.find_one({
        "email": email
    })

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    if bcrypt.checkpw(
        password.encode(),
        user["password"]
    ):

        return jsonify({
            "message": "Login Successful",
            "user": {
                "name": user["name"],
                "email": user["email"]
            }
        })

    return jsonify({
        "message": "Invalid Password"
    }), 401