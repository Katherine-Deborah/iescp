export default {
    template: `
<div class="container">

      <div class="form-container">
      <div>{{ error }}</div>
          <div class="form-header">
              <h2>Sign in</h2>
          </div>
        
              <div class="form-group">
                  <label for="login-username">Username</label>
                  <input type="text"  id="login-username" name="username" required v-model="cred.username">
              </div>
              <div class="form-group">
                  <label for="login-email">Email</label>
                  <input type="text" id="login-email" name="email" required v-model="cred.email">
              </div>
              <div class="form-group">
                  <label for="login-password">Password</label>
                  <input type="password" id="login-password" name="password" required v-model="cred.password">
              </div>
            <div class="form-group">
                <label for="account_type">Account Type:</label>
                <select id="account_type" name="account_type" v-model="cred.account_type">
                    <option value="admin">Admin</option>
                    <option value="influencer">Influencer</option>
                    <option value="sponsor">Sponsor</option>
                </select>
            </div>
              <button type="submit" class="btn btn-primary btn-block" @click='login'>Login</button>
    
          <div class="form-footer">
              <p>Don't have an account?</p>
            <p>Register as <span @click="influencer_reg" style="cursor:pointer; color:blue;">Influencer</span> or 
            <span @click="sponsor_reg" style="cursor:pointer; color:blue;">Sponsor</span> </p>
      </div>  
</div>
</div>`
  ,

  data() {
    return {
        cred: {
            username: null,
            email: null,
            account_type: "admin",
            password: null,
        },
        error: null,
    }
  },
  methods: {
    influencer_reg() {
      this.$router.push({ path: '/influencer-registration' });
    },
    sponsor_reg(){
      this.$router.push({path: '/sponsor-registration'});
    },
    async login() {
        const res = await fetch('/user-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(this.cred),
        });
        
        if (res.ok) {
          const data = await res.json(); 
          console.log(data)
          localStorage.setItem('auth-token', data.token);
          localStorage.setItem('role', data.role);
          localStorage.setItem('id', data.id );
          if(data.role == 'admin'){
            this.$router.push({path: '/admin'});
          }
          if(data.role == 'sponsor'){
            this.$router.push({path: '/sponsor', query: { id: data.id}});
          }
          if(data.role == 'influencer'){
            this.$router.push({path: '/influencer', query: { id: data.id}});
          }
        } else {
          const errorData = await res.json();
          this.error = errorData;
          console.error('Login failed:', errorData);
        }
    },
  },
}