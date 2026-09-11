from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_pymongo import PyMongo
from flask_cors import CORS
from dotenv import load_dotenv
from functools import wraps
import bcrypt
import os
from bson import ObjectId
from bson.errors import InvalidId
from flask import Flask, request, jsonify, render_template, session, redirect, url_for

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Secret key for sessions
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key-change-this")

# Allow frontend/API requests
CORS(app)

# MongoDB
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

mongo = PyMongo(app)


# ==========================================
# ROLE PROTECTION DECORATOR
# ==========================================

def role_required(required_role):

    def decorator(function):

        @wraps(function)
        def wrapper(*args, **kwargs):

            # Check if user is logged in
            if "user_id" not in session:
                return redirect(url_for("login"))

            # Check role
            if session.get("role") != required_role:
                return render_template(
                    "unauthorized.html"
                ), 403

            return function(*args, **kwargs)

        return wrapper

    return decorator


# ==========================================
# LOGIN PAGE
# ==========================================

@app.route("/")
def login():
    return render_template("login.html")


# ==========================================
# LOGIN API
# ==========================================

@app.route("/login", methods=["POST"])
def login_user():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:

        return jsonify({
            "message": "Email and password are required"
        }), 400


    # Find user
    user = mongo.db.users.find_one({
        "email": email
    })


    if not user:

        return jsonify({
            "message": "Invalid email or password"
        }), 401


    # Check password field
    if "password" not in user:

        return jsonify({
            "message": "Invalid user data"
        }), 500


    # Verify password
    password_correct = bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8")
    )


    if not password_correct:

        return jsonify({
            "message": "Invalid email or password"
        }), 401


    # ======================================
    # CREATE SESSION
    # ======================================

    session["user_id"] = str(user["_id"])
    session["name"] = user["name"]
    session["email"] = user["email"]
    session["role"] = user["role"]


    return jsonify({

        "message": "Login successful",

        "name": user["name"],

        "email": user["email"],

        "role": user["role"]

    }), 200


# ==========================================
# LOGOUT
# ==========================================

@app.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("login"))


# ==========================================
# ADMIN DASHBOARD
# ==========================================

@app.route("/dashboard/admin")
@role_required("admin")
def admin_dashboard():

    return render_template(
        "admin_dashboard.html"
    )


# ==========================================
# TEACHER DASHBOARD
# ==========================================

@app.route("/dashboard/teacher")
@role_required("teacher")
def teacher_dashboard():

    return render_template(
        "teacher_dashboard.html"
    )


# ==========================================
# STUDENT DASHBOARD
# ==========================================

@app.route("/dashboard/student")
@role_required("student")
def student_dashboard():

    return render_template(
        "student_dashboard.html"
    )


# ==========================================
# PARENT DASHBOARD
# ==========================================

@app.route("/dashboard/parent")
@role_required("parent")
def parent_dashboard():

    return render_template(
        "parent_dashboard.html"
    )


# ==========================================
# ACCOUNTANT DASHBOARD
# ==========================================

@app.route("/dashboard/accountant")
@role_required("accountant")
def accountant_dashboard():

    return render_template(
        "accountant_dashboard.html"
    )


# ==========================================
# UNAUTHORIZED
# ==========================================

@app.route("/unauthorized")
def unauthorized():

    return render_template(
        "unauthorized.html"
    ), 403


# ==========================================
# CREATE USER API
# ==========================================

@app.route("/create-user", methods=["POST"])
def create_user():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")


    if not name or not email or not password or not role:

        return jsonify({
            "message": "All fields are required"
        }), 400


    # Check existing user
    existing_user = mongo.db.users.find_one({
        "email": email
    })


    if existing_user:

        return jsonify({
            "message": "User already exists"
        }), 409


    # Hash password
    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )


    user = {

        "name": name,

        "email": email,

        "password": hashed_password.decode("utf-8"),

        "role": role

    }


    mongo.db.users.insert_one(user)


    return jsonify({
        "message": "User created successfully"
    }), 201


# ==========================================
# TEST DATABASE
# ==========================================

@app.route("/test-db")
def test_db():

    try:

        mongo.db.command("ping")

        return f"""
        MongoDB Connected Successfully! 🚀
        <br>
        Database Name: {mongo.db.name}
        """

    except Exception as e:

        return f"MongoDB Connection Failed: {e}"


# ==========================================
# RUN APPLICATION


# ==========================================
# ================= STUDENT API =================

@app.route("/api/students", methods=["POST"])
@role_required("admin")
def add_student():

    data = request.get_json()

    student_id = data.get("student_id")
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    class_name = data.get("class_name")
    section = data.get("section")

    # Check required fields
    if not all([
        student_id,
        name,
        email,
        phone,
        class_name,
        section
    ]):
        return jsonify({
            "message": "All fields are required"
        }), 400

    # Check duplicate Student ID
    existing_student = mongo.db.students.find_one({
        "student_id": student_id
    })

    if existing_student:
        return jsonify({
            "message": "Student ID already exists"
        }), 409

    # Create student document
    student = {
        "student_id": student_id,
        "name": name,
        "email": email,
        "phone": phone,
        "class_name": class_name,
        "section": section
    }

    result = mongo.db.students.insert_one(student)

    return jsonify({
        "message": "Student added successfully",
        "student_id": str(result.inserted_id)
    }), 201


# ================= GET STUDENTS =================

@app.route("/api/students", methods=["GET"])
@role_required("admin")
def get_students():

    students = list(
        mongo.db.students.find()
    )

    for student in students:
        student["_id"] = str(student["_id"])

    return jsonify(students), 200


# ================= DELETE STUDENT =================

@app.route("/api/students/<student_id>", methods=["DELETE"])
@role_required("admin")
def delete_student(student_id):

    try:

        object_id = ObjectId(student_id)

    except InvalidId:

        return jsonify({
            "message": "Invalid student ID"
        }), 400


    result = mongo.db.students.delete_one({
        "_id": object_id
    })


    if result.deleted_count == 0:

        return jsonify({
            "message": "Student not found"
        }), 404


    return jsonify({
        "message": "Student deleted successfully"
    }), 200


@app.route("/students")
@role_required("admin")
def students():
    return render_template("student.html")

# ================= UPDATE STUDENT =================

@app.route("/api/students/<student_id>", methods=["PUT"])
@role_required("admin")
def update_student(student_id):

    try:
        object_id = ObjectId(student_id)

    except InvalidId:
        return jsonify({
            "message": "Invalid student ID"
        }), 400

    data = request.get_json()

    student_id_value = data.get("student_id")
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    class_name = data.get("class_name")
    section = data.get("section")

    if not all([
        student_id_value,
        name,
        email,
        phone,
        class_name,
        section
    ]):
        return jsonify({
            "message": "All fields are required"
        }), 400

    # Check if another student already has this Student ID
    existing_student = mongo.db.students.find_one({
        "student_id": student_id_value,
        "_id": {"$ne": object_id}
    })

    if existing_student:
        return jsonify({
            "message": "Student ID already exists"
        }), 409

    mongo.db.students.update_one(
        {"_id": object_id},
        {
            "$set": {
                "student_id": student_id_value,
                "name": name,
                "email": email,
                "phone": phone,
                "class_name": class_name,
                "section": section
            }
        }
    )

    return jsonify({
        "message": "Student updated successfully"
    }), 200
# =========================================================
# TIMETABLE
# =========================================================

# Timetable page
@app.route("/timetable")
@role_required("admin")
def timetable_page():
    return render_template("timetable.html")


# Get teachers for timetable dropdown
@app.route("/api/teachers", methods=["GET"])
@role_required("admin")
def get_teachers():

    teachers = list(
        mongo.db.users.find(
            {"role": "teacher"},
            {"password": 0}
        )
    )

    for teacher in teachers:
        teacher["_id"] = str(teacher["_id"])

    return jsonify(teachers), 200


# Add timetable lecture
@app.route("/api/timetable", methods=["POST"])
@role_required("admin")
def add_timetable():

    data = request.get_json()

    day = data.get("day")
    start_time = data.get("start_time")
    end_time = data.get("end_time")
    class_name = data.get("class_name")
    section = data.get("section")
    subject = data.get("subject")
    teacher_id = data.get("teacher_id")

    if not all([
        day,
        start_time,
        end_time,
        class_name,
        section,
        subject,
        teacher_id
    ]):
        return jsonify({
            "message": "All fields are required"
        }), 400

    # Find teacher
    try:
        teacher = mongo.db.users.find_one({
            "_id": ObjectId(teacher_id),
            "role": "teacher"
        })
    except InvalidId:
        return jsonify({
            "message": "Invalid teacher ID"
        }), 400

    if not teacher:
        return jsonify({
            "message": "Teacher not found"
        }), 404

    lecture = {
        "day": day,
        "start_time": start_time,
        "end_time": end_time,
        "class_name": class_name,
        "section": section,
        "subject": subject,
        "teacher_id": teacher_id,
        "teacher_name": teacher["name"]
    }

    mongo.db.timetable.insert_one(lecture)

    return jsonify({
        "message": "Lecture added successfully"
    }), 201


# Get timetable
@app.route("/api/timetable", methods=["GET"])
@role_required("admin")
def get_timetable():

    timetable = list(
        mongo.db.timetable.find().sort([
            ("day", 1),
            ("start_time", 1)
        ])
    )

    for lecture in timetable:
        lecture["_id"] = str(lecture["_id"])

    return jsonify(timetable), 200


# Delete timetable lecture
@app.route("/api/timetable/<lecture_id>", methods=["DELETE"])
@role_required("admin")
def delete_timetable(lecture_id):

    try:
        object_id = ObjectId(lecture_id)
    except InvalidId:
        return jsonify({
            "message": "Invalid lecture ID"
        }), 400

    result = mongo.db.timetable.delete_one({
        "_id": object_id
    })

    if result.deleted_count == 0:
        return jsonify({
            "message": "Lecture not found"
        }), 404

    return jsonify({
        "message": "Lecture deleted successfully"
    }), 200
# =========================================================
# TEACHER TIMETABLE
# =========================================================

@app.route("/api/teacher/timetable", methods=["GET"])
@role_required("teacher")
def get_teacher_timetable():

    # Get logged-in teacher ID from session
    teacher_id = session.get("user_id")

    # Find lectures assigned to this teacher
    timetable = list(
        mongo.db.timetable.find({
            "teacher_id": teacher_id
        }).sort([
            ("day", 1),
            ("start_time", 1)
        ])
    )

    # Convert MongoDB ObjectId to string
    for lecture in timetable:
        lecture["_id"] = str(lecture["_id"])

    return jsonify(timetable), 200
# =========================================================
# ATTENDANCE SYSTEM
# =========================================================


# ---------------------------------------------------------
# ATTENDANCE PAGE
# ---------------------------------------------------------

@app.route("/attendance/<lecture_id>")
@role_required("teacher")
def attendance_page(lecture_id):

    try:
        lecture_object_id = ObjectId(lecture_id)

    except InvalidId:

        return jsonify({
            "message": "Invalid lecture ID"
        }), 400


    # Get logged-in teacher
    teacher_id = session.get("user_id")


    # Find lecture
    lecture = mongo.db.timetable.find_one({
        "_id": lecture_object_id,
        "teacher_id": teacher_id
    })


    # Teacher cannot access another teacher's lecture
    if not lecture:

        return render_template(
            "unauthorized.html"
        ), 403


    return render_template(
        "attendance.html",
        lecture_id=lecture_id
    )


# ---------------------------------------------------------
# GET LECTURE DETAILS + STUDENTS
# ---------------------------------------------------------

@app.route(
    "/api/attendance/<lecture_id>/students",
    methods=["GET"]
)
@role_required("teacher")
def get_attendance_students(lecture_id):

    try:

        lecture_object_id = ObjectId(lecture_id)

    except InvalidId:

        return jsonify({
            "message": "Invalid lecture ID"
        }), 400


    # Logged-in teacher
    teacher_id = session.get("user_id")


    # Find lecture belonging to teacher
    lecture = mongo.db.timetable.find_one({

        "_id": lecture_object_id,

        "teacher_id": teacher_id

    })


    if not lecture:

        return jsonify({
            "message": "Lecture not found or unauthorized"
        }), 403


    # Find students from the same class and section
    students = list(
        mongo.db.students.find({

            "class_name": lecture["class_name"],

            "section": lecture["section"]

        }).sort([
            ("student_id", 1)
        ])
    )


    # Convert ObjectId
    for student in students:

        student["_id"] = str(
            student["_id"]
        )


    # Check whether attendance already exists for today
    from datetime import datetime

    today = datetime.now().strftime("%Y-%m-%d")


    existing_attendance = mongo.db.attendance.find_one({

        "lecture_id": lecture_id,

        "date": today

    })


    return jsonify({

        "lecture": {

            "_id": str(lecture["_id"]),

            "subject": lecture["subject"],

            "class_name": lecture["class_name"],

            "section": lecture["section"],

            "day": lecture["day"],

            "start_time": lecture["start_time"],

            "end_time": lecture["end_time"],

            "teacher_name": lecture["teacher_name"]

        },

        "students": students,

        "attendance_exists": existing_attendance is not None

    }), 200


# ---------------------------------------------------------
# SAVE ATTENDANCE
# ---------------------------------------------------------

@app.route(
    "/api/attendance",
    methods=["POST"]
)
@role_required("teacher")
def save_attendance():

    data = request.get_json()


    lecture_id = data.get("lecture_id")

    attendance_date = data.get("date")

    attendance_list = data.get("attendance")


    # Validate data
    if not lecture_id:

        return jsonify({
            "message": "Lecture ID is required"
        }), 400


    if not attendance_date:

        return jsonify({
            "message": "Attendance date is required"
        }), 400


    if not attendance_list:

        return jsonify({
            "message": "Attendance data is required"
        }), 400


    # Validate lecture ID
    try:

        lecture_object_id = ObjectId(
            lecture_id
        )

    except InvalidId:

        return jsonify({
            "message": "Invalid lecture ID"
        }), 400


    # Logged-in teacher
    teacher_id = session.get("user_id")


    # Find lecture
    lecture = mongo.db.timetable.find_one({

        "_id": lecture_object_id,

        "teacher_id": teacher_id

    })


    # Prevent teacher from submitting another teacher's lecture
    if not lecture:

        return jsonify({
            "message": "Lecture not found or unauthorized"
        }), 403


    # -----------------------------------------------------
    # PREPARE ATTENDANCE DATA
    # -----------------------------------------------------

    students_attendance = []


    for item in attendance_list:

        student_id = item.get("student_id")

        status = item.get("status")


        if not student_id:

            continue


        # Only allow these two values
        if status not in ["Present", "Absent"]:

            return jsonify({

                "message":
                "Invalid attendance status"

            }), 400


        # Verify student exists
        student = mongo.db.students.find_one({

            "student_id": student_id,

            "class_name":
                lecture["class_name"],

            "section":
                lecture["section"]

        })


        if not student:

            return jsonify({

                "message":
                f"Student {student_id} not found"

            }), 404


        students_attendance.append({

            "student_id":
                student["student_id"],

            "student_name":
                student["name"],

            "status":
                status

        })


    if not students_attendance:

        return jsonify({

            "message":
            "No valid students found"

        }), 400


    # -----------------------------------------------------
    # ATTENDANCE DOCUMENT
    # -----------------------------------------------------

    attendance_document = {

        "lecture_id":
            lecture_id,

        "teacher_id":
            teacher_id,

        "teacher_name":
            lecture["teacher_name"],

        "subject":
            lecture["subject"],

        "class_name":
            lecture["class_name"],

        "section":
            lecture["section"],

        "date":
            attendance_date,

        "start_time":
            lecture["start_time"],

        "end_time":
            lecture["end_time"],

        "students":
            students_attendance

    }


    # -----------------------------------------------------
    # PREVENT DUPLICATE ATTENDANCE
    # -----------------------------------------------------

    existing_attendance = mongo.db.attendance.find_one({

        "lecture_id":
            lecture_id,

        "date":
            attendance_date

    })


    if existing_attendance:

        return jsonify({

            "message":
            "Attendance has already been submitted for this lecture today."

        }), 409


    # -----------------------------------------------------
    # SAVE
    # -----------------------------------------------------

    mongo.db.attendance.insert_one(
        attendance_document
    )


    return jsonify({

        "message":
        "Attendance submitted successfully"

    }), 201
# =========================================================
# TEACHER ATTENDANCE HISTORY
# =========================================================

@app.route("/attendance-history")
@role_required("teacher")
def attendance_history_page():
    return render_template("attendance_history.html")


# =========================================================
# GET TEACHER ATTENDANCE HISTORY
# =========================================================

@app.route("/api/teacher/attendance-history", methods=["GET"])
@role_required("teacher")
def get_teacher_attendance_history():

    teacher_id = session.get("user_id")

    attendance_records = list(
        mongo.db.attendance.find({
            "teacher_id": teacher_id
        }).sort([
            ("date", -1),
            ("start_time", -1)
        ])
    )

    history = []

    for record in attendance_records:

        students = record.get("students", [])

        present_count = 0
        absent_count = 0

        for student in students:

            if student.get("status") == "Present":
                present_count += 1

            elif student.get("status") == "Absent":
                absent_count += 1

        history.append({
            "_id": str(record["_id"]),
            "lecture_id": record.get("lecture_id"),
            "subject": record.get("subject", ""),
            "class_name": record.get("class_name", ""),
            "section": record.get("section", ""),
            "date": record.get("date", ""),
            "start_time": record.get("start_time", ""),
            "end_time": record.get("end_time", ""),
            "teacher_name": record.get("teacher_name", ""),
            "total_students": len(students),
            "present": present_count,
            "absent": absent_count
        })

    return jsonify(history), 200


# =========================================================
# GET SINGLE ATTENDANCE DETAILS
# =========================================================

@app.route("/api/teacher/attendance-history/<attendance_id>",
           methods=["GET"])
@role_required("teacher")
def get_attendance_details(attendance_id):

    try:
        attendance_object_id = ObjectId(attendance_id)

    except InvalidId:

        return jsonify({
            "message": "Invalid attendance ID"
        }), 400


    teacher_id = session.get("user_id")


    attendance = mongo.db.attendance.find_one({
        "_id": attendance_object_id,
        "teacher_id": teacher_id
    })


    if not attendance:

        return jsonify({
            "message": "Attendance record not found or unauthorized"
        }), 404


    attendance["_id"] = str(attendance["_id"])


    return jsonify(attendance), 200

if __name__ == "__main__":

    app.run(debug=True)