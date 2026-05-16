import re
import os

with open('app.py', 'r') as f:
    content = f.read()

# 1. Add jwt_required() to all routes except the new login one we'll add
content = re.sub(r"(@app\.route\([^)]+\))\ndef ", r"\1\n@jwt_required()\ndef ", content)

# 2. Fix the hardcoded email password
content = content.replace("'EMAIL_PASSWORD', 'mmphcbriwfoxzglh'", "'EMAIL_PASSWORD'")

# 3. Fix the duplicate /api/notifications
dup_start = content.find("@app.route('/api/notifications', methods=['GET'])")
if dup_start != -1:
    next_route = content.find("@app.route('/api/stats', methods=['GET'])", dup_start)
    if next_route != -1:
        content = content[:dup_start] + content[next_route:]

# 4. Modify handle_documents to support file upload
doc_func_start = content.find("@app.route('/api/documents', methods=['GET', 'POST'])")
if doc_func_start != -1:
    new_doc_and_crud = """@app.route('/api/documents', methods=['GET', 'POST'])
@jwt_required()
def handle_documents():
    if request.method == 'GET':
        docs = Document.query.order_by(Document.timestamp.desc()).all()
        return jsonify([{
            "id": d.id, "name": d.name, "client_name": d.client_name,
            "type": d.type, "size": d.size, "category": d.category,
            "date": d.timestamp.strftime('%d %b %Y'),
            "file_path": d.file_path
        } for d in docs])
    
    # Handle File Upload
    if 'file' in request.files:
        file = request.files['file']
        if file.filename != '':
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            data = request.form
            new_doc = Document(
                name=filename,
                client_name=data.get('client_name', 'Unknown'),
                type=filename.split('.')[-1].upper() if '.' in filename else 'UNKNOWN',
                size=f"{len(file.read()) / 1024 / 1024:.2f} MB",
                category=data.get('category', 'General'),
                file_path=f"/uploads/{filename}"
            )
            db.session.add(new_doc)
            db.session.commit()
            return jsonify({"message": "Document saved", "id": new_doc.id}), 201
            
    # Fallback to JSON if no file uploaded
    data = request.json or {}
    new_doc = Document(**data)
    db.session.add(new_doc)
    db.session.commit()
    return jsonify({"message": "Document saved", "id": new_doc.id}), 201

@app.route('/uploads/<filename>')
@jwt_required()
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Missing CRUD Endpoints
@app.route('/api/clients/<int:client_id>', methods=['PUT', 'PATCH', 'DELETE'])
@jwt_required()
def update_client(client_id):
    client = Client.query.get_or_404(client_id)
    if request.method == 'DELETE':
        db.session.delete(client)
        db.session.commit()
        return jsonify({"message": "Client deleted"})
        
    data = request.json
    for key, value in data.items():
        if hasattr(client, key):
            setattr(client, key, value)
    db.session.commit()
    return jsonify({"message": "Client updated"})

@app.route('/api/tasks/<int:task_id>', methods=['PATCH', 'DELETE'])
@jwt_required()
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    if request.method == 'DELETE':
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted"})
        
    data = request.json
    if 'status' in data: task.status = data['status']
    if 'assignee' in data: task.assignee = data['assignee']
    if 'deadline' in data: task.deadline = data['deadline']
    if 'priority' in data: task.priority = data['priority']
    db.session.commit()
    return jsonify({"message": "Task updated"})

@app.route('/api/calendar', methods=['POST'])
@jwt_required()
def create_calendar_event():
    data = request.json
    new_event = CalendarEvent(**data)
    db.session.add(new_event)
    db.session.commit()
    return jsonify({"message": "Event created", "id": new_event.id}), 201

@app.route('/api/calendar/<int:event_id>', methods=['PATCH', 'DELETE'])
@jwt_required()
def update_calendar_event(event_id):
    event = CalendarEvent.query.get_or_404(event_id)
    if request.method == 'DELETE':
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "Event deleted"})
        
    data = request.json
    for key, value in data.items():
        if hasattr(event, key):
            setattr(event, key, value)
    db.session.commit()
    return jsonify({"message": "Event updated"})

# Auth Endpoint
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    if data and data.get('username') == 'admin' and data.get('password') == 'password':
        access_token = create_access_token(identity='admin')
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=8080)
"""
    content = content[:doc_func_start] + new_doc_and_crud

with open('app.py', 'w') as f:
    f.write(content)
