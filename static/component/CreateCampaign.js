export default {
    template: `
    <div class="container">

    <div class="form-container">
    <div>{{ error }}</div>
        <div class="form-header">
            <h2>Create Campaign</h2>
        </div>
        
        <div class="form-group">
              <label for="name">Name:</label>
              <input type="text"  id="name" name="name" required v-model="cred.name">
          </div>
          <div class="form-group">
              <label for="description">Desciption:</label>
              <input type="text"  id="description" name="description" required v-model="cred.description">
          </div>
          <div class="form-group">
              <label for="category">Category:</label>
              <input type="text"  id="category" name="category" required v-model="cred.category">
          </div>
          <div class="form-group">
              <label for="budget">Budget($):</label>
              <input type="float"  id="budget" name="budget" required v-model="cred.budget">
          </div>
          <div class="form-group">
              <label for="goal">Goal:</label>
              <input type="text"  id="goal" name="goal" v-model="cred.goals">
          </div>
          <div class="form-group">
          <label for="start_date">Start Date:</label>
          <input type="date"  id="start_date" name="start_date" required v-model="cred.start_date">
        </div>
        <div class="form-group">
          <label for="end_date">End Date:</label>
          <input type="date"  id="end_date" name="end_date" required v-model="cred.end_date">
        </div>
          <div class="form-group">
              <label for="visibility">Visibility:</label>
              <select id="visibility" name="visibility" v-model="cred.visibility">
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
          </div>
          <button type="submit" class="btn-reject" @click='cancel'>Cancel</button>
            <button type="submit" class="btn-accept" @click='create'>Create</button>
            </div>
    
    </div>
    
    
</div>`
  ,
// dates not stored
  data() {
    return {
        cred: {
            name: null,
            description: null,
            category: null,
            budget: 0,
            start_date: null,
            end_date: null,
            goals: null,
            visibility: null,
        },
        token: localStorage.getItem('auth-token'),
        error: null,
    }
  },
  methods: {
    async create() {
      try {
        const res = await fetch('/api/campaigns', {
          method: 'POST',
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
          console.log(data);
          localStorage.setItem('auth-token', data.token);
          this.$router.go(-1);
        } else {
          console.error('Creation failed!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    cancel() {
      this.$router.go(-1)
  },
},
}