from flask import Blueprint, jsonify, request
from models import db, Journal

main_bp = Blueprint("main", __name__)

@main_bp.route("/api/ping", methods=["GET"])
def ping():
    return jsonify({"message": "pong"})

# GET all journal entries
@main_bp.route("/api/journals", methods=["GET"])
def get_journals():
    journals = Journal.query.all()
    results = [{"id": j.id, "title": j.title, "content": j.content} for j in journals]
    return jsonify(results)

# POST a new journal entry
@main_bp.route("/api/journals", methods=["POST"])
def add_journal():
    data = request.get_json()
    if not data or "title" not in data or "content" not in data:
        return jsonify({"error": "Title and content required"}), 400

    new_entry = Journal(title=data["title"], content=data["content"])
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"id": new_entry.id, "title": new_entry.title, "content": new_entry.content}), 201

# DELETE a journal entry
@main_bp.route("/api/journals/<int:entry_id>", methods=["DELETE"])
def delete_journal(entry_id):
    entry = Journal.query.get(entry_id)
    if not entry:
        return jsonify({"error": "Entry not found"}), 404

    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": f"Entry {entry_id} deleted"})

# UPDATE a journal entry (PUT/PATCH)
@main_bp.route("/api/journals/<int:entry_id>", methods=["PUT", "PATCH"])
def update_journal(entry_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    entry = Journal.query.get(entry_id)
    if not entry:
        return jsonify({"error": "Entry not found"}), 404

    if "title" in data:
        entry.title = data["title"]
    if "content" in data:
        entry.content = data["content"]

    db.session.commit()

    return jsonify({"id": entry.id, "title": entry.title, "content": entry.content})

