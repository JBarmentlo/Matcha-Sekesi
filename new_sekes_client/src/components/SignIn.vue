<template>
	<div class="center pt-5">
		<div v-if="status != 'SUCCESS'">
			<form @submit="submitLoginForm">
				<h3>SIGN IN</h3>
				<div class="form-group">
					<label>Username</label>
					<input
						type="text"
						v-model="username"
						class="form-control form-control-lg"
					/>
					<div v-if="wrongUser" class="login_error">User doesn't exist</div>

				</div>
				<div class="form-group pb-3">
					<label>Password</label>
					<div class = "input-group">
					<input
						type="password"
						v-model="password"
						class="form-control form-control-lg"
					/>
					<span class="input-group-btn form-control">
						<button class="btn" v-on:click="password_visibility" type="button">
						<b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
						<b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
						</button>
					</span>
					</div>
					<div v-if="wrongPass" class="login_error">Wrong Password</div>
				</div>
				<button type="submit" class = "button_submit">
					Sign In
				</button>
				<p class="forgot-password text-right mt-2 mb-4">
					<router-link :to="{ name: 'Forgot Password' }">Forgot password ?</router-link>
				</p>
			</form>
		</div>
		<div v-else>
			<div class="form-group">
				Logged In !
			</div>
		</div>
	</div>
</template>

<script>
import { signin } from "../services/auth";
// import { getMyUser } from "../services/user";
// import router from "@/router";

export default {
	data() {
		return {
			username: "",
			password: "",
			status: ""
		};
	},

	computed: {
		wrongPass() {
			return this.status == 'WRONG_PASSWORD'
		},
		wrongUser() {
			return this.status == 'MISSING_USERNAME'
		}
	},

	methods: {
		async submitLoginForm(e) {
			console.log("login in form submit");
			e.preventDefault();
			try {
				let signin_res = await signin({
					username: this.username,
					password: this.password
				})
				console.log("data: ",signin_res.data)
				this.status = signin_res.data.code
				if (signin_res.data.code == 'SUCCESS') {
					console.log("sekes_tokens_cookie set to : ", (({ accessToken, signature }) => ({ accessToken, signature }))(signin_res.data))
					console.log("user cookie set to: ", signin_res.data.user)
					this.$cookies.set("user", {...signin_res.data.user})
					this.$cookies.set("sekes_tokens",  (({ accessToken, signature }) => ({ accessToken, signature }))(signin_res.data))
					this.$emit('setLoggedIn', true)
					this.$router.push('/editprofile')
				}
			}
			catch (e) {
				console.log("error in signin form submit: ", e)
				throw(e)
			}
			
		},
	},

	// async mounted() {
	// 	// console.log("cookie signin disabled")
	// 	console.log("Signin Created");
	// 	if (this.$cookies.isKey("sekes_tokens") && this.$cookies.get("sekes_tokens") != null) {
	// 		console.log("already logged in by cookie");
	// 		try {
	// 			let user = await getMyUser(this.$cookies.get('sekes_tokens'))
	// 			if (user.code == "SUCCESS") {
	// 				console.log("AUto login user: ", user.data.data)
	// 				this.$cookies.set("user", {...user.data.data})
	// 				this.$emit("setLoggedIn", true);
	// 				this.$router.push('/editprofile')
	// 			}
	// 			else {
	// 				this.$cookies.remove('sekes_tokens')
	// 				this.$cookies.remove('user')
	// 			}
				
	// 		}
	// 		catch (e) {
	// 			console.log("error in auto cookie signin", e)
	// 			throw (e)
	// 		}
	// 	}
	// 	else {
	// 		console.log("not cookie signed in")
	// 	}
	// },
};
</script>

<style scoped>
@import url("../assets/login.css");

.password > input {
	width: 80%;
}
	
</style>