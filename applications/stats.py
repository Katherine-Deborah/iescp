from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, current_user
from flask import current_app as app, jsonify
from .models import User, Sponsor, Influencer, Campaign, AdRequest, db
from datetime import date
from sqlalchemy import func

@app.get('/admin-stats')
@auth_required("token")
def admin_stats():
    total_users = User.query.count()
    sponsors = User.query.filter_by(role='sponsor').count()
    influencers = User.query.filter_by(role='influencer').count()
    flagged_users = User.query.filter_by(flag=True).count()
    active_users = User.query.filter_by(active=True).count()
    total_campaigns = Campaign.query.count()
    public_campaigns = Campaign.query.filter_by(visibility='public').count()
    private_campaigns = Campaign.query.filter_by(visibility='private').count()
    active_campaigns = Campaign.query.filter(Campaign.end_date >= date.today()).count()
    completed_campaigns = Campaign.query.filter(Campaign.end_date < date.today()).count()
    flagged_campaigns = Campaign.query.filter_by(flag=True).count()
    total = AdRequest.query.count()
    pending = AdRequest.query.filter_by(status='Pending').count()
    accepted = AdRequest.query.filter_by(status='Accepted').count()
    rejected = AdRequest.query.filter_by(status='Rejected').count()

    stats = {
        'total_users': total_users,
        'sponsors': sponsors,
        'influencers': influencers,
        'flagged_users': flagged_users,
        'active_users': active_users,
        'total_campaigns': total_campaigns,
        'public_campaigns': public_campaigns,
        'private_campaigns': private_campaigns,
        'active_campaigns': active_campaigns,
        'completed_campaigns': completed_campaigns,
        'flagged_campaigns': flagged_campaigns,
        'total': total,
        'pending': pending,
        'accepted': accepted,
        'rejected': rejected
    }
    
    return jsonify(stats)

@app.get('/sponsor-stats/<int:sponsor_id>')
@auth_required("token")
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
    
    return jsonify(stats)

@app.route('/influencer-stats/<int:influencer_id>')
@auth_required("token")
def influencer_stats(influencer_id):
    sent_total = AdRequest.query.filter_by(influencer_id=influencer_id, send_for='sponsor').count()
    sent_pending = AdRequest.query.filter_by(influencer_id=influencer_id, status='Pending', send_for='sponsor').count()
    sent_accepted = AdRequest.query.filter_by(influencer_id=influencer_id, status='Accepted', send_for='sponsor').count()
    sent_rejected = AdRequest.query.filter_by(influencer_id=influencer_id, status='Rejected', send_for='sponsor').count()
    recieved_total = AdRequest.query.filter_by(influencer_id=influencer_id, send_for='influencer').count()
    recieved_pending = AdRequest.query.filter_by(influencer_id=influencer_id, status='Pending', send_for='influencer').count()
    recieved_accepted = AdRequest.query.filter_by(influencer_id=influencer_id, status='Accepted', send_for='influencer').count()
    recieved_rejected = AdRequest.query.filter_by(influencer_id=influencer_id, status='Rejected', send_for='influencer').count()
    campaigns_ongoing = Campaign.query.join(AdRequest).filter(AdRequest.influencer_id == influencer_id, AdRequest.status == 'Accepted').count()

    stats = {
        'sent_total': sent_total,
        'sent_pending': sent_pending,
        'sent_accepted': sent_accepted,
        'sent_rejected': sent_rejected,
        'recieved_total': recieved_total,
        'recieved_pending': recieved_pending,
        'recieved_accepted': recieved_accepted,
        'recieved_rejected': recieved_rejected,
        'campaigns_ongoing': campaigns_ongoing,
    }
    
    return jsonify(stats)