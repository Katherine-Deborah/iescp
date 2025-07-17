export default {
    template: `<div> <header class="navbar">
    <div class="nav-container">
    
        <div class="navbar-brand">
            <img src="static/images/give.png" alt="IESCP Logo">
            <h1 class="company-name">IESCP</h1>
        </div>
        <div class="navbar-middle" v-if="is_login">
            <input type="text" class="search-bar" v-model="search_name">
            <button class="search-icon" @click="searchName()">
                <img src="static/images/search.png" alt="Search Icon" class="icon" >
            </button>
        </div>
  <div class="navbar-icons" v-if="is_login">
      <button class="nav-icon">
          <img src="static/images/notification.png" alt="Notification Icon" class="icon">
      </button>
      <div class="dropdown">
          <button class="nav-icon dropdown-toggle">
              <img src="static/images/menu.png" alt="Menu Icon" class="icon">
          </button>
          <div class="dropdown-menu">
              <a @click="home">Profile</a>
              <a v-if="isInfluencer" @click="update">Update Profile</a>
              <a v-if="isSponsor" @click="campaign">Campaigns</a>
              <a v-if="isInfluencerorAdmin"@click="search">Search</a>
              <a @click="stat">Statistics</a>
              <a @click="logout">Log out</a>
          </div>
      </div>
    </div>
        </div>
</header></div>`,
    data() {
        return {
            role: localStorage.getItem('role'),
            id: localStorage.getItem('id'),
            is_login: localStorage.getItem('auth-token'),
            search_name: "Search..."
        }
    },
   computed: {
    isSponsor() { return this.role == 'sponsor'; },
    isInfluencer() { return this.role == 'influencer'; },
    isInfluencerorAdmin() {
        return this.role == 'influencer' || this.role == 'admin'; 
    },
   },
    methods: {
        async searchName(){
            const res = await fetch(`/search/${this.search_name}`, {
                headers: {
                    'Authentication-Token': this.token,  
                },
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            console.log('Fetched user:', data);
            if(this.role == 'sponsor'){
                this.$router.push({ path: '/influencer-form',query: { influencer_id:data.id}})
            }
            else{
                this.$router.push({ path: '/campaign-form', query: { campaign_id:data.id }})
            }
            
        },
        home(){
            if(this.role == 'admin'){
                this.$router.push({path: '/admin'});
              }
              if(this.role == 'sponsor'){
                this.$router.push({path: '/sponsor', query: { id: this.id}});
              }
              if(this.role == 'influencer'){
                this.$router.push({path: '/influencer', query: { id: this.id}});
              }
        },
        update(){
            this.$router.push({path: '/modify-influencer'})
        },
        search() {
            if(this.role == 'admin'){
                this.$router.push({path: '/search'});
              }
              
              if(this.role == 'influencer'){
                this.$router.push({path: '/search-influencer'});
              }
        },
        campaign() {
            this.$router.push({path: '/campaign'})
        },
        stat() {
            if(this.role=='admin'){
                this.$router.push({path: '/admin-stat'})
            }
            if(this.role=='sponsor'){
                this.$router.push({path: '/sponsor-stat', query: {sponsor_id: this.id}})
            }
            if(this.role=='influencer'){
                this.$router.push({path: '/influencer-stat', query: {influencer_id: this.id}})
            }
        },
        logout() {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('id')
            localStorage.removeItem('campaign_id')
            localStorage.removeItem('role')
            this.$router.push({path: '/login'})
        },
    },
}