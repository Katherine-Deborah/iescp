export default {
    template: `
    <div class="container">
    
    <div class="form-container">
    <div>{{ error }}</div>
        <div class="form-header">
            <h2>Sponsor account</h2>
        </div>

        <div class="form-group">
              <label for="inf-username">Username</label>
              <input type="text"  id="inf-username" name="username" required v-model="cred.username">
          </div>
          <div class="form-group">
              <label for="inf-email">Email</label>
              <input type="text"  id="inf-email" name="email" required v-model="cred.email">
          </div>
          <div class="form-group">
              <label for="inf-name">Company Name / Name</label>
              <input type="text" id="inf-name" name="name" required v-model="cred.company_name">
          </div>
          <div class="form-group">
              <label for="inf-industry">Industry</label>
              <input type="text" id="inf-industry" name="industry" v-model="cred.industry">
          </div>
          <div class="form-group">
              <label for="inf-budget">Budget($)</label>
              <input type="text"  id="inf-budget" name="budget" required v-model="cred.budget">
          </div>
            <div class="form-group">
                <label for="inf-password">Password</label>
                <input type="password" id="inf-password" name="password" required v-model="cred.password">
            </div>
          
            <button type="submit" class="btn btn-primary btn-block" @click='register'>Register</button>
       
    </div>
    
</div>`
  ,

  data() {
    return {
        cred: {
            username: null,
            email: null,
            company_name: null,
            industry: null,
            budget: null,
            password: null,
        },
        error: null,
    }
  },
  methods: {
    async register() {
      try {
        const res = await fetch('/sponsor-reg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(this.cred),
        });
        const data = await res.json();
        if (res.ok) { 
          this.$router.push({path: '/login'});
        } else {
          console.error('Registration failed!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
  },
}