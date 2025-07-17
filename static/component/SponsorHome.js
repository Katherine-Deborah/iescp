export default {
    template: `<div>  <div class="dash-container">
    <h2>Active campaigns: </h2>
  <div v-if="allCampaigns">
    <div v-for="(campaign, index) in allCampaigns" :key="index" class="user-card">
      <div class="user-info">
        {{ campaign.name }} | {{ campaign.description }}
      </div>
      <div class="user-actions">
        <button type="submit" class="btn btn-primary" @click="detail(campaign.id)">View detail</button>
        
          
      </div>
    </div>
  </div>
    <h2>New Requests: </h2>
    <div v-if="allRequests">
          <div v-for="(request, index) in allRequests" :key="index" class="user-card">
            <div class="user-info">
              Influencer {{ request.influencer_id }} | Campaign {{ request.campaign_id }} | {{ request.status }} 
            </div>
            <div class="user-actions">
              <button type="submit" class="btn btn-primary" @click="profile(request.influencer_id, request.campaign_id)">View Profile</button>
              <button type="submit" class="btn-accept" @click="accept(request.influencer_id,request.campaign_id)">Accept</button>
                <button type="submit" class="btn-reject" @click="reject(request.influencer_id,request.campaign_id)">Reject</button>

            </div>
          </div>
          
</div></div>`
,
data() {
    return {
      sponsor_id: this.$route.query.id,
      allCampaigns: [],
      allRequests: [],
      token: localStorage.getItem('auth-token'),
      error: null,
    }
  },
methods: {
    detail(campaign_id) {
      localStorage.setItem('campaign_id',campaign_id)
        this.$router.push({path: '/add-campaign', query: {campaign_id: campaign_id}})
    },
    profile(influencer_id, campaign_id) {
      localStorage.setItem('campaign_id',campaign_id)
      this.$router.push({path: '/influencer-form', query: {influencer_id: influencer_id}})
    },
    stats(){
      this.$router.push({path: '/sponsor-stat', query: {sponsor_id: this.sponsor_id}})
    },
  async accept(influencer_id, campaign_id) {
    const res = await fetch(`/accept_request/${influencer_id}/${campaign_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json()
    if (res.ok) {
      alert(data.message)
    }
  },
  async reject(influencer_id, campaign_id) {
    const res = await fetch(`/reject_request/${influencer_id}/${campaign_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json()
    if (res.ok) {
      alert(data.message)
      }
    }
},
  async mounted() {
    // view.py
    const res = await fetch(`/sponsor-campaigns/${this.sponsor_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json()
    if (res.ok) {
      console.log(data)
      this.allCampaigns = data
    } else {
      this.error = res.status
    }
    // resources.py
    const res1 = await fetch(`/adrequests_sponsors/${this.sponsor_id}`, {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data1 = await res1.json().catch((e) => {})
      if (res1.ok) {
        console.log(data1)
        this.allRequests = data1
      } else {
        this.error = res1.status
      }
  },
}