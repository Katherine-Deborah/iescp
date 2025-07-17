export default {
    template: `
    <div class="container">

    <div class="form-container">
    <div>{{ error }}</div>
        <div class="form-header">
            <h2>Negotiate Request</h2>
        </div>
        
        <div class="form-group">
              <label for="messages">Message:</label>
              <input type="text"  id="messages" name="messages" required v-model="cred.messages">
          </div>
          <div class="form-group">
              <label for="requirements">Requirements:</label>
              <input type="text"  id="requirements" name="requirements" required v-model="cred.requirements">
          </div>
          <div class="form-group">
              <label for="payment_amount">Payment amount:</label>
              <input type="float" id="payment_amount" name="payment_amount" required v-model="cred.payment_amount">
          </div>
          
            <button type="submit" class="btn btn-primary btn-block" @click='negotiate'>Negotiate</button>
            </div>
    
    </div>
    
</div>`
  ,

  data() {
    return {
        cred: {
            messages: null,
            requirements: null,
            payment_amount: 0,
            send_for: 'sponsor',
            status: 'Negotiate',
            campaign_id: this.$route.query.campaign_id,
        influencer_id: localStorage.getItem('id'),
        },
        token: localStorage.getItem('auth-token'),
        role: localStorage.getItem('role'),
        error: null,
    }
  },
  
  methods: {
    async negotiate() {
      this.cred.campaign_id= this.$route.query.campaign_id;
      this.cred.influencer_id= localStorage.getItem('id');
      this.cred.send_for= 'sponsor';
      this.cred.status= 'Negotiate';
        const res = await fetch(`/api/adrequests_modify/${this.cred.influencer_id}/${this.cred.campaign_id}`, {
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(this.cred),
        });
        const data = await res.json();
        if (res.ok) { 
          this.$router.go(-1)
        } else {
          console.error('Sending failed!');
        }
      
    },
},
async mounted() {
    const res = await fetch(`/specific-request/${this.cred.influencer_id}/${this.cred.campaign_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json()
    if (res.ok) {
      this.cred= {
        messages: data.messages,
        requirements: data.requirements,
        payment_amount: data.payment_amount,  
    }
      console.log(data)
    } else {
      this.error = res.status
    }
  },
}