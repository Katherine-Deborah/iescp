export default {
    template: `<div class="influencer-dash">
    <div>{{ flag }}</div>
    <div class="influencer-profile">
        <img :src="influencer.image" alt="Profile Picture" class="profile-pic">
        <div class="profile-details">
            <h3>{{influencer.name}}</h3>
            <p>Niche: {{influencer.niche}}</p>
            <p>Followers: {{influencer.reach}}K</p>
            <p>Platform: {{influencer.platform}}</p>
        </div>
    </div>


  <div class="main-content">
      <h2>Active campaigns: </h2>
    <div v-if="allCampaigns">
      <div v-for="(campaign, index) in allCampaigns" :key="index" class="user-card">
        <div class="user-info">
          Campaign {{ campaign.campaign_id }} 
        </div>
        <div class="user-actions">
          <button type="submit" class="btn btn-primary" @click="profile(campaign.campaign_id)">View Profile</button>
        </div>
      </div>
    </div>
      <h2>New Requests: </h2>
      <div v-if="allRequests">
            <div v-for="(request, index) in allRequests" :key="index" class="user-card">
              <div class="user-info">
                Campaign {{ request.campaign_id }} 
              </div>
              <div class="user-actions">
                <button type="submit" class="btn btn-primary" @click="profile(request.campaign_id)">View Profile</button>
                <button type="submit" class="btn-accept" @click="accept(request.campaign_id)">Accept</button>
                  <button type="submit" class="btn-reject" @click="reject(request.campaign_id)">Reject</button>

              </div>
            </div>
      </div>
  </div></div>`,
  data() {
    return {
      influencer_id: this.$route.query.id,
      allCampaigns: [],
      allRequests: [],
      token: localStorage.getItem('auth-token'),
      influencer: null,
      error: null,
      flag: '',
    }
  },
methods: {
    profile(campaign_id) {
        this.$router.push({path: '/campaign-form', query: {campaign_id: campaign_id}})
    },
    async accept(campaign_id) {
      const res = await fetch(`/accept_request/${this.influencer_id}/${campaign_id}`, {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
      }
    },
    async reject(campaign_id) {
      const res = await fetch(`/reject_request/${this.influencer_id}/${campaign_id}`, {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
      }
    },
},
  async mounted() {
    const res = await fetch(`/influencer_campaign/${this.influencer_id}`, {
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
    const res1 = await fetch(`/adrequests_influencer/${this.influencer_id}`, {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data1 = await res1.json()
      if (res1.ok) {
        console.log(data1)
        this.allRequests = data1
      } else {
        this.error = res1.status
      }
      const res2 = await fetch(`/specific-infl/${this.influencer_id}`, {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data2 = await res2.json()
      if (res2.ok) {
        console.log(data2)
        this.influencer = data2;
        if (data2.flag){
          flag="you are flagged by the admin"
        }
      } else {
        this.error = res2.status
      }
  },
};