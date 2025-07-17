from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required, login_user
from flask_restful import marshal, fields
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from .models import db, User, Role, Sponsor, Influencer, Campaign, AdRequest
import flask_excel as excel
from celery.result import AsyncResult
from .tasks import get_campaign_csv
from datetime import date
from .stats import admin_stats, sponsor_stats, influencer_stats
import os
from .instances import cache

#main html page
@app.get('/')
def home():
  return render_template("index.html")

#fields 
user_fields = {
    "id": fields.Integer,
    "email": fields.String,
    "username": fields.String,
    "role": fields.String,
    "active": fields.Boolean,
    "flag": fields.Boolean,
}
campaign_fields = {
   "id": fields.Integer,
   "name": fields.String,
   "description": fields.String,
   "category": fields.String,
   "budget": fields.Float,
   "goals": fields.String,
   "start_date": fields.String,
   "end_date": fields.String,
   "visibility": fields.String,
   "flag": fields.Boolean,
}
infl_fields ={
   "id": fields.Integer,
   "name": fields.String,
   "username": fields.String,
   "category": fields.String,
   "niche": fields.String,
   "reach": fields.String,
   "image": fields.String,
   "platform": fields.String,
}
sponsor_fields = {
   "id": fields.Integer,
   "username": fields.String,
   "company_name": fields.String,
   "industry": fields.String,
   "budget": fields.Float,
   "reach": fields.String,
   "campaign_id": fields.Integer
}
ad_request_fields = {
    'id': fields.Integer,
    'campaign_id': fields.Integer,
    'influencer_id': fields.Integer,
    'messages': fields.String,
    'send_for': fields.String,
    'requirements': fields.String,
    'payment_amount': fields.Float,
    'status': fields.String,
    'created_at': fields.String
}

#REGISTRATION Page
#fro influencer
@app.post('/influencer-reg')
def influencer_reg():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    category = data.get('category')
    niche = data.get('niche')
    reach = data.get('reach')
    username = data.get('username')
    password = data.get('password')
    platform = data.get('platform')
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409
    hashed_password = generate_password_hash(password)
    user_role = Role.query.filter_by(name='influencer').first()
    influencer = Influencer(
        name=name,
        email=email,
        category=category,
        niche=niche,
        reach=reach,
        username=username,
        password=hashed_password,
        platform=platform,
        role='influencer'
    )
    influencer.roles.append(user_role)
    db.session.add(influencer)
    db.session.commit()
    return jsonify({'message': 'Registered!!'}), 200

#for sponsor
@app.post('/sponsor-reg')
def sponsor_reg():
    data = request.json
    email = data.get('email')
    username = data.get('username')
    company_name = data.get('company_name')
    industry = data.get('industry')
    budget = data.get('budget')
    password = data.get('password')
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409
    hashed_password = generate_password_hash(password)
    user_role = Role.query.filter_by(name='sponsor').first()
    sponsor = Sponsor(
        email=email,
        username=username,
        password=hashed_password,
        company_name=company_name,
        industry=industry,
        budget=budget,
        role='sponsor',
        active=False,
    )
    sponsor.roles.append(user_role)
    db.session.add(sponsor)
    db.session.commit()
    return jsonify({"message": "Registered!!"}), 200

#LOGIN Page
@app.post('/user-login')
def user_login():
    data = request.json
    email = data.get('email')
    username = data.get('username')
    account_type = data.get('account_type')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password) and user.username==username:
        user_roles = [role.name for role in user.roles]
        if user.active:
            if account_type in user_roles:
                login_user(user)
                token = user.get_auth_token()  
                return jsonify({
                    'token': token,
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'role': account_type
                })
        return jsonify({'error': 'Admin must approve'}), 401
       
    return jsonify({'error': 'Invalid credentials'}), 401

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../static/images')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', }

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
#Influencer Profile update
@app.post('/profile-modify/<int:id>')
def profile_modify(id):
    infl = Influencer.query.get(id)
    infl.name = request.form['name']
    infl.category = request.form['category']
    infl.niche = request.form['niche']
    infl.reach = request.form['reach']
    infl.username = request.form['username']

    if 'image' in request.files:
        print("image")
        image = request.files['image']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            infl.image = f'../static/images/{filename}'

    db.session.commit()
    return jsonify({'message': 'Profile Modified'}), 200
    
#--------------AdminHome--------------
#get new sponsors for admin front page
@app.get('/new-sponsors')
@auth_required("token")
@roles_required("admin")
def new_sponsors():
   users = User.query.filter_by(active=False, role='sponsor').all()
   if len(users) == 0:
      return jsonify({"message": "no users"}), 404
   return marshal(users, sponsor_fields), 200

#activate sponsors account
@app.post('/activate-sponsor/<int:sponsor_id>')
@auth_required("token")
@roles_required("admin")
def activate_sponsor(sponsor_id):
    sponsor = User.query.get(sponsor_id)
    sponsor.active = True
    db.session.commit()
    return jsonify({"message": "User Activated"}), 200

#get the flagged user
@app.get('/flagged-user')
@auth_required("token")
@roles_required("admin")
def flagged_user():
   user = User.query.filter_by(flag=True).all()
   if len(user) == 0:
      return jsonify({"message": "no campaigns"}), 404
   return marshal(user, user_fields)

#get the flagged campaign
@app.get('/flagged-campaign')
@auth_required("token")
@roles_required("admin")
def flagged_campaign():
   campaigns = Campaign.query.filter_by(flag=True).all()
   if len(campaigns) == 0:
      return jsonify({"message": "no campaigns"}), 404
   return marshal(campaigns, campaign_fields)

#get ongoing campaigns
@app.get('/ongoing-campaigns')
@auth_required("token")
@roles_required("admin")
def ongoing_campaigns():
   current_time = date.today()
   campaigns = Campaign.query.filter(Campaign.end_date >= current_time).all()
   if len(campaigns) == 0:
      return jsonify({"message": "no campaigns"}), 404
   return marshal(campaigns, campaign_fields)

#delete users(sponsors/influencers)
@app.delete('/delete-user/<int:id>')
@auth_required("token")
@roles_required("admin")
def delete_user(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

#delete campaigns
@app.delete('/delete-campaign/<int:id>')
@auth_required("token")
@roles_required("admin")
def delete_campaign(id):
    campaign = Campaign.query.get(id)
    db.session.delete(campaign)
    db.session.commit()
    return jsonify({"message": "Campaign deleted"}), 200

#-----------------Search------------------------
#get all the users when pressed search
@auth_required("token")
@cache.cached(timeout=50)
@app.get('/all-users')
def search_users():
   users = User.query.filter(User.role != 'admin').all()
   if len(users) == 0:
      return jsonify({"message": "no users"}), 404
   return marshal(users, user_fields), 200

#-----------------SearchSponsor------------------------
#get all the users when pressed search
@auth_required("token")
@cache.cached(timeout=50)
@app.get('/all-influencer/<int:id>')
def all_influencer(id):
    campaign = Campaign.query.get(id)
    users = Influencer.query.filter_by(category=campaign.category).all()
    if len(users) == 0:
        return jsonify({"message": "no users"}), 404
    return marshal(users, infl_fields), 200

#----------------SearchInfluencer-----------------
@auth_required("token")
@app.get('/search-influencer/<int:infl_id>')
@cache.cached(timeout=50)
def search_influencer(infl_id):
    infl = Influencer.query.get(infl_id)
    campaigns = Campaign.query.filter(Campaign.visibility =='public', Campaign.category == infl.category).all()
    # if not campaigns:
    #     campaigns = Campaign.query.filter_by(visibility='public').all()
    return marshal(campaigns, campaign_fields), 200

# user = Campaign.query.filter((Campaign.niche == name) & (Influencer.category == name)).first()
#     if user:
#         return marshal(user, user_fields), 200
#     campaign = Campaign.query.filter_by(name=name).first()
#     if campaign:
#         return marshal(campaign, campaign_fields), 200
#     return jsonify({"message": "Not found"}), 404
#get all the campaigns when pressed search
# @auth_required("token")
# @app.get('/all-public-campaigns')
# def all_public_campaigns():
#    campaigns = Campaign.query.all()
#    if len(campaigns) == 0:
#       return jsonify({"message": "no campaigns"}), 404
#    return marshal(campaigns, campaign_fields), 200

#flag users(sponsors/influencers)
@app.get('/flag-user/<int:id>')
@auth_required("token")
@roles_required("admin")
def flag_user(id):
    user = User.query.get(id)
    user.flag = True
    db.session.commit()
    return jsonify({"message": "flagged User"}), 200

#flag campaigns
@app.get('/flag-campaign/<int:id>')
@auth_required("token")
@roles_required("admin")
def flag_campiagn(id):
    campaign = Campaign.query.get(id)
    campaign.flag = True
    db.session.commit()
    return jsonify({"message": "Flagged Campaign"}), 200

#-------------------SponsorHome---------------------
#get ONGOING campaigns created by that sponsor
@app.get('/sponsor-campaigns/<int:sponsor_id>')
@auth_required("token")
def sponsor_campaigns(sponsor_id):
   current_time = date.today()
   campaigns = Campaign.query.filter(Campaign.sponsor_id == sponsor_id).all()
   if len(campaigns) == 0:
      return jsonify({"message": "no campaigns"}), 404
   return marshal(campaigns, campaign_fields)

#--------------Campaign---------------
#get ALL campaigns created by that sponsor
@app.get('/sponcampaigns/<int:sponsor_id>')
@auth_required("token")
def specific_campaigns(sponsor_id):
   campaigns = Campaign.query.filter_by(sponsor_id = sponsor_id).all()
   if len(campaigns) == 0:
      return jsonify({"message": "no campaigns"}), 404
   return marshal(campaigns, campaign_fields)

#--------------------SponsorHome----------------------
#--------------------InfluencerHome-------------------
#accept campaign request
@app.get('/accept_request/<int:infl_id>/<int:camp_id>')
@auth_required("token")
def accept_request(infl_id, camp_id):
    adrequest = AdRequest.query.filter_by(influencer_id=infl_id, campaign_id=camp_id).first()
    adrequest.status = "Accepted"
    db.session.commit()
    return jsonify({"message": "Request Accepted"}), 200

#reject campaign request
@app.get('/reject_request/<int:infl_id>/<int:camp_id>')
@auth_required("token")
def reject_request(infl_id, camp_id):
    adrequest = AdRequest.query.filter_by(influencer_id=infl_id, campaign_id=camp_id).first()
    adrequest.status = "Rejected"
    db.session.commit()
    return jsonify({"message": "Request Rejected"}), 200

# @app.get('/campaign-request/<int:infl_id>/<int:camp_id>')
# @auth_required("token")
# def campaign_request(infl_id, camp_id):
#     adrequest = AdRequest.query.filter_by(influencer_id=infl_id, campaign_id=camp_id).first()
#     if len(adrequest) == 0:
#       return jsonify({"message": "no adrequest"}), 404
#     return marshal(adrequest, ad_request_fields)

# -------------------NegotiateCampaign, CampaignForm------------------------
#get specific ad request
@app.get('/specific-request/<int:infl_id>/<int:camp_id>')
@auth_required("token")
def specific_request(infl_id, camp_id):
    ad_requests = AdRequest.query.filter_by(influencer_id=infl_id, campaign_id=camp_id).first()
    if ad_requests:
        return marshal(ad_requests, ad_request_fields)
    else:
        return {"message": "No Ad Requests Found"}, 404


#SEARCH 

#send data of the user by the name
@app.get('/search/<name>')
def search_name(name):
    user = Influencer.query.filter_by(name=name).first()
    if user:
        return marshal(user, infl_fields), 200
    campaign = Campaign.query.filter_by(name=name).first()
    if campaign:
        return marshal(campaign, campaign_fields), 200
    return jsonify({"message": "Not found"}), 404

#--------------------InfluencerForm-----------------------
#get specific influencer with an id to send request or profile
@app.get('/specific-infl/<int:id>')
@auth_required("token")
def specific_infl(id):
   infl = Influencer.query.get(id)
   if not infl:
      return jsonify({"message": "no influencer"}), 404
   return marshal(infl, infl_fields)

#-------------------SponsorForm----------------
#get specific sponsor
@app.get('/specific-spon/<int:id>')
@auth_required("token")
def specific_spon(id):
   spon = Sponsor.query.get(id)
   if not spon:
      return jsonify({"message": "no sponsor"}), 404
   return marshal(spon, sponsor_fields)

#get requests for sponsors send by influencers
@app.get('/adrequests_sponsors/<int:sponsor_id>')
@auth_required("token")
def adrequests_sponsors(sponsor_id):
    ad_requests = AdRequest.query.join(Campaign).filter( Campaign.sponsor_id == sponsor_id, AdRequest.status.in_(('Pending', 'Negotiate')), AdRequest.send_for == 'sponsor').all()
    if ad_requests:
        return marshal(ad_requests, ad_request_fields)
    else:
        return jsonify({"message": "No Ad Requests Found"}), 404

#-------------------CampaignForm, AddCampaign-----------------------
#get specific campaign with an id to send request or profile
@app.get('/specific-campaign/<int:id>')
@auth_required("token")
def specific_campaign(id):
   campaign = Campaign.query.get(id)
   if not campaign:
      return jsonify({"message": "no campaign"}), 404
   return marshal(campaign, campaign_fields)

#------------------AddCampaign--------------------
#gets all the requests send for that campaign
@app.get('/campaign-adrequests/<int:id>')
@auth_required("token")
def campaign_adrequests(id):
   requests = AdRequest.query.filter_by(campaign_id=id).all()
   if not requests:
      return jsonify({"message": "no requests"}), 404
   return marshal(requests, ad_request_fields)

#----------------------InfluencerHome----------------------
#get the adrequests for Influencer send by sponsor
@app.get('/adrequests_influencer/<int:id>')
@auth_required("token")
@cache.cached(timeout=50)
def adrequests_influencer(id):
    ad_requests = AdRequest.query.filter_by(influencer_id=id, status='Pending', send_for='influencer').all()
    if ad_requests:
        return marshal(ad_requests, ad_request_fields)
    else:
        return {"message": "No Ad Requests Found"}, 404

#get all the influencer's campaign
@app.get('/influencer_campaign/<int:influencer_id>')   
@auth_required("token")
def influencer_campaign(influencer_id):
    ad_requests = AdRequest.query.filter_by(influencer_id=influencer_id, status='Accepted').all()
    if ad_requests:
        return marshal(ad_requests, ad_request_fields)
    else:
        return {"message": "No Ad Requests Found"}, 404
        

#JOB SCHEDULED
#to download report csv by sponsors
@app.get('/download-csv/<int:id>')
def download_csv(id):
    task = get_campaign_csv.delay(id)
    if task:
        return jsonify({"task_id": task.id})
    else:
        return {"message": "Error!!"}, 404
    
# @app.get('/hello')
# def say_hello():
#     task = hello.delay()
#     if task:
#         return jsonify({"task_id": task.id})
#     else:
#         return {"message": "Error!!"}, 404

#to get csv(task function) to download
@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404
