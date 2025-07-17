export default {
    template: `<div class="campaign-container">
    
    <div v-if="allCampaigns" class="campaign-list">
        <div v-for="(campaign, index) in allCampaigns" :key="index" class="campaign-box">
        <div class="campaign-text">
        <div >Name: {{ campaign.name }}</div>
        <div>Description: {{ campaign.description }}</div>
        <div>Category: {{ campaign.category }}</div>
        <div>Budget: {{ campaign.budget }}</div>
        <div>Goal: {{ campaign.goals }}</div>
        <button type="submit" class="btn btn-primary btn-block" @click='detail(campaign.id)'>View detail</button>
        </div>
        </div>
        </div>
    
    <button class="add-campaign-btn" @click="create_campaign" title="create campaign">
        <img src="static/images/add.png" alt="Add Campaign">
    </button>
    <button class="down-campaign-btn" @click="download" title="download campaign details">
        <img src="static/images/download.png" alt="download Campaign">
    </button>
</div> 
`,
data() {
    return {
      token: localStorage.getItem('auth-token'),
      id: localStorage.getItem('id'),
      error: null,
      allCampaigns:null,
      campaign: null,
      isWaiting: false,
    }
  },
methods: {
    detail(campaign_id) {
        console.log(campaign_id)
        this.$router.push({path: '/add-campaign', query: {campaign_id: campaign_id}})
    },
    create_campaign() {
        this.$router.push({path: '/create-campaign'})
    },
    async download() {
      this.isWaiting = true;
      const res = await fetch(`/download-csv/${this.id}`);
      const data = await res.json();
      console.log(data['task_id']);
      
      if (res.ok) {
        const taskId = data['task_id'];
        const intv = setInterval(async () => {
          const csv_res = await fetch(`/get-csv/${taskId}`);
          if (csv_res.ok) {
            this.isWaiting = false;
            clearInterval(intv);
            window.location.href = `/get-csv/${taskId}`;
          }
        }, 1000);
      } else {
        console.log(res.status);
      }
    },
},
  async mounted() {
    const res = await fetch(`/sponcampaigns/${this.id}`, {
      method: 'GET',
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json()
    if (res.ok) {
      console.log(data)
      this.allCampaigns = data
    } else {
      this.error = res.status
    }
  },
}

