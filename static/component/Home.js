import AdminHome from './AdminHome.js';
import SponsorHome from './SponsorHome.js';
import InfluencerHome from './InfluencerHome.js';

export default {
    template: `
    <div>
    <AdminHome v-if="userRole === 'admin'" :user_id="id" />
    <SponsorHome v-else-if="userRole === 'spon'" :user_id="id" />
    <InfluencerHome v-else-if="userRole === 'infl'" :user_id="id" />
    </div>`,

    data() {
        return {
            userRole: this.$route.query.role,
            id: this.$route.query.id,
        };
    },

    components: {
        AdminHome,
        SponsorHome,
        InfluencerHome,
    },
    
};
