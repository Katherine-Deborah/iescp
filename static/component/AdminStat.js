export default {
  template: `<div>  <div class="dash-container">
  <h2>Sponsor Statistics: </h2>
  <div v-if="stats">
    <div>
    <h2 class="stat-heading">User Statistics</h2>
<p>Total Users: {{ stats.total_users }}</p>
<p>Sponsors: {{ stats.sponsors }}</p>
<p>Influencers: {{ stats.influencers }}</p>
<p>Flagged Users: {{ stats.flagged_users }}</p>
<p>Active Users: {{ stats.active_users }}</p>
</div>
<div>
<h2 class="stat-heading">Campaign Statistics</h2>
<p>Total Campaigns: {{ stats.total_campaigns }}</p>
<p>Public Campaigns: {{ stats.public_campaigns }}</p>
<p>Private Campaigns: {{ stats.private_campaigns }}</p>
<p>Active Campaigns: {{ stats.active_campaigns }}</p>
<p>Completed Campaigns: {{ stats.completed_campaigns }}</p>
<p>Flagged Campaigns: {{ stats.flagged_campaigns }}</p>
</div>
<div>
<h2 class="stat-heading">Ad Request Statistics</h2>
<p>Total Ad Requests: {{ stats.total }}</p>
<p>Pending Requests: {{ stats.pending }}</p>
<p>Accepted Requests: {{ stats.accepted }}</p>
<p>Rejected Requests: {{ stats.rejected }}</p>
    </div>
    <div>
      <h2 class="stat-heading">Charts</h2>
      <canvas id="chart" width="500" height="400"></canvas>
    </div>
  </div>
</div>
</div></div>`
,
data() {
  return {
    stats: null,
    token: localStorage.getItem('auth-token'),
    influencer_id: localStorage.getItem('id'),
  };
},
async mounted() {
  try {
    const res = await fetch(`/admin-stats`, {
      headers: {
        'Authentication-Token': this.token,
      }
    });
    const data = await res.json();
    this.stats = data;

    this.$nextTick(() => {
      this.renderCharts();
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
},
methods: {
  renderCharts() {
    const InflChart = document.getElementById('chart').getContext('2d');
    new Chart(InflChart, {
      type: 'bar',
      data: {
        labels: ['Total', 'Pending', 'Accepted', 'Rejected'],
        datasets: [{
          label: 'Ad Request Status',
          data: [
            this.stats.sent_total+this.stats.recieved_total,   
            this.stats.sent_pending+this.stats.recieved_pending, 
            this.stats.sent_accepted+this.stats.recieved_accepted,
            this.stats.sent_rejected+this.stats.recieved_rejected
          ],
          backgroundColor: '#FFD0D0',
          borderColor: 'black',
          borderWidth: 2
        }]
      },
      
    });
  }
}
};


      
