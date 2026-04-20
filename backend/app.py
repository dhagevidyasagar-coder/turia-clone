from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///turia_practice.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models
class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(20), default='Silver') # Platinum, Gold, Silver
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    status = db.Column(db.String(20), default='Active')

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    priority = db.Column(db.String(20), default='Medium')
    deadline = db.Column(db.String(50))
    assignee = db.Column(db.String(100))
    status = db.Column(db.String(20), default='To Do')

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(100))
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    type = db.Column(db.String(10), default='sent') # sent, received, system

# Create database and initial mock data
with app.app_context():
    db.create_all()
    
    # Check if we already have data
    if not Client.query.first():
        # Seed Clients
        c1 = Client(name='Reliance Industries', category='Platinum', email='contact@reliance.com', phone='+91 98273 12345', location='Mumbai', status='Active')
        c2 = Client(name='Tata Consultancy Services', category='Gold', email='support@tcs.com', phone='+91 91234 56789', location='Pune', status='Active')
        db.session.add(c1)
        db.session.add(c2)
        
        # Seed Tasks
        t1 = Task(title='GST-3B Monthly Filing', client_id=1, priority='High', deadline='20th Apr', assignee='Mehul S.', status='In Progress')
        db.session.add(t1)
        
        db.session.commit()

# API Endpoints
@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({
        "total_clients": Client.query.count(),
        "active_tasks": Task.query.filter(Task.status != 'Completed').count(),
        "completed_mtd": 89, # Mocked for now
        "pending_compliance": 24 # Mocked for now
    })

@app.route('/api/clients', methods=['GET', 'POST'])
def handle_clients():
    if request.method == 'GET':
        clients = Client.query.all()
        return jsonify([{
            "id": c.id, "name": c.name, "category": c.category,
            "email": c.email, "phone": c.phone, "location": c.location, "status": c.status
        } for c in clients])
    
    data = request.json
    new_client = Client(**data)
    db.session.add(new_client)
    db.session.commit()
    return jsonify({"message": "Client created successfully", "id": new_client.id}), 201

@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'GET':
        tasks = Task.query.all()
        return jsonify([{
            "id": t.id, "title": t.title, "priority": t.priority,
            "deadline": t.deadline, "assignee": t.assignee, "status": t.status
        } for t in tasks])
    
    data = request.json
    new_task = Task(**data)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task created successfully", "id": new_task.id}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
