export default {
    template: `
    <div class="container">

    <div class="form-container">
    <div>{{ error }}</div>
        <div class="form-header">
            <h2>Send Request</h2>
        </div>
        
        <div class="form-group">
              <label for="messages">Message:</label>
              <input type="text"  id="messages" name="messages" required v-model="cred.messages">
          </div>
          <div class="form-group">
              <label for="requirements">Requirements:</label>
              <input type="text" id="requirements" name="requirements" required v-model="cred.requirements">
          </div>
          <div class="form-group">
              <label for="payment_amount">Payment amount:</label>
              <input type="float" id="payment_amount" name="payment_amount" required v-model="cred.payment_amount">
          </div>
          
            <button type="submit" class="btn btn-primary btn-block" @click='send'>Send Request</button>
            
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
            campaign_id: this.$route.query.campaign_id,
            influencer_id: this.$route.query.influencer_id,
            send_for: '',
        },
        token: localStorage.getItem('auth-token'),
        role: localStorage.getItem('role'),
        error: null,
    }
  },
  methods: {
    async send() {
        if( this.role=='sponsor'){
          this.cred.send_for='influencer';
        }
        else{
          this.cred.send_for='sponsor';
        }
        const res = await fetch(`/api/ad_requests`, {
          method: 'POST',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(this.cred),
        });

        if (res.ok) {
          const data = await res.json(); 
          this.$router.go(-1)
        } else {
          const errorData = await res.json();
          this.error = errorData;
          console.error('Sending failed:', errorData);
        }
      
    },
},
}