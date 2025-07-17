export default {
    template: ` <div>
    <div class="dash-container">
      <div v-if="allUsers">
        <div v-for="(user, index) in allUsers" :key="index" class="user-card">
          <div class="user-info">
            {{ user.email }} | {{ user.role }}
          </div>
          <div class="user-actions">
            <button type="submit" class="btn btn-primary" @click="Profile(user.id,user.role)">View Profile</button>
            <button type="submit" class="btn btn-primary" @click="flag_user(user.id)">Flag User</button>
          </div>
        </div>
      </div>
      <div v-if="allCampaigns">
        <div v-for="(campaign, index) in allCampaigns" :key="index" class="user-card">
          <div class="user-info">
            {{ campaign.name }} | {{ campaign.description }}
          </div>
          <div class="user-actions">
            <button type="submit" class="btn btn-primary" @click="camProfile(campaign.id)">View Profile</button>
            <button type="submit" class="btn btn-primary" @click="flag_campaign(campaign.id)">Flag Campaign</button>
          </div>
        </div>
      </div>
    </div>
  </div>`,
    data() {
        return{
            influencer_id: localStorage.getItem('id'),
            campaign_id: localStorage.getItem('campaign_id'),
            allUsers: [],
            token: localStorage.getItem('auth-token'),
            role: localStorage.getItem('role'),
            user: null,
            allCampaigns: [],
        }
    },
    methods: {
        Profile(user_id,role){
          if (role=='influencer'){
            this.$router.push({ path: '/influencer-form',query: { influencer_id:user_id}})
          }
          else{
            this.$router.push({ path: '/sponsor-form',query: { sponsor_id:user_id}})
          }
        },
        camProfile(campaign_id){
            this.$router.push({ path: '/campaign-form', query: { campaign_id: campaign_id }})
        },
        async flag_user(user_id) {
            const res = await fetch(`/flag-user/${user_id}`, {
              headers: {
                'Authentication-Token': this.token,
              },
            })
            const data = await res.json()
            if (res.ok) {
              alert(data.message)
            }
          },
          async flag_campaign(campaign_id) {
            const res = await fetch(`/flag-campaign/${campaign_id}`, {
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
        const res = await fetch('/all-users', {
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
        
        const res1 = await fetch('api/campaigns', {
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

    