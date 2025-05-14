from main import app, datastore
# from application.sec import datastore
from applications.models import db, Role
from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="User is an admin")
    datastore.find_or_create_role(
        name="infl", description="User is an Influencer")
    datastore.find_or_create_role(name="spon", description="User is a Sponsor")
    db.session.commit()
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(
            email="admin@email.com", password=generate_password_hash("admin"), roles=["admin"])
    if not datastore.find_user(email="infl@email.com"):
        datastore.create_user(
            email="infl@email.com", password=generate_password_hash("infl"), roles=["infl"], active=False)
    if not datastore.find_user(email="spon@email.com"):
        datastore.create_user(
            email="spon@email.com", password=generate_password_hash("spon"), roles=["spon"])
    
    db.session.commit()