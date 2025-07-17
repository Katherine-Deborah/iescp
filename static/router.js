import AdminHome from './component/AdminHome.js';
import SponsorHome from './component/SponsorHome.js';
import InfluencerHome from './component/InfluencerHome.js';
import Login from './component/Login.js';
import RegisterInfl from './component/RegisterInfl.js';
import RegisterSpon from './component/RegisterSpon.js';
import Search from './component/Search.js';
import Campaign from './component/Campaign.js';
import CreateCampaign from './component/CreateCampaign.js';
import CampaignForm from './component/CampaignForm.js';
import ModifyCampaignForm from './component/ModifyCampaignForm.js';
import InfluencerForm from './component/InfluencerForm.js';
import CampaignAdRequest from './component/CampaignAdRequest.js';
import AddCampaign from './component/AddCampaign.js';
import AdminStat from './component/AdminStat.js';
import InfluencerStat from './component/InfluencerStat.js';
import SponsorStat from './component/SponsorStat.js';
import SponsorForm from './component/SponsorForm.js';
import ModifyInfluencer from './component/ModifyInfluencer.js';
import ModifyRequest from './component/ModifyRequest.js';
import NegotiateRequest from './component/NegotiateRequest.js';
import SearchInfluencer from './component/SearchInfluencer.js';
import SearchSponsor from './component/SearchSponsor.js';

const routes = [
    { path: '/admin', component: AdminHome, name: 'AdminHome' },
    { path: '/sponsor', component: SponsorHome, name: 'SponsorHome' },
    { path: '/influencer', component: InfluencerHome, name: 'InfluencerHome' },
    { path: '/influencer-registration', component: RegisterInfl, name: 'RegisterInfl' },
    { path: '/sponsor-registration', component: RegisterSpon, name: 'RegisterSpon' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/search', component: Search },
    { path: '/campaign', component: Campaign },
    { path: '/create-campaign', component: CreateCampaign },
    { path: '/campaign-form', component: CampaignForm },
    { path: '/add-campaign', component:AddCampaign },
    { path: '/modify-campaign', component: ModifyCampaignForm},
    { path: '/influencer-form', component: InfluencerForm},
    { path: '/sponsor-form', component: SponsorForm},
    { path: '/ad-request', component: CampaignAdRequest},
    { path: '/admin-stat', component: AdminStat},
    { path: '/influencer-stat', component: InfluencerStat},
    { path: '/sponsor-stat', component: SponsorStat},
    { path: '/modify-influencer', component: ModifyInfluencer},
    { path: '/modify-request', component: ModifyRequest},
    { path: '/negotiate-request', component: NegotiateRequest},
    { path: '/search-influencer', component: SearchInfluencer },
    { path: '/search-sponsor', component: SearchSponsor },
];

export default new VueRouter({
    routes
});
