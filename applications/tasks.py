from celery import shared_task
from .models import Campaign, User, Sponsor, Role, AdRequest, db
import flask_excel as excel
from .mail_service import send_message
from jinja2 import Template
import requests
from sqlalchemy import func
from datetime import date
from flask import jsonify

#Export as CSV(Sponsors)
@shared_task(ignore_result=False)
def get_campaign_csv(id):
    user = User.query.get(id)
    campaigns = Campaign.query.filter_by(sponsor_id=user.id).with_entities(
        Campaign.name, Campaign.description, Campaign.start_date, Campaign.end_date, Campaign.budget, Campaign.visibility, Campaign.goals).all()
    csv_output = excel.make_response_from_query_sets(campaigns, ["name", "description", "start_date", "end_date", "budget", "visibility", "goals"], "csv")
    filename = "test.csv"
    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename

# Daily ReminderS(Influencers)
@shared_task(ignore_result=True)
def daily_reminder():
    influencers = User.query.filter(User.roles.any(Role.name == 'influencer')).all()
    for influencer in influencers:
        if AdRequest.query.filter_by(influencer_id=influencer.id, status='Pending').count() > 0:
            subject = "Daily Reminder: Check your Ad Requests"
            with open('templates/daily_reminder.html', 'r') as f:
                template = Template(f.read())
                send_message(influencer.email, subject, template.render(name=influencer.name))
    return "OK"

#Monthly Activity Report(Sponsors)
@shared_task(ignore_result=True)
def monthly_activity_report():
    sponsors = User.query.filter(User.roles.any(Role.name == 'sponsor')).all()
    for sponsor in sponsors:
        stats = sponsor_stats(sponsor.id)
        subject = "Monthly Activity Report"
        with open('templates/Report.html', 'r') as f:
            template = Template(f.read())
            send_message(sponsor.email, subject, template.render(stats=stats))
    return "OK"



def sponsor_stats(sponsor_id):
    total_campaigns = Campaign.query.filter_by(sponsor_id=sponsor_id).count()
    active_campaigns = Campaign.query.filter(Campaign.sponsor_id == sponsor_id, Campaign.end_date >= date.today()).count()
    completed_campaigns = Campaign.query.filter(Campaign.sponsor_id == sponsor_id, Campaign.end_date < date.today()).count()
    public_campaigns = Campaign.query.filter_by(sponsor_id=sponsor_id, visibility='public').count()
    private_campaigns = Campaign.query.filter_by(sponsor_id=sponsor_id, visibility='private').count()
    sent_total = AdRequest.query.join(Campaign).filter(Campaign.sponsor_id == sponsor_id, AdRequest.send_for=='influencer').count()
    sent_pending = AdRequest.query.join(Campaign).filter(Campaign.sponsor_id == sponsor_id,AdRequest.status == 'Pending', AdRequest.send_for=='influencer').count()
    sent_accepted = AdRequest.query.join(Campaign).filter(Campaign.sponsor_id == sponsor_id,AdRequest.status == 'Accepted', AdRequest.send_for=='influencer').count()
    sent_rejected = AdRequest.query.join(Campaign).filter(Campaign.sponsor_id == sponsor_id,AdRequest.status == 'Rejected', AdRequest.send_for=='influencer').count()
    recieved_total = AdRequest.query.join(Campaign).filter(Campaign.sponsor_id == sponsor_id, AdRequest.send_for=='sponsor').count()
    recieved_pending = AdRequest.query.join(Campaign).filter(Campaign.sponsor_id == sponsor_id,AdRequest.status == 'Pending', AdRequest.send_for=='sponsor').count()
    recieved_accepted = AdRequest.query.join(Campaign).filter(Campaign.sponsor_id == sponsor_id,AdRequest.status == 'Accepted', AdRequest.send_for=='sponsor').count()
    recieved_rejected = AdRequest.query.join(Campaign).filter(Campaign.sponsor_id == sponsor_id,AdRequest.status == 'Rejected', AdRequest.send_for=='sponsor').count()

    
    stats = {
        "total_campaigns": total_campaigns,
        "active_campaigns": active_campaigns,
        "completed_campaigns": completed_campaigns,
        "public_campaigns": public_campaigns,
        "private_campaigns": private_campaigns,
        'sent_total': sent_total,
        'sent_pending': sent_pending,
        'sent_accepted': sent_accepted,
        'sent_rejected': sent_rejected,
        'recieved_total': recieved_total,
        'recieved_pending': recieved_pending,
        'recieved_accepted': recieved_accepted,
        'recieved_rejected': recieved_rejected,   
    }
    
    return stats


