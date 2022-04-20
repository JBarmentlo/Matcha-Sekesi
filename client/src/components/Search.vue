<template>
	<profile-list :users="users"></profile-list>
</template>

<script>
import ProfileList from './ProfileList.vue'
import { getAllUsers} from "../services/user.script";


export default {
	components: { ProfileList },
	data() {
		return {
			users: []
		}
	},
	created() {
		getAllUsers(this.$cookies.get("user")).then(users => {this.users = users.data}).catch(err => {console.log("error fetchin all users %o", err)})
	}
}
</script>

<style scoped>

</style>