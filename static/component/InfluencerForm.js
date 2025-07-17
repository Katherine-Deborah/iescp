export default {
    template: `
    <div class="container">

    <div class="form-container">
    <div>{{ error }}</div>
        <div class="form-header">
            <h2>{{ infl.username }}</h2>
        </div>
        <div class="profile-pic-container">
  <img :src="infl.image" alt="Profile Picture" class="profile-pic">>
</div>
        
          <div class="form-group">
              <label for="name">Name:</label> 
              <div>{{ infl.name }}</div></div>
          <div class="form-group">
              <label for="category">Category:</label>
              <div >{{ infl.category }}</div></div>
          <div class="form-group">
              <label for="niche">Niche:</label>
              <div >{{ infl.niche }}</div></div>
          <div class="form-group">
          <label for="reach">Reach:</label>
          <div >{{ infl.reach }}k</div></div>
          <div v-if="request" class="form-group">
          <label for="reach">Message:</label>
          <div >{{ request.messages }}</div></div>
          <div v-if="request" class="form-group">
          <label for="reach">Requirements:</label>
          <div>{{ request.requirements }}</div></div>
          <div v-if="request" class="form-group">
          <label for="reach">Payment amount($):</label>
          <div >{{ request.payment_amount }}</div></div>
          
          <button type="submit" v-if="isAdmin"  class="btn btn-primary" @click="flag_campaign">Flag Campaign</button>
            <button type="submit" class="btn btn-primary btn-block" @click='back'>Back</button>
            </div>
    
    </div>
    
    
</div>`
  ,
  data() {
    return {
      influencer_id: this.$route.query.influencer_id,
      token: localStorage.getItem('auth-token'),
      role: localStorage.getItem('role'),
      id: localStorage.getItem('id'),
      campaign_id: localStorage.getItem('campaign_id'),
      error: null,
      infl: null,
      request: null,
    }
  },
  computed: {
    isSponsor() { return this.role == 'sponsor'; },
    isAdmin() { return this.role == 'admin'; },
  },
methods: {
    async flag_campaign() {
        const res = await fetch(`/flag-campaign/${this.campaign_id}`, {
          headers: {
            'Authentication-Token': this.token,
          },
        })
        const data = await res.json()
        if (res.ok) {
          alert(data.message)
        }
      },
      
    back() {
        this.$router.go(-1)
    },
},
  async mounted() {
    const res = await fetch(`/specific-infl/${this.influencer_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json()
    if (res.ok) {
      console.log(data)
      this.infl = data
    } else {
      this.error = res.status
    }
    const res1 = await fetch(`/specific-request/${this.influencer_id}/${this.campaign_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data1 = await res1.json()
    if (res1.ok) {
      if ( data1.status == "Negotiate"){
        this.request=data1;
      }
    } else {
      this.error = res1.status
    }
    
  },
}

