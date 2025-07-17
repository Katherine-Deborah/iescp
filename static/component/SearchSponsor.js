export default {
    template: ` <div>
    <div class="dash-container">
      <div v-if="allUsers">
        <div v-for="(user, index) in allUsers" :key="index" class="user-card">
          <div class="user-info">
            {{ user.name }} | {{ user.category }}
          </div>
          <div class="user-actions">
            <button type="submit" class="btn btn-primary" @click="Profile(user.id)">View Profile</button>
            <button type="submit" class="btn btn-primary" @click="spon_send_request(user.id)">Send Request</button>
            </div>
        </div>
      </div>
      
    </div>
  </div>`,
    data() {
        return{
            campaign_id: localStorage.getItem('campaign_id'),
            allUsers: [],
            token: localStorage.getItem('auth-token'),
            role: localStorage.getItem('role'),
            user: null,
            allCampaigns: [],
        }
    },
    
    methods: {
        Profile(user_id){
            this.$router.push({ path: '/influencer-form',query: { influencer_id:user_id}})
        },
        spon_send_request(user_id) {
            this.$router.push({ path: '/ad-request', query: { influencer_id: user_id, campaign_id: this.campaign_id }});
        },
        
    },
    async mounted() {
        const res = await fetch(`/all-influencer/${this.campaign_id}`, {
            headers: {
                'Authentication-Token': this.token,  
            },
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        this.allUsers = data;
        console.log('Fetched users:', this.allUsers);
        
            
    }
}

    