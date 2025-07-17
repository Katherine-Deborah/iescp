export default {
    template: `
    <div class="container">

    <div class="form-container">
    <div>{{ error }}</div>
        <div class="form-header">
            <h2>{{ campaign.name }}</h2>
        </div>
          <div class="form-group">
              <label for="description">Desciption:</label> 
              <div >{{ campaign.description }}</div></div>
              <div class="form-group">
              <label for="category">Category:</label> 
              <div >{{ campaign.category }}</div></div>
          <div class="form-group">
              <label for="budget">Budget:</label>
              <div>{{ campaign.budget }}</div></div>
          <div class="form-group">
              <label for="goal">Goal:</label>
              <div>{{ campaign.goals }}</div></div>
          <div class="form-group">
          <label for="start_date">Start Date:</label>
          <div>{{ campaign.start_date }}</div></div>
        <div class="form-group">
          <label for="end_date">End Date:</label>
          <div >{{ campaign.end_date }}</div></div>
          <div class="form-group">
              <label for="visibility">Visibility:</label>
              <div>{{ campaign.visibility }}</div>
          </div>
          
          <button v-if="request" type="submit" class="btn btn-primary" @click="negotiate">Negotiate</button>
            <button type="submit" class="btn btn-primary btn-block" @click='back'>Back</button>
            </div>
    
</div>`
  ,
  data() {
    return {
      campaign_id: this.$route.query.campaign_id,
      role: localStorage.getItem('role'),
      token: localStorage.getItem('auth-token'),
      id: localStorage.getItem('id'),
      error: null,
      campaign: null,
      request: null,
    }
  },
  computed: {
    async isInfluencer() { 
      const res = await fetch(`/specific-request/${this.id}/${this.campaign_id}`, {
        headers: {
          'Authentication-Token': this.token,
        },
      })
      const data = await res.json()
      if(res.ok){
        this.request=data
      }
      
    },

  },
methods: {
    negotiate() {
      this.$router.push({ path: '/negotiate-request', query: { campaign_id: this.campaign_id }})
    },
    
    back() {
        this.$router.go(-1);
    }
},
async mounted() {
    console.log(this.campaign_id)
    const res = await fetch(`/specific-campaign/${this.campaign_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json()
    if (res.ok) {
      this.campaign = data
      console.log(data)
    } else {
      this.error = res.status
    }

    const res1 = await fetch(`/specific-request/${this.id}/${this.campaign_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data1 = await res1.json()
    if(res1.ok){
      this.request=data
    }
  },
}

