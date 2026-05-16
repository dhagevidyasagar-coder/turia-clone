from app import app, db, Message, Client
with app.app_context():
    m = db.session.query(Message, Client.name).outerjoin(Client, Message.client_id == Client.id).first()
    print("Tuple:", m)
    if m:
        print("Has Message attr:", hasattr(m, 'Message'))
        print("Has name attr:", hasattr(m, 'name'))
