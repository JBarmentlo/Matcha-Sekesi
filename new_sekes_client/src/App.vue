<template>
	<div id="app">
		<NavBar @setLoggedIn="setLoggedIn" v-bind:logged_in="logged_in"/>
		<notifications/>
		<router-view @setLoggedIn="setLoggedIn"/>
	</div>
</template>




<script>
import { getMyUser } from "./services/user";

import NavBar from "./shared/NavBar.vue"

// process.env.USER_ID; // "239482"
// process.env.USER_KEY; // "foobar"
// process.env.NODE_ENV; // "development"

export default {
	name: 'App',
	
	components: {
		NavBar
	},

	data() {
		return {
			logged_in       : false,
			currentUser     : Object,
		}
	},

	computed: {
	},

	methods: {
		async setLoggedIn(val) {
			this.logged_in = val;
			console.log("logged in set to: %s", val)
		},
	},

	created() {
		console.log("Created App");
	},
	async mounted() {
		// console.log("cookie signin disabled")
		console.log("Signin Created");
		if (this.$cookies.isKey("sekes_tokens") && this.$cookies.get("sekes_tokens") != null) {
			console.log("already logged in by cookie");
			try {
				let user = await getMyUser(this.$cookies.get('sekes_tokens'))
				if (user.data.code == "SUCCESS") {
					this.$cookies.set("user", {...user.data.data})
					this.setLoggedIn(true);
					if (this.$route.path != "/cat") {
						this.$router.push('/cat')
					}
				}
				else {
					this.$cookies.remove('sekes_tokens')
					this.$cookies.remove('user')
					this.$router.push('/signin')
				}
			}
			catch (e) {
				console.log("error in auto cookie signin", e)
				throw (e)
			}
		}
		else {
			console.log("not cookie signed in")
			this.$router.push('/signin')
		}
	},
}
</script>




<style>
/* #app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
} */
</style>
