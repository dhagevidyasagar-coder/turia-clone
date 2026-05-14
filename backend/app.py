from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

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

class Email(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(100))
    recipient = db.Column(db.String(100))
    subject = db.Column(db.String(200))
    body = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
    is_starred = db.Column(db.Boolean, default=False)
    is_archived = db.Column(db.Boolean, default=False)
    is_deleted = db.Column(db.Boolean, default=False)
    is_sent = db.Column(db.Boolean, default=False)
    category = db.Column(db.String(50), default='General') # Statutory, Client, Priority, System

# Create database and initial mock data
class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    client_name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), default='PDF')
    size = db.Column(db.String(50), default='1.5 MB')
    category = db.Column(db.String(50), default='KYC')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()
    
    # Check if we already have data
    if not Client.query.first():
        # Seed Clients
        clients_data = [
            {'name': 'Reliance Industries', 'category': 'Platinum', 'email': 'tax@reliance.com', 'phone': '+91 98273 12345', 'location': 'Mumbai', 'entity_type': 'Public Ltd', 'services': 'Audit, GST, Income Tax', 'employees': 250000, 'auditor': 'Vidyasagar D.', 'status': 'Active'},
            {'name': 'Tata Consultancy Services', 'category': 'Gold', 'email': 'finance@tcs.com', 'phone': '+91 91234 56789', 'location': 'Pune', 'entity_type': 'Public Ltd', 'services': 'Consulting, Tax Advisory', 'employees': 600000, 'auditor': 'Sarah J.', 'status': 'Active'},
            {'name': 'Zomato Operations', 'category': 'Silver', 'email': 'accounts@zomato.com', 'phone': '+91 90000 11111', 'location': 'Gurgaon', 'entity_type': 'Private Ltd', 'services': 'GST Compliance, Payroll', 'employees': 5000, 'auditor': 'Mehul S.', 'status': 'Active'},
            {'name': 'California Burrito', 'category': 'Gold', 'email': 'admin@calburrito.in', 'phone': '+91 88776 65544', 'location': 'Bangalore', 'entity_type': 'Private Ltd', 'services': 'Audit, ROC Filing', 'employees': 800, 'auditor': 'Vidyasagar D.', 'status': 'Active'},
            {'name': 'Infosys Ltd', 'category': 'Platinum', 'email': 'compliance@infosys.com', 'phone': '+91 99887 76655', 'location': 'Bangalore', 'entity_type': 'Public Ltd', 'services': 'International Tax, Audit', 'employees': 300000, 'auditor': 'Rahul K.', 'status': 'Active'}
        ]
        
        clients = []
        for data in clients_data:
            c = Client(**data)
            db.session.add(c)
            clients.append(c)
        db.session.commit()
        
        # Seed Tasks
        tasks_data = [
            {'title': 'GSTR-3B April Filing', 'category': 'GST', 'client_id': clients[0].id, 'priority': 'High', 'deadline': '20th Apr', 'assignee': 'Mehul S.', 'status': 'In Progress'},
            {'title': 'TDS Quarterly Return Q4', 'category': 'TDS', 'client_id': clients[1].id, 'priority': 'High', 'deadline': '31st May', 'assignee': 'Sarah J.', 'status': 'To Do'},
            {'title': 'Annual Return MGT-7', 'category': 'MCA', 'client_id': clients[2].id, 'priority': 'Critical', 'deadline': '30th Oct', 'assignee': 'Rahul K.', 'status': 'To Do'},
            {'title': 'Advance Tax Q1 Payment', 'category': 'Income Tax', 'client_id': clients[0].id, 'priority': 'Medium', 'deadline': '15th Jun', 'assignee': 'Mehul S.', 'status': 'To Do'},
            {'title': 'Statutory Audit FY 2023-24', 'category': 'Audit', 'client_id': clients[1].id, 'priority': 'High', 'deadline': '30th Sep', 'assignee': 'Sarah J.', 'status': 'In Progress'},
            {'title': 'GST Reconciliation', 'category': 'GST', 'client_id': clients[3].id, 'priority': 'Medium', 'deadline': '25th Apr', 'assignee': 'Mehul S.', 'status': 'To Do'},
            {'title': 'Professional Tax Monthly', 'category': 'IT', 'client_id': clients[4].id, 'priority': 'Low', 'deadline': '30th Apr', 'assignee': 'Sarah J.', 'status': 'Completed'},
            {'title': 'Form 16 Generation', 'category': 'Income Tax', 'client_id': clients[2].id, 'priority': 'High', 'deadline': '15th Jun', 'assignee': 'Rahul K.', 'status': 'To Do'},
            {'title': 'Monthly Payroll Processing', 'category': 'Payroll', 'client_id': clients[3].id, 'priority': 'Medium', 'deadline': '30th Apr', 'assignee': 'Sarah J.', 'status': 'In Progress'},
            {'title': 'MCA AOC-4 Filing', 'category': 'MCA', 'client_id': clients[4].id, 'priority': 'Critical', 'deadline': '30th Oct', 'assignee': 'Mehul S.', 'status': 'To Do'},
            {'title': 'TDS Payment Deposit', 'category': 'TDS', 'client_id': clients[0].id, 'priority': 'High', 'deadline': '7th May', 'assignee': 'Vidyasagar D.', 'status': 'To Do'},
            {'title': 'GST Annual Return 9C', 'category': 'GST', 'client_id': clients[1].id, 'priority': 'High', 'deadline': '31st Dec', 'assignee': 'Sarah J.', 'status': 'To Do'},
            {'title': 'Internal Audit Review', 'category': 'Audit', 'client_id': clients[2].id, 'priority': 'Medium', 'deadline': '15th May', 'assignee': 'Rahul K.', 'status': 'To Do'},
            {'title': 'PF Return Filing', 'category': 'Payroll', 'client_id': clients[0].id, 'priority': 'Low', 'deadline': '15th May', 'assignee': 'Mehul S.', 'status': 'To Do'},
            {'title': 'Income Tax Scrutiny', 'category': 'Income Tax', 'client_id': clients[1].id, 'priority': 'Critical', 'deadline': '25th Apr', 'assignee': 'Vidyasagar D.', 'status': 'In Progress'},
            {'title': 'ROC Event Based Filing', 'category': 'MCA', 'client_id': clients[3].id, 'priority': 'Medium', 'deadline': '12th May', 'assignee': 'Sarah J.', 'status': 'To Do'},
            {'title': 'Bank Reconciliation', 'category': 'General', 'client_id': clients[4].id, 'priority': 'Low', 'deadline': '30th Apr', 'assignee': 'Rahul K.', 'status': 'Completed'}
        ]
        for data in tasks_data:
            db.session.add(Task(**data))
            
        # Seed Compliance Records
        compliance_data = [
            {'title': 'GSTR-1 (Monthly)', 'category': 'GST', 'deadline': '2024-04-11', 'status': 'Filed', 'client_id': clients[0].id, 'client_name': 'Reliance Industries', 'ack_no': 'ACK-992831'},
            {'title': 'GSTR-3B (Monthly)', 'category': 'GST', 'deadline': '2024-04-20', 'status': 'Pending', 'client_id': clients[0].id, 'client_name': 'Reliance Industries'},
            {'title': 'TDS Payment (Monthly)', 'category': 'TDS', 'deadline': '2024-04-07', 'status': 'Overdue', 'client_id': clients[1].id, 'client_name': 'Tata Consultancy Services'},
            {'title': 'ITR-6 (Annual)', 'category': 'Income Tax', 'deadline': '2024-10-31', 'status': 'Pending', 'client_id': clients[4].id, 'client_name': 'Infosys Ltd'},
            {'title': 'PF Deposit (Monthly)', 'category': 'Payroll', 'deadline': '2024-04-15', 'status': 'Filed', 'client_id': clients[2].id, 'client_name': 'Zomato Operations', 'ack_no': 'PF-882711'},
            {'title': 'ESI Deposit (Monthly)', 'category': 'Payroll', 'deadline': '2024-04-15', 'status': 'Filed', 'client_id': clients[2].id, 'client_name': 'Zomato Operations', 'ack_no': 'ESI-221092'}
        ]
        for data in compliance_data:
            db.session.add(ComplianceRecord(**data))
            
        # Seed Calendar Events
        today = datetime.now()
        events_data = [
            {'title': 'GST R-3B Deadline', 'type': 'Recurring', 'date': (today + timedelta(days=2)).strftime('%Y-%m-%d'), 'client_name': 'Reliance Ind.', 'status': 'Pending', 'user_name': 'Mehul S.'},
            {'title': 'IT Notice Hearing', 'type': 'Notice', 'date': (today + timedelta(days=1)).strftime('%Y-%m-%d'), 'client_name': 'California Burrito', 'status': 'In Progress', 'user_name': 'Vidyasagar D.'},
            {'title': 'Client Kickoff Call', 'type': 'Lead', 'date': today.strftime('%Y-%m-%d'), 'client_name': 'Freshworks', 'status': 'Completed', 'user_name': 'Rahul K.'},
            {'title': 'May Day Holiday', 'type': 'Holiday', 'date': '2024-05-01', 'status': 'Holiday'},
            {'title': 'TDS Filing Review', 'type': 'Task', 'date': today.strftime('%Y-%m-%d'), 'client_name': 'TCS', 'status': 'Pending', 'user_name': 'Sarah J.'},
            {'title': 'Board Meeting', 'type': 'To Do', 'date': (today + timedelta(days=3)).strftime('%Y-%m-%d'), 'client_name': 'HDFC Bank', 'status': 'Pending', 'user_name': 'Mehul S.'}
        ]
        for data in events_data:
            db.session.add(CalendarEvent(**data))
            
        # Seed Messages
        messages_data = [
            {'client_id': clients[0].id, 'sender': 'Anil Agarwal', 'text': 'Hi, have you uploaded the GSTR-3B ack?', 'type': 'received', 'timestamp': datetime.now() - timedelta(hours=2)},
            {'client_id': clients[0].id, 'sender': 'Vidyasagar', 'text': 'Yes Anil, just shared it via email as well. You can see it in the portal.', 'type': 'sent', 'timestamp': datetime.now() - timedelta(hours=1)},
            {'client_id': clients[1].id, 'sender': 'Sanjay Gupta', 'text': 'Need help with TDS reconciliation.', 'type': 'received', 'timestamp': datetime.now() - timedelta(days=1)},
            {'client_id': clients[2].id, 'sender': 'Priya Sharma', 'text': 'PF challan is ready for payment.', 'type': 'received', 'timestamp': datetime.now() - timedelta(minutes=30)},
            {'client_id': clients[2].id, 'sender': 'System', 'text': 'Automated Nudge: PF deadline is tomorrow.', 'type': 'system', 'timestamp': datetime.now() - timedelta(days=1)}
        ]
        for data in messages_data:
            db.session.add(Message(**data))
            
        # Seed Invoices
        invoices_data = [
            {'client_name': 'Reliance Industries', 'amount': 150000.0, 'status': 'Unpaid', 'date': '2024-04-15', 'invoice_no': 'INV-2024-010'},
            {'client_name': 'Tata Consultancy Services', 'amount': 250000.0, 'status': 'Paid', 'date': '2024-03-20', 'invoice_no': 'INV-2024-008'},
            {'client_name': 'Zomato Operations', 'amount': 45000.0, 'status': 'Unpaid', 'date': '2024-04-18', 'invoice_no': 'INV-2024-012'},
            {'client_name': 'California Burrito', 'amount': 75000.0, 'status': 'Paid', 'date': '2024-02-15', 'invoice_no': 'INV-2024-004'}
        ]
        for data in invoices_data:
            db.session.add(Invoice(**data))
            
        # Seed DSC Records
        dsc_data = [
            {'client_name': 'Vidyasagar Dhage', 'expiry_date': '2024-05-15', 'provider': 'eMudhra', 'status': 'Expiring Soon'},
            {'client_name': 'Reliance Industries', 'expiry_date': '2025-10-20', 'provider': 'Vsign', 'status': 'Active'},
            {'client_name': 'Mehul Sharma', 'expiry_date': '2024-04-25', 'provider': 'Sify', 'status': 'Expired'},
            {'client_name': 'Tata Projects', 'expiry_date': '2026-01-10', 'provider': 'Pantagon', 'status': 'Active'}
        ]
        for data in dsc_data:
            db.session.add(DSCRecord(**data))

        # Seed Emails
        emails_data = [
            {
                'sender': 'GSTN Portal', 'recipient': 'dhagevidyasagarr@gmail.com', 'subject': 'GSTR-3B Filing Acknowledgement - Apr 2024',
                'body': 'Dear Taxpayer, your GSTR-3B for the month of April 2024 has been successfully filed with ARN: AA27042400192. Please download the receipt from the portal.',
                'category': 'Statutory', 'is_starred': True
            },
            {
                'sender': 'California Burrito', 'recipient': 'dhagevidyasagarr@gmail.com', 'subject': 'Inquiry regarding TDS deductions for Q1',
                'body': 'Hi Mehul, we noticed some discrepancies in the TDS calculation for our staff payments in the Bangalore unit. Can we sync tomorrow morning to reconcile?',
                'category': 'Client', 'is_read': True
            },
            {
                'sender': 'Income Tax Department', 'recipient': 'dhagevidyasagarr@gmail.com', 'subject': 'Hearing Notice: Section 143(2) - Assessment Year 2023-24',
                'body': 'Notice is hereby given for the hearing scheduled on 25th April 2024 at 11:00 AM via Video Conferencing. Please ensure all documents are uploaded to the e-filing portal.',
                'category': 'Statutory', 'is_starred': True
            },
            {
                'sender': 'System Alert', 'recipient': 'dhagevidyasagarr@gmail.com', 'subject': 'Action Required: Digital Signature Certificate (DSC) Expiry',
                'body': 'Automated Alert: Your Digital Signature Certificate (DSC) for Reliance Industries is set to expire in 3 days. Please initiate renewal to avoid interruptions in MCA filings.',
                'category': 'Priority', 'is_read': True
            }
        ]
        for data in emails_data:
            db.session.add(Email(**data))

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

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    today = datetime.utcnow().date()
    # Find compliance records due today
    due_today = ComplianceRecord.query.filter(ComplianceRecord.deadline <= today.strftime('%Y-%m-%d'), ComplianceRecord.status == 'Pending').all()
    
    notifications = []
    for record in due_today:
        notifications.append({
            "id": f"due-{record.id}",
            "title": "Filing Deadline Today",
            "message": f"{record.category} for {record.client_name} is due today.",
            "type": "Critical",
            "timestamp": "Today",
            "is_read": False
        })
    
    # Add some mock static notifications if list is small
    if len(notifications) < 2:
        notifications.append({
            "id": "static-1",
            "title": "System Audit Complete",
            "message": "Vault integrity check passed successfully.",
            "type": "System",
            "timestamp": "1h ago",
            "is_read": False
        })
        
    return jsonify(notifications)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({
        "total_clients": Client.query.count(),
        "active_tasks": Task.query.filter(Task.status != 'Completed').count(),
        "completed_mtd": 89,
        "pending_compliance": ComplianceRecord.query.filter_by(status='Pending').count()
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

@app.route('/api/emails', methods=['GET', 'POST'])
def handle_emails():
    if request.method == 'GET':
        emails = Email.query.order_by(Email.timestamp.desc()).all()
        return jsonify([{
            "id": e.id, "sender": e.sender, "recipient": e.recipient,
            "subject": e.subject, "body": e.body, 
            "time": e.timestamp.strftime('%H:%M %p') if e.timestamp.date() == datetime.utcnow().date() else e.timestamp.strftime('%b %d'),
            "isRead": e.is_read, "isStarred": e.is_starred,
            "isArchived": e.is_archived, "isDeleted": e.is_deleted,
            "isSent": e.is_sent, "category": e.category
        } for e in emails])
    
    if request.content_type and request.content_type.startswith('multipart/form-data'):
        recipient = request.form.get('recipient')
        subject = request.form.get('subject')
        body = request.form.get('body')
        files = request.files.getlist('attachments')
    else:
        data = request.json or {}
        recipient = data.get('recipient')
        subject = data.get('subject')
        body = data.get('body')
        files = []
    
    # Configure your Gmail credentials here
    sender_email = os.environ.get('EMAIL_ADDRESS', 'dhagevidyasagarr@gmail.com')
    sender_password = os.environ.get('EMAIL_PASSWORD', 'mmphcbriwfoxzglh')

    email_sent_status = False
    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient
        msg['Subject'] = subject
        # Professional HTML Template
        html_body = f"""
        <html>
            <body style="font-family: 'Inter', sans-serif; color: #020617; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E4E4E7; borderRadius: 12px;">
                <div style="border-bottom: 2px solid #020617; paddingBottom: 16px; marginBottom: 24px;">
                    <h2 style="margin: 0; color: #020617; font-style: italic;">VA CA firm application</h2>
                </div>
                <div style="fontSize: 15px; color: #020617;">
                    {body.replace('\n', '<br>')}
                </div>
                <div style="marginTop: 48px; paddingTop: 24px; border-top: 1px solid #E4E4E7; fontSize: 13px; color: #52525B;">
                    <p style="margin: 0; fontWeight: 800;">Vidyasagar Dhage</p>
                    <p style="margin: 4px 0 0; fontSize: 11px; textTransform: uppercase; letterSpacing: 0.05em;">Managing Partner | VA CA firm application</p>
                    <p style="margin: 16px 0 0; fontSize: 10px; color: #94A3B8; fontStyle: italic;">
                        Disclaimer: This email and any attachments are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately.
                    </p>
                </div>
            </body>
        </html>
        """
        msg.attach(MIMEText(html_body, 'html'))

        for file in files:
            if file and file.filename:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(file.read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f'attachment; filename={file.filename}')
                msg.attach(part)

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        email_sent_status = True
        print(f"Successfully sent email to {recipient}")
    except Exception as e:
        print(f"Error sending email via SMTP: {e}")

    new_email = Email(
        sender=f'Me ({sender_email})',
        recipient=recipient,
        subject=subject,
        body=body,
        is_sent=True,
        is_read=True,
        category='Priority'
    )
    db.session.add(new_email)
    db.session.commit()
    
    msg_resp = "Email sent successfully" if email_sent_status else "Email saved locally (SMTP not configured)"
    return jsonify({"message": msg_resp, "id": new_email.id}), 201

@app.route('/api/emails/<int:email_id>', methods=['PATCH'])
def update_email(email_id):
    email = Email.query.get_or_404(email_id)
    data = request.json
    if 'is_read' in data: email.is_read = data['is_read']
    if 'is_starred' in data: email.is_starred = data['is_starred']
    if 'is_archived' in data: email.is_archived = data['is_archived']
    if 'is_deleted' in data: email.is_deleted = data['is_deleted']
    db.session.commit()
    return jsonify({"message": "Email updated"})

@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'GET':
        results = db.session.query(Task, Client.name).outerjoin(Client, Task.client_id == Client.id).all()
        return jsonify([{
            "id": t.id, "title": t.title, "category": t.category, "priority": t.priority,
            "deadline": t.deadline, "assignee": t.assignee, "status": t.status,
            "client": client_name
        } for t, client_name in results])
    
    data = request.json
    new_task = Task(**data)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task created successfully", "id": new_task.id}), 201

@app.route('/api/documents', methods=['GET', 'POST'])
def handle_documents():
    if request.method == 'GET':
        docs = Document.query.order_by(Document.timestamp.desc()).all()
        return jsonify([{
            "id": d.id, "name": d.name, "client_name": d.client_name,
            "type": d.type, "size": d.size, "category": d.category,
            "date": d.timestamp.strftime('%d %b %Y')
        } for d in docs])
    
    data = request.json
    new_doc = Document(**data)
    db.session.add(new_doc)
    db.session.commit()
    return jsonify({"message": "Document saved", "id": new_doc.id}), 201

if __name__ == '__main__':
    app.run(debug=False, host='127.0.0.1', port=5005)
