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
    category = db.Column(db.String(20), default='Silver')
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    entity_type = db.Column(db.String(50))
    services = db.Column(db.String(200))
    employees = db.Column(db.Integer, default=0)
    auditor = db.Column(db.String(100))
    status = db.Column(db.String(20), default='Active')
    # GST & Address Fields
    gstin = db.Column(db.String(15))
    place_of_supply = db.Column(db.String(50))
    address = db.Column(db.Text)
    # Statutory Details
    cin_llp = db.Column(db.String(21))
    tan = db.Column(db.String(10))
    pan = db.Column(db.String(10))
    udyam = db.Column(db.String(19))
    professional_tax = db.Column(db.String(50))
    esi_no = db.Column(db.String(50))
    pf_no = db.Column(db.String(50))

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), default='General') # GST, MCA, TDS/TCS, etc.
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    priority = db.Column(db.String(20), default='Medium')
    deadline = db.Column(db.String(50))
    assignee = db.Column(db.String(100))
    status = db.Column(db.String(20), default='To Do')

class ComplianceRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50)) # GST, TDS, ITR, etc.
    deadline = db.Column(db.String(50))
    status = db.Column(db.String(20), default='Pending') # Pending, Filed, Overdue
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    client_name = db.Column(db.String(100)) # Cached for easy retrieval
    ack_no = db.Column(db.String(100)) # Acknowledgement Number
    last_sync = db.Column(db.DateTime, default=datetime.utcnow)

class CalendarEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50)) # Task, Recurring, To Do, Notice, Lead, Holiday
    date = db.Column(db.String(50)) # YYYY-MM-DD
    client_name = db.Column(db.String(100))
    status = db.Column(db.String(20)) # Completed, Pending, In Progress, Holiday
    user_name = db.Column(db.String(100))

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    message = db.Column(db.Text)
    type = db.Column(db.String(50)) # Overdue, Reminder, System
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.String(50)) # Target user

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    sender = db.Column(db.String(100))
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    type = db.Column(db.String(10), default='sent') 
    is_whatsapp = db.Column(db.Boolean, default=True)

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(100))
    amount = db.Column(db.Float)
    status = db.Column(db.String(20), default='Unpaid') # Unpaid, Paid, Overdue
    date = db.Column(db.String(50))
    invoice_no = db.Column(db.String(50))

class DSCRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(100))
    expiry_date = db.Column(db.String(50))
    provider = db.Column(db.String(100))
    status = db.Column(db.String(20), default='Active') # Active, Expiring Soon, Expired

# Create database and initial mock data
with app.app_context():
    db.create_all()
    
    # Check if we already have data
    if not Client.query.first():
        # Seed Clients
        c1 = Client(
            name='Reliance Industries', category='Platinum', email='contact@reliance.com', phone='+91 98273 12345', 
            location='Mumbai', entity_type='Public Ltd', services='Audit, Tax, GST', employees=250000, auditor='Vidyasagar D.', status='Active'
        )
        c2 = Client(
            name='Tata Consultancy Services', category='Gold', email='support@tcs.com', phone='+91 91234 56789', 
            location='Pune', entity_type='Public Ltd', services='Consulting, Tax', employees=600000, auditor='Sarah J.', status='Active'
        )
        db.session.add(c1)
        db.session.add(c2)
        
        # Seed Tasks
        t1 = Task(title='GST-3B Monthly Filing', category='GST', client_id=1, priority='High', deadline='20th Apr', assignee='Mehul S.', status='In Progress')
        t2 = Task(title='TDS Quarterly Return', category='TDS / TCS', client_id=2, priority='High', deadline='31st May', assignee='Sarah J.', status='To Do')
        t3 = Task(title='MCA Annual Filing', category='MCA', client_id=1, priority='Critical', deadline='30th Oct', assignee='Rahul K.', status='To Do')
        t4 = Task(title='Advance Tax Payment', category='Advance Tax', client_id=1, priority='Medium', deadline='15th Jun', assignee='Mehul S.', status='To Do')
        t5 = Task(title='Income Tax Audit', category='Income Tax', client_id=2, priority='High', deadline='30th Sep', assignee='Sarah J.', status='To Do')
        
        # Seed Compliance Records
        cr1 = ComplianceRecord(title='GSTR-1 Monthly', category='GST', deadline='2024-04-11', status='Filed', client_id=1, client_name='Reliance Industries')
        cr2 = ComplianceRecord(title='GSTR-3B Monthly', category='GST', deadline='2024-04-20', status='Pending', client_id=1, client_name='Reliance Industries')
        cr3 = ComplianceRecord(title='TDS Payment', category='TDS', deadline='2024-04-07', status='Overdue', client_id=2, client_name='Tata Consultancy Services')
        cr4 = ComplianceRecord(title='ITR-6 Filing', category='Income Tax', deadline='2024-10-31', status='Pending', client_id=1, client_name='Reliance Industries')
        
        # Seed Calendar Events
        e1 = CalendarEvent(title='GST R-3B Monthly', type='Recurring', date='2024-04-20', client_name='Reliance Ind.', status='Pending', user_name='Mehul S.')
        e2 = CalendarEvent(title='Income Tax Notice Hearing', type='Notice', date='2024-04-22', client_name='California Burrito', status='In Progress', user_name='Vidyasagar D.')
        e3 = CalendarEvent(title='Follow up with new Lead', type='Lead', date='2024-04-18', client_name='Turia Industries', status='Completed', user_name='Rahul K.')
        e4 = CalendarEvent(title='Labour Day', type='Holiday', date='2024-05-01', status='Holiday')
        e5 = CalendarEvent(title='TDS Return Filing', type='Task', date='2024-04-20', client_name='TCS', status='Pending', user_name='Sarah J.')
        e6 = CalendarEvent(title='Board Meeting', type='To Do', date='2024-04-20', client_name='HDFC', status='Pending', user_name='Mehul S.')
        
        # Seed Billing
        inv1 = Invoice(client_name='Reliance Industries', amount=15000.0, status='Unpaid', date='2024-04-15', invoice_no='INV-2024-001')
        inv2 = Invoice(client_name='Tata Consultancy Services', amount=25000.0, status='Paid', date='2024-03-20', invoice_no='INV-2024-002')
        
        # Seed DSC
        dsc1 = DSCRecord(client_name='Vidyasagar Dhage', expiry_date='2024-05-15', provider='eMudhra', status='Expiring Soon')
        dsc2 = DSCRecord(client_name='Reliance Industries', expiry_date='2025-10-20', provider='Vsign', status='Active')

        db.session.add_all([t1, t2, t3, t4, t5, cr1, cr2, cr3, cr4, e1, e2, e3, e4, e5, e6, inv1, inv2, dsc1, dsc2])
        
        db.session.commit()

# API Endpoints
@app.route('/api/calendar', methods=['GET'])
def get_calendar():
    events = CalendarEvent.query.all()
    return jsonify([{
        "id": e.id, "title": e.title, "type": e.type,
        "date": e.date, "client_name": e.client_name,
        "status": e.status, "user_name": e.user_name
    } for e in events])
@app.route('/api/messages', methods=['GET', 'POST'])
def handle_messages():
    if request.method == 'GET':
        client_id = request.args.get('client_id')
        if client_id:
            messages = Message.query.filter_by(client_id=client_id).order_by(Message.timestamp).all()
        else:
            messages = Message.query.order_by(Message.timestamp).all()
        return jsonify([{
            "id": m.id, "text": m.text, "sender": m.sender,
            "timestamp": m.timestamp.strftime('%H:%M'), "type": m.type
        } for m in messages])
    
    data = request.json
    new_msg = Message(
        client_id=data.get('client_id'),
        text=data.get('text'),
        sender=data.get('sender', 'Me'),
        type=data.get('type', 'sent')
    )
    db.session.add(new_msg)
    db.session.commit()
    return jsonify({"message": "Message sent", "id": new_msg.id}), 201

@app.route('/api/notifications', methods=['GET', 'POST'])
def handle_notifications():
    if request.method == 'GET':
        notifs = Notification.query.order_by(Notification.timestamp.desc()).all()
        return jsonify([{
            "id": n.id, "title": n.title, "message": n.message,
            "type": n.type, "timestamp": n.timestamp.strftime('%H:%M'), "is_read": n.is_read
        } for n in notifs])
    
    data = request.json
    new_notif = Notification(**data)
    db.session.add(new_notif)
    db.session.commit()
    return jsonify({"message": "Notification created", "id": new_notif.id}), 201


@app.route('/api/compliance/sync', methods=['POST'])
def sync_compliance():
    from datetime import datetime as dt
    import random
    # Simulate a real-time sync with Government Portals (GSTN, IT)
    records = ComplianceRecord.query.all()
    for r in records:
        if r.status == 'Pending' and random.random() > 0.7:
            r.status = 'Filed'
            r.ack_no = f"ACK-{random.randint(100000, 999999)}"
        r.last_sync = dt.utcnow()
    db.session.commit()
    return jsonify({"message": "Compliance data synced with Government portals successfully"})

@app.route('/api/compliance', methods=['GET'])
def get_compliance():
    records = ComplianceRecord.query.order_by(ComplianceRecord.deadline).all()
    return jsonify([{
        "id": r.id, "title": r.title, "category": r.category,
        "deadline": r.deadline, "status": r.status,
        "client_name": r.client_name,
        "ack_no": r.ack_no,
        "last_sync": r.last_sync.strftime('%Y-%m-%d %H:%M') if r.last_sync else None
    } for r in records])
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
            "email": c.email, "phone": c.phone, "location": c.location,
            "entity_type": c.entity_type, "services": c.services,
            "employees": c.employees, "auditor": c.auditor, "status": c.status,
            "gstin": c.gstin, "place_of_supply": c.place_of_supply, "address": c.address,
            "cin_llp": c.cin_llp, "tan": c.tan, "pan": c.pan, "udyam": c.udyam,
            "professional_tax": c.professional_tax, "esi_no": c.esi_no, "pf_no": c.pf_no
        } for c in clients])
    
    data = request.json
    new_client = Client(**data)
    db.session.add(new_client)
    db.session.commit()
    return jsonify({"message": "Client created successfully", "id": new_client.id}), 201

@app.route('/api/invoices', methods=['GET'])
def get_invoices():
    invoices = Invoice.query.all()
    return jsonify([{
        "id": i.id, "client_name": i.client_name, "amount": i.amount,
        "status": i.status, "date": i.date, "invoice_no": i.invoice_no
    } for i in invoices])

@app.route('/api/dsc', methods=['GET'])
def get_dsc():
    records = DSCRecord.query.all()
    return jsonify([{
        "id": r.id, "client_name": r.client_name, "expiry_date": r.expiry_date,
        "provider": r.provider, "status": r.status
    } for r in records])

@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'GET':
        tasks = Task.query.all()
        return jsonify([{
            "id": t.id, "title": t.title, "category": t.category, "priority": t.priority,
            "deadline": t.deadline, "assignee": t.assignee, "status": t.status
        } for t in tasks])
    
    data = request.json
    new_task = Task(**data)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task created successfully", "id": new_task.id}), 201


if __name__ == '__main__':
    app.run(debug=True, port=5000)
