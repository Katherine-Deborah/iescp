from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, current_user
from flask import current_app as app, jsonify
from .models import Campaign, AdRequest, db
from .instances import cache
from datetime import datetime

api = Api(prefix='/api')

campaign_parser = reqparse.RequestParser()
campaign_parser.add_argument('name', type=str, required=True, help='Name is required and should be a string')
campaign_parser.add_argument('description', type=str, required=True, help='Description is required and should be a string')
campaign_parser.add_argument('category', type=str, required=True, help='Category is required and should be a string')
campaign_parser.add_argument('start_date', type=str, required=True, help='Start date is required')
campaign_parser.add_argument('end_date', type=str, required=True, help='End date is required')
campaign_parser.add_argument('budget', type=float, required=True, help='Budget is required and should be a float')
campaign_parser.add_argument('visibility', type=str, required=True, help='Visibility is required and should be a string')
campaign_parser.add_argument('goals', type=str, required=True, help='Goals are required and should be a string')

ad_request_parser = reqparse.RequestParser()
ad_request_parser.add_argument('campaign_id', type=int, required=True, help='Campaign ID is required and should be an integer')
ad_request_parser.add_argument('influencer_id', type=int, required=True, help='Influencer ID is required and should be an integer')
ad_request_parser.add_argument('messages', type=str, required=True, help='Messages are required and should be a string')
ad_request_parser.add_argument('requirements', type=str, required=True, help='Requirements are required and should be a string')
ad_request_parser.add_argument('payment_amount', type=float, required=True, help='Payment amount is required and should be a float')
ad_request_parser.add_argument('status', type=str, help='Status is required and should be a string')
ad_request_parser.add_argument('send_for', type=str, required=True, help='Send by is required and should be a string')


campaign_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    "category": fields.String,
    'start_date': fields.String,
    'end_date': fields.String,
    'budget': fields.Float,
    'visibility': fields.String,
    'goals': fields.String,
    'sponsor_id': fields.Integer,
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
    'created_at': fields.DateTime
}

# Campaign resources: to store and retrieve data
class CampaignResource(Resource):
    @auth_required("token")
    @cache.cached(timeout=50)
    def get(self):
        all_campaigns = Campaign.query.all()
        if all_campaigns:
            return marshal(all_campaigns, campaign_fields)
        else:
            return {"message": "No Campaign Found"}, 404
        
    @auth_required("token")
    def post(self):
        args = campaign_parser.parse_args()
        start_date = datetime.strptime(args.get("start_date"), '%Y-%m-%d').date()
        end_date = datetime.strptime(args.get("end_date"), '%Y-%m-%d').date()
        campaign = Campaign(
            name=args.get("name"),
            description=args.get("description"),
            category=args.get("category"),
            budget=args.get("budget"),
            visibility=args.get("visibility"),
            start_date=start_date,
            end_date=end_date,
            goals=args.get("goals"),
            sponsor_id=current_user.id
            )
        db.session.add(campaign)
        db.session.commit()
        return {"message": "Campaign Created"}
    
   
# modify and delete campaign
class CampaignModify(Resource):
    @auth_required("token")
    def put(self,id):
        args = campaign_parser.parse_args()
        campaign = Campaign.query.get(id)
        campaign.name = args.get("name")
        campaign.description = args.get("description")
        campaign.category = args.get("category")
        campaign.budget = args.get("budget")
        campaign.visibility = args.get("visibility")
        campaign.goals = args.get("goals")
        db.session.commit()
        return {"message": "Campaign modified"}, 201
    
    @auth_required("token")
    def delete(self, id):
        campaign = Campaign.query.get(id)
        if campaign:
            db.session.delete(campaign)
            db.session.commit()
            return {"message": "Campaign deleted"}, 200
        else:
            return {"message": "Campaign not found"}, 404 

# --------------CampaignAdRequest---------------------  
# Store and Retrieve ad request data
class AdRequestResource(Resource):
    @auth_required("token")
    @cache.cached(timeout=50)
    def get(self):
        all_ad_requests = AdRequest.query.all()
        if all_ad_requests:
            return marshal(all_ad_requests, ad_request_fields)
        else:
            return {"message": "No Ad Request Found"}, 404

    @auth_required("token")
    def post(self):
        args = ad_request_parser.parse_args()
        ad_request = AdRequest(
            campaign_id=args.get("campaign_id"),
            influencer_id=args.get("influencer_id"),
            messages=args.get("messages"),
            requirements=args.get("requirements"),
            payment_amount=args.get("payment_amount"),
            send_for=args.get("send_for")
        )
        db.session.add(ad_request)
        db.session.commit()
        return {"message": "Ad Request Created"}, 201

  
# modify and delete adrequest
class AdRequestModify(Resource):
    @auth_required("token")
    def put(self, infl_id, camp_id):
        args = ad_request_parser.parse_args()
        ad_request = AdRequest.query.filter_by(influencer_id=infl_id, campaign_id=camp_id).first()
        if not ad_request:
            return {"message": "Ad Request Not Found"}, 404

        ad_request.messages = args.get("messages")
        ad_request.requirements = args.get("requirements")
        ad_request.payment_amount = args.get("payment_amount")
        ad_request.send_for = args.get("send_for")
        ad_request.status = args.get("status")

        db.session.commit()
        return {"message": "Ad Request Updated"}, 200
    
    @auth_required("token")
    def delete(self, infl_id, camp_id):
        ad_request = AdRequest.query.filter_by(influencer_id=infl_id, campaign_id=camp_id).first()
        if not ad_request:
            return {"message": "Ad Request Not Found"}, 404

        db.session.delete(ad_request)
        db.session.commit()
        return {"message": "Ad Request Deleted"}, 200

api.add_resource(CampaignResource,'/campaigns')
api.add_resource(AdRequestResource, '/ad_requests') 
api.add_resource(CampaignModify,'/campaign_modify/<int:id>')
api.add_resource(AdRequestModify,'/adrequests_modify/<int:infl_id>/<int:camp_id>')
