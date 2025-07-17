export default {
    template: `
    <div class="container">

    <div class="form-container">
    <div>{{ error }}</div>
        <div class="form-header">
            <h2>Modify Campaign</h2>
        </div>
        
        <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" class="form-control" id="name" name="name" required v-model="cred.name">
          </div>
          <div class="form-group">
              <label for="description">Desciption:</label>
              <input type="text" class="form-control" id="description" name="description" required v-model="cred.description">
          </div>
          <div class="form-group">
              <label for="category">Category:</label>
              <input type="text" class="form-control" id="category" name="category" required v-model="cred.category">
          </div>
          <div class="form-group">
              <label for="budget">Budget:</label>
              <input type="float" class="form-control" id="budget" name="budget" required v-model="cred.budget">
          </div>
          <div class="form-group">
              <label for="goal">Goal:</label>
              <input type="text" class="form-control" id="goal" name="goal" v-model="cred.goals">
          </div>
          <div class="form-group">
          <label for="start_date">Start Date:</label>
          <input type="date" class="form-control" id="start_date" name="start_date" required v-model="cred.start_date">
        </div>
        <div class="form-group">
          <label for="end_date">End Date:</label>
          <input type="date" class="form-control" id="end_date" name="end_date" required v-model="cred.end_date">
        </div>
          <div class="form-group">
              <label for="visibility">Visibility:</label>
              <select id="visibility" name="visibility" v-model="cred.visibility">
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
          </div>
          
            <button type="submit" class="btn btn-primary btn-block" @click='modify'>Modify</button>
            </div>
    
    </div>
    
    
</div>`
  ,
// dates not stored
  data() {
    return {
        campaign_id: this.$route.query.campaign_id,
        cred: {
            name: null,
            description: null,
            category: null,
            budget: 0,
            start_date: null,
            end_date: null,
            goals: null,
            visibility: null,
            status: null,
        },
        token: localStorage.getItem('auth-token'),
        error: null,
    }
  },
  methods: {
    async modify() {
      try {
        const res = await fetch(`/api/campaign_modify/${this.campaign_id}`, {
          method: 'PUT',
          headers: {
            'Authentication-Token': this.token,
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(this.cred),
        });
        const data = await res.json(); 
        data.token=this.token;
        this.$router.go(-1);
        if (res.ok) {
          data.token=this.token;
          localStorage.setItem('auth-token', data.token);
          this.$router.go(-1);
        } else {
          console.error('Modification failed!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
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
      this.cred= {
        name: data.name,
        description: data.description,
        category: data.category,
        budget: data.budget,
        start_date: data.start_date,
        end_date: data.end_date,
        goals: data.goals,
        visibility: data.visibility,
        status: data.status,
    }
      console.log(data)
    } else {
      this.error = res.status
    }
  },
}