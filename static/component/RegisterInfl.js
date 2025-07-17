export default {
    template: `
    <div class="container">

    <div class="form-container">
    <div>{{ error }}</div>
        <div class="form-header">
            <h2>Influencer account</h2>
        </div>
        
        <div class="form-group">
              <label for="inf-username">Username</label>
              <input type="text" id="inf-username" name="username" required v-model="cred.username">
          </div>
          <div class="form-group">
              <label for="inf-username">Email</label>
              <input type="text"  id="inf-email" name="email" required v-model="cred.email">
          </div>
          <div class="form-group">
              <label for="inf-name">Name</label>
              <input type="text"  id="inf-name" name="name" required v-model="cred.name">
          </div>
          <div class="form-group">
              <label for="inf-category">Category</label>
              <input type="text"  id="inf-category" name="category" v-model="cred.category">
          </div>
          <div class="form-group">
              <label for="inf-niche">Niche</label>
              <input type="text" id="inf-niche" name="niche" v-model="cred.niche" >
          </div>
          <div class="form-group">
              <label for="inf-reach">Reach(k)</label>
              <input type="text"  id="inf-reach" name="reach" v-model="cred.reach">
          </div>
          
            
            <div class="form-group">
                <label for="inf-password">Password</label>
                <input type="password" id="inf-password" name="password" required v-model="cred.password">
            </div>
          <div class="form-group">
              <label>Platform presence: </label>
              <div class="presence">
                  <input type="radio" id="youtube" name="presence" value="youtube" v-model="cred.platform">
                  <label for="youtube" class="icon-label">
                      <img src="static/images/youtube.png" alt="youtube Icon">
                      youtube
                  </label>

                  <input type="radio" id="instagram" name="presence" value="instagram" v-model="cred.platform">
                  <label for="instagram" class="icon-label">
                      <img src="static/images/instagram.png" alt="instagram Icon">
                      instagram
                  </label>

                  <input type="radio" id="twitter" name="presence" value="twitter" v-model="cred.platform">
                  <label for="twitter" class="icon-label">
                      <img src="static/images/twitter.png" alt="twitter Icon">
                      twitter
                  </label>
              </div>
          </div>
            <button type="submit" class="btn btn-primary btn-block" @click='register'>Register</button>
    
    </div>
    
    
</div>`
  ,

  data() {
    return {
        cred: {
            email: null,
            name: null,
            category: null,
            niche: null,
            reach: null,
            username: null,
            password: null,
            platform: null, 
        },
        error: null,
    }
  },
  methods: {
    async register() {
      try {
        const res = await fetch('/influencer-reg', {
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