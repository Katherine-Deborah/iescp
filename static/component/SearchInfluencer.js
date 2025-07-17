export default {
    template: ` <div>
    <div class="dash-container">
     
      <div v-if="allCampaigns">
        <div v-for="(campaign, index) in allCampaigns" :key="index" class="user-card">
          <div class="user-info">
            {{ campaign.name }} | {{ campaign.description }}
          </div>
          <div class="user-actions">
            <button type="submit" class="btn btn-primary" @click="camProfile(campaign.id)">View Profile</button>
            <button type="submit" class="btn btn-primary" @click="infl_send_request(campaign.id)">Send Request</button>
          </div>
        </div>
      </div>
    </div>
  </div>`,
    data() {
        return{
            influencer_id: localStorage.getItem('id'),
            token: localStorage.getItem('auth-token'),
            role: localStorage.getItem('role'),
            user: null,
            allCampaigns: [],
        }
    },
   
    methods: {
        
        camProfile(campaign_id){
            this.$router.push({ path: '/campaign-form', query: { campaign_id: campaign_id }})
        },
        infl_send_request(campaign_id) {
            this.$router.push({ path: '/ad-request', query: { influencer_id: this.influencer_id, campaign_id: campaign_id }});
        },
        
    },
    async mounted() {
        const res1 = await fetch(`/search-influencer/${this.influencer_id}`, {
            method: 'GET',
            headers: {
              'Authentication-Token': this.token, 
            },
          });

        if (!res1.ok) {
            throw new Error('Network response was not ok');
        }
        const data1 = await res1.json();
        this.allCampaigns= data1;
        console.log('Fetched campaigns:', this.allCampaigns);
            
    }
}

    