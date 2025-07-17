export default {
    template: `
    <div class="container">

    <div class="form-container">
    <div>{{ error }}</div>
        <div class="form-header">
            <h2>Update Profile</h2>
        </div>
        <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" name="name" required v-model="cred.name">
          </div>
          <div class="form-group">
              <label for="username">Username:</label>
              <input type="text" id="username" name="username" required v-model="cred.username">
          </div>
          <div class="form-group">
              <label for="category">Category:</label>
              <input type="text"  id="category" name="category" required v-model="cred.category">
          </div>
          <div class="form-group">
              <label for="niche">Niche:</label>
              <input type="text"  id="niche" name="niche" required v-model="cred.niche">
          </div>
          <div class="form-group">
              <label for="reach">Reach:</label>
              <input type="float" id="reach" name="reach" v-model="cred.reach">
          </div>
          <div class="form-group">
          <label for="image">Profile Picture:</label>
          <input type="file" id="image" @change="onFileChange">
        </div>

            <button type="submit" class="btn btn-primary btn-block" @click='modify'>Update</button>
            </div>
    
    </div>
    
    
</div>`
  ,
// dates not stored
  data() {
    return {
        influencer_id: localStorage.getItem('id'),
        cred: {
            name: null,
            category: null,
            niche: 0,
            reach: null,
            username: null,
        },
        image: null,
        token: localStorage.getItem('auth-token'),
        error: null,
    }
  },
  methods: {
    onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.image = file;
        //   this.imagePreview = URL.createObjectURL(file);
        }
      },
    async modify() {
      
        const formData = new FormData();
        formData.append('name', this.cred.name);
        formData.append('username', this.cred.username);
        formData.append('category', this.cred.category);
        formData.append('niche', this.cred.niche);
        formData.append('reach', this.cred.reach);
        if (this.image) {
          formData.append('image', this.image);
        }
  
        try {
          const res = await fetch(`/profile-modify/${this.influencer_id}`, {
            method: 'POST',
            headers: {
              'Authentication-Token': this.token,
            },
            body: formData,
          });
          localStorage.setItem('auth-token', this.token);
          const data = await res.json();
        if (res.ok) {
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
    const res = await fetch(`/specific-infl/${this.influencer_id}`, {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json()
    if (res.ok) {
      this.campaign = data
      this.cred= {
        name: data.name,
        category: data.category,
        niche: data.niche,
        reach: data.reach,
        username: data.username,
        image: data.image,
    }
      console.log(data)
    } else {
      this.error = res.status
    }
  },
}