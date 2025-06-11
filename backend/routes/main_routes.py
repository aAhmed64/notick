from flask import Blueprint, request, jsonify
from models import db, Journal
import json
from flask_jwt_extended import jwt_required, get_jwt_identity

main_bp = Blueprint("main", __name__)  # <- Make sure you register this in your app

@main_bp.route('/api/journals', methods=['GET'])
@jwt_required()
def get_journals():
    user_id = get_jwt_identity()
    journals = Journal.query.filter_by(user_id=user_id).all()
    return jsonify([j.to_dict() for j in journals])

@main_bp.route('/api/journals', methods=['POST'])
@jwt_required()
def create_journal():
    user_id = get_jwt_identity()
    data = request.json

    journal_type = data.get('type', 'note')
    content = data.get('content', '' if journal_type == 'note' else [])
    content_str = json.dumps(content) if journal_type == 'ai_chat' else content

    journal = Journal(
        title=data.get('title', ''),
        description=data.get('description'),
        content=content_str,
        type=journal_type,
        user_id=user_id
    )
    db.session.add(journal)
    db.session.commit()
    return jsonify(journal.to_dict()), 201

@main_bp.route('/api/journals/<int:journal_id>', methods=['PUT'])
@jwt_required()
def update_journal(journal_id):
    user_id = get_jwt_identity()
    journal = Journal.query.filter_by(id=journal_id, user_id=user_id).first()
    if not journal:
        return jsonify({'error': 'Journal not found'}), 404

    data = request.json
    journal.title = data.get('title', journal.title)
    journal.description = data.get('description', journal.description)
    journal.type = data.get('type', journal.type)

    content = data.get('content', journal.content)
    journal.content = json.dumps(content) if journal.type == 'ai_chat' and isinstance(content, list) else content

    db.session.commit()
    return jsonify(journal.to_dict())

@main_bp.route('/api/journals/<int:journal_id>', methods=['DELETE'])
@jwt_required()
def delete_journal(journal_id):
    user_id = get_jwt_identity()
    journal = Journal.query.filter_by(id=journal_id, user_id=user_id).first()
    if not journal:
        return jsonify({'error': 'Journal not found'}), 404

    db.session.delete(journal)
    db.session.commit()
    return jsonify({'message': 'Deleted successfully'})

@main_bp.route('/api/journals/<int:journal_id>/message', methods=['POST'])
@jwt_required()
def send_ai_message(journal_id):
    user_id = get_jwt_identity()
    journal = Journal.query.filter_by(id=journal_id, user_id=user_id).first()
    if not journal:
        return jsonify({"error": "Journal not found"}), 404

    if journal.type != 'ai_chat':
        return jsonify({"error": "Journal is not an AI chat"}), 400

    data = request.json
    user_message = data.get('message', '').strip()
    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    try:
        conversation = json.loads(journal.content) if journal.content else []
    except json.JSONDecodeError:
        conversation = []

    conversation.append({'role': 'user', 'content': user_message})

    # Replace this with real AI logic
    ai_response = f"AI Reply to: {user_message}"
    conversation.append({'role': 'ai', 'content': ai_response})

    journal.content = json.dumps(conversation)
    db.session.commit()

    return jsonify({
        'conversation': conversation,
        'ai_response': ai_response
    })
