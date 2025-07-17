export default {
  template: `<div>  <div class="dash-container">
    <h2>Ongoing campaigns: </h2>
  <div v-if="ongoingCampaigns">
    <div v-for="(campaign, index) in ongoingCampaigns" :key="index" class="user-card">
      <div class="user-info">
        {{ campaign.name }} | {{ campaign.description }}
      </div>
      <div class="user-actions">
        <button type="submit" class="btn btn-primary" @click="detail(campaign.id)">View Profile</button>
          
      </div>
    </div>
  </div>
    <h2>Flagged users / campaigns: </h2>
    <div v-if="flaggedUser">
          <div v-for="(user, index) in flaggedUser" :key="index" class="user-card">
            <div class="user-info">
              {{ user.email }} | {{ user.role }}
            </div>
            <div class="user-actions">
              <button type="submit" class="btn btn-primary" @click="profile(user.id, user.role)">View Profile</button>
              <button type="submit" class="btn-reject" @click="remove_user(user.id)">Remove</button>
            </div>
          </div>
          <div v-for="(campaign, index) in flaggedCampaigns" :key="index" class="user-card">
            <div class="user-info">
              {{ campaign.name }} | {{ campaign.description }}
            </div>
            <div class="user-actions">
              <button type="submit" class="btn btn-primary" @click="detail(campaign.id)">View Profile</button>
              <button type="submit" class="btn-reject" @click="remove_campaign(campaign.id)">Remove</button>
            </div>
          </div>
</div>
<h2>New Sponsors: </h2>
<div v-if="newSponsors">
  <div v-for="(sponsor, index) in newSponsors" :key="index" class="user-card">
    <div class="user-info">
      {{ sponsor.username }} | {{ sponsor.company_name }}
    </div>
    <div class="user-actions">
      <button type="submit" class="btn btn-primary" @click="activate(sponsor.id)">Activate</button>
        
    </div>
  </div>
</div>

</div>`
  ,
  data() {
    return {
      admin_id: this.$route.query.id,
      ongoingCampaigns: [],
      flaggedCampaigns: [],
      flaggedUser: [],
      newSponsors: [],
      token: localStorage.getItem('auth-token'),
      error: null,
    }
  },
  methods: {
    detail(campaign_id) {
      this.$router.push({ path: '/campaign-form', query: { campaign_id: campaign_id } })
    },
    stats() {
      this.$router.push({ path: '/admin-stat' })
    },
    profile(id, role) {
      if (role == 'influencer') {
        this.$router.push({ path: '/influencer-form', query: { influencer_id: id } })
      }
      if (role == 'sponsor') {
        this.$router.push({ path: '/sponsor-form', query: { sponsor_id: id } })
      }
    },
    async activate(sponsor_id) {
      const res = await fetch(`/activate-sponsor/${sponsor_id}`, {
        method: 'POST',
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
      } else {
        this.error = res.status
      }
    },
    async remove_user(id) {
      const res = await fetch(`/delete-user/${id}`, {
        method: 'DELETE',
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
      } else {
        this.error = res.status
      }
    },
    async remove_campaign(id) {
      const res = await fetch(`/delete-campaign/${id}`, {
        method: 'DELETE',
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
    const res = await fetch(`/ongoing-campaigns`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json()
    if (res.ok) {
      console.log(data)
      this.ongoingCampaigns = data
    } else {
      this.error = res.status
    }
    const res1 = await fetch(`/flagged-user`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data1 = await res1.json()
    if (res1.ok) {
      console.log(data1)
      this.flaggedUser = data1
    } else {
      this.error = res1.status
    }

    const res2 = await fetch(`/flagged-campaign`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data2 = await res2.json()
    if (res2.ok) {
      console.log(data2)
      this.flaggedCampaigns = data2
    } else {
      this.error = res2.status
    }

    const res3 = await fetch(`/new-sponsors`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data3 = await res3.json()
    if (res3.ok) {
      console.log(data3)
      this.newSponsors = data3
    } else {
      this.error = res3.status
    }
  },
}