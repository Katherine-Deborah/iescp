export default {
    template: `<div>  <div class="dash-container">
    <h2>Sponsor Statistics: </h2>
    <div v-if="stats">
      <div>
        <h2 class="stat-heading">Ad Request Statistics</h2>
        <h3> Sent </h3>
        <p>Total Ad Requests: {{ stats.sent_total }}</p>
        <p>Pending Requests: {{ stats.sent_pending }}</p>
        <p>Accepted Requests: {{ stats.sent_accepted }}</p>
        <p>Rejected Requests: {{ stats.sent_rejected }}</p>
        <h3> Recieved </h3>
        <p>Total Ad Requests: {{ stats.recieved_total }}</p>
        <p>Pending Requests: {{ stats.recieved_pending }}</p>
        <p>Accepted Requests: {{ stats.recieved_accepted }}</p>
        <p>Rejected Requests: {{ stats.recieved_rejected }}</p>
      </div>
      <div>
        <h2 class="stat-heading">Campaign Statistics</h2>
        <p>Ongoing Campaigns: {{ stats.campaigns_ongoing }}</p>

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
      const res = await fetch(`/influencer-stats/${this.influencer_id}`, {
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
