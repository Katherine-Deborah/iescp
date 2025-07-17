import router from './router.js';
import Navbar from './component/Navbar.js';

router.beforeEach((to, from, next) => {
  const publicPages = ['Login', 'RegisterInfl', 'RegisterSpon'];
  const authRequired = !publicPages.includes(to.name);
  const loggedIn = localStorage.getItem('auth-token');

  if (authRequired && !loggedIn) {
      next({ name: 'Login' });
  } else {
      next();
  }
});
  
new Vue({
    el: '#app',
    template: `<div>
    <Navbar/>
    <router-view/></div>`,
    router,
    components: {
        Navbar,
    },
})

