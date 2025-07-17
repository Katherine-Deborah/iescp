export default {
    template: `
    <div class="container">

    <div class="form-container">
    <div>{{ error }}</div>
        <div class="form-header">
            <h2>{{ spon.username }}</h2>
        </div>
        
    
          <div class="form-group">
              <label for="company_name">Company Name:</label> 
              <div >{{ spon.company_name }}</div></div>
          <div class="form-group">
              <label for="industry">Industry:</label>
              <div >{{ spon.industry }}</div></div>
          <div class="form-group">
              <label for="budget">Budget:</label>
              <div>{{ spon.budget }}</div></div>
          <div class="form-group">
        
          <button v-if="isAdmin" type="submit" class="btn btn-primary" @click="flag">Flag Sponsor</button>
            <button type="submit" class="btn btn-primary btn-block" @click='back'>Back</button>
            </div>
    
    </div>
    
    
</div>`
  ,
  data() {
    return {
      sponsor_id: this.$route.query.sponsor_id,
      token: localStorage.getItem('auth-token'),
      role: localStorage.getItem('role'),
      error: null,
      spon: null,
    }
  },
  computed: {
    isAdmin() { return this.role === 'admin'; },
  },
methods: {
    async flag() {
        const res = await fetch(`/flag-user/${this.sponsor_id}`, {
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
    const res = await fetch(`/specific-spon/${this.sponsor_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json()
    if (res.ok) {
      console.log(data)
      this.spon = data
    } else {
      this.error = res.status
    }
  },
}

