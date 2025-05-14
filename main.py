from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from werkzeug.security import generate_password_hash
from applications.models import db, User, Role, Admin, Influencer
from config import DevelopmentConfig
from applications.resources import api
from applications.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
# from applications.tasks import daily_reminder, monthly_activity_report
from applications.instances import cache

def create_app():
  app = Flask(__name__)
  app.config.from_object(DevelopmentConfig)
  db.init_app(app)
  api.init_app(app)
  cache.init_app(app)
  excel.init_excel(app)
  global datastore
  datastore = SQLAlchemyUserDatastore(db, User, Role)
  app.security = Security(app, datastore)
  with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="User is an Admin")
    datastore.find_or_create_role(name="influencer", description="User is an Influencer")
    datastore.find_or_create_role(name="sponsor", description="User is a Sponsor")
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(
            username="admin", email="admin@email.com", password=generate_password_hash("admin"), role="admin", roles=["admin"])
    db.session.commit()
    import applications.views
  
  return app

app = create_app()
celery_app = celery_init_app(app)

import logging
import test_redis

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_redis_connection():
    try:
        r = test_redis.Redis(host='localhost', port=6379, db=0)
        r.ping()
        logger.info("Connected to Redis!")
    except test_redis.ConnectionError as e:
        logger.error(f"Failed to connect to Redis: {e}")

# @celery_app.on_after_configure.connect
# def send_email(sender, **kwargs):
#     sender.add_periodic_task(
#         crontab(hour=23, minute=11),  # Adjust time as needed
#         daily_reminder.s(),
#     )
#     sender.add_periodic_task(
#         crontab(day_of_month=1, hour=0, minute=0),  # Run monthly on the 1st
#         monthly_activity_report.s(),
#     )

if __name__ == '__main__':
  app.run(debug=True)
  test_redis_connection()