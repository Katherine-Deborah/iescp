export default {
  template: `
    <div>
    <div class="campaign-info">
    <div>Campaign Number: {{ campaign.id }}</div>
    <div>Name: {{ campaign.name }}</div>
    <div>Description: {{ campaign.description }}</div>
    <div>Category: {{ campaign.category }}</div>
    <div>Budget: {{ campaign.budget }}</div>
    <div>Goal: {{ campaign.goals }}</div>
      <button type="submit"  class="btn-accept" @click='modify_campaign'>Modify</button>
      <button type="submit"  class="btn-reject" @click='delete_campaign'>Delete</button>
    </div>
          
    <div class="campaign-container">
        <div v-if="allRequests" class="campaign-list">
          <div v-for="(request, index) in allRequests" :key="index" class="campaign-box">
            <div class="campaign-text">
              <div>Influencer_id: {{ request.influencer_id }}</div>
              <div>Description: {{ request.messages }}</div>
              <div>Payment Amount: {{ request.payment_amount }}</div>
              <div>Status: {{ request.status }}</div>
              <button type="submit" class="btn-accept btn-block" @click="profile(request.influencer_id)">View profile</button>
              <button type="submit" class="btn-accept btn-block" @click="modify(request.influencer_id)">Modify Request</button>
              <button type="submit" class="btn-reject btn-block" @click="remove(request.influencer_id)">Delete Request</button>
            </div>
          </div>
        
      </div>
      
      <button class="add-campaign-btn" @click="search" title="Search for influencers">
        <img src="static/images/find-my-friend.png" alt="Send Request">
      </button>
    </div>
  </div>
`,
  data() {
    return {
      token: localStorage.getItem('auth-token'),
      campaign_id: this.$route.query.campaign_id,
      error: null,
      campaign: null,
      allRequests: null,
    }
  },
  methods: {
    modify_campaign() {
      this.$router.push({ path: '/modify-campaign', query: { campaign_id: this.campaign_id } })
    },
    async delete_campaign() {
      const res = await fetch(`/api/campaign_modify/${this.campaign_id}`, {
        method: 'DELETE',
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json()
      if (res.ok) {
        this.$router.go(-1);
        alert(data.message)
      } else {
        this.error = res.status
      }
    },
    async remove(id) {
      const res = await fetch(`/api/adrequests_modify/${id}/${this.campaign_id}`, {
        method: 'DELETE',
        headers: {
          'Authentication-Token': this.token,
        }
      });
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
      } else {
        this.error = res.status
      }
    },
    search() {
      localStorage.setItem('campaign_id', this.campaign_id);
      this.$router.push({ path: '/search-sponsor' })
    },
    profile(id) {
      this.$router.push({ path: '/influencer-form', query: { influencer_id: id } })
    },
    modify(id) {
      this.$router.push({ path: '/modify-request', query: { influencer_id: id, campaign_id: this.campaign_id } })
    },

  },
  async mounted() {
    const res = await fetch(`/specific-campaign/${this.campaign_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json().catch((e) => { })
    if (res.ok) {
      this.campaign = data
      console.log(data)
    } else {
      this.error = res.status
    }

    const res1 = await fetch(`/campaign-adrequests/${this.campaign_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data1 = await res1.json().catch((e) => { })
    if (res1.ok) {
      this.allRequests = data1
      console.log(data1)
    } else {
      this.error = res1.status
    }
  },
}

