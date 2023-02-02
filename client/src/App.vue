<template>
	<div id="app"
		:class="[isActive ? 'darkmode' : '']">
		<NavBar @setLoggedIn="setLoggedIn" v-bind:logged_in="logged_in" @change-mode="enableDarkMode"/>
		<notifications/>
		<router-view @setLoggedIn="setLoggedIn"/>
	</div>
</template>




<script>
// import { getMyUser } from "./services/user";
import { getMyMessages } from './services/chat'
// import { updateUserStore } from './router'

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
			currentUser     : Object,
			messages        : null,
			polling         : null,
			isActive: false,
		}
	},

	computed: {
		token: {
			get: function() {
				return this.$root.store.state.token;
			},
			set: function(sekes_token) {
				this.$root.store.setTokenAction(sekes_token);
			}
		},

		user: {
			get: function() {
				return this.$root.store.state.user;
			},
			set: function(user) {
				this.$root.store.setUserAction(user);
			}
		},

		logged_in: {
			get: function() {
				return this.$root.store.state.logged_in;
			},
			set: function(logged_in) {
				this.$root.store.setLoggedInAction(logged_in);
			}
		}
	},

	methods: {
		enableDarkMode(isActive) {
			this.isActive = isActive;
		},
		async setLoggedIn(val) {
			this.logged_in = val;
			console.log("logged in set to: %s", val)
			if (this.logged_in == true) {
				console.log("Start Polling notifs / messages")
				this.startPollingMsg(1000)
			}
			else if (this.logged_in == false && this.polling != null) {
				console.log("Stop Polling notifs / messages")
				clearInterval(this.polling)
			}
		},

		startPollingMsg(freq) {
			this.polling = setInterval(async () => {
				try {
					if (this.messages == null) {
						this.messages = (await getMyMessages(this.token, 0, 100)).data.data
					}
					else {
						let old_ids = this.messages.map(n => n.id)
						this.messages = (await getMyMessages(this.token, 0, 100)).data.data.reverse()
						let new_notifs = this.messages.filter(n => !old_ids.includes(n.id) && !(n.sender == this.$cookies.get('user').username))
						this.notifyUser(new_notifs)
					}
				}
				catch(e) {
					console.log("Interrrupted Msg polling")
					clearInterval(this.polling)
				}

			}, freq)
			console.log(freq)
		},

		notifyUser(notif_list) {
			if (notif_list.length != 0) {
				console.log("notify: ", notif_list)
				for (const notif of notif_list) {
					this.$notify({
						text: notif.sender + " sent you a message!"
					});
				}
			}
		},
	},

	created() {
		console.log("Created App");
		// this.user  = JSON.parse(localStorage.getItem('user'))
		// this.token = JSON.parse(localStorage.getItem('sekes_token'))
		// updateUserStore()
		// console.log("####################################");
		// console.log(this.$root.store.state.token)
		// this.$root.store.setTokenAction("YIHAA")
		// console.log(this.$root.store.state.token)
		// console.log("####################################");
	},

	async mounted() {
		console.log("App mounted");
		if (this.logged_in) {
			this.setLoggedIn
		}
		// if (this.token != null) {
		// 	console.log("already logged in by cookie");
		// 	try {
		// 		let user = await getMyUser(this.token)
		// 		console.log("User:" + user.data.code)
		// 		if (user.data.code == "SUCCESS") {
		// 			this.user = {...user.data.data}
		// 			console.log("signin success for route: ",this.$route.fullPath)
		// 			this.setLoggedIn(true);
		// 			if (["/", "signin", "signup"].includes(this.$route.fullPath)) {
		// 				this.$router.push("/editprofile")
		// 			}
		// 		}
		// 		else {
		// 			this.token = null
		// 			this.user  = null
		// 			// this.$router.push('/signin')
		// 		}
		// 	}
		// 	catch (e) {
		// 		this.token = null
		// 		this.user  = null
		// 		this.setLoggedIn(false);
		// 		console.log("error in auto cookie signin", e)
		// 		throw (e)
		// 	}
		// }
		// else {
		// 	console.log("not cookie signed in")
		// 	// this.$router.push('/signin')
		// }
	},

	beforeDestroy () {
		if (this.polling != null) {
			clearInterval(this.polling)
		}
	}
}
</script>




<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap");


:root {
  --font: Roboto, sans-serif;
  --textColor: #2f62c9c2;
	background-color: #fbd2fc;
}

:root #app.darkmode {
	--textColor: #f6c0ba;
	background-color: rgb(13, 13, 138);
}

#app {
	font-family: var(--font);
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: var(--textColor);
	background-color: #fbd2fc;
	letter-spacing: 2px;
}

#app.darkmode {
	background-color: rgb(13, 13, 138);
}



</style>
