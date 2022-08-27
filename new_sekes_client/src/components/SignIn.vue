<template>
	<div class="center pt-5">
		<div v-if="status != 'SUCCESS'">
			<form @submit="submitLoginForm">
				<h3>Sign In</h3>
				<div class="form-group">
					<label>Username</label>
					<input
						type="text"
						v-model="username"
						class="form-control form-control-lg"
					/>
					<div v-if="status == 'MISSING_USERNAME'" class="login_error">User doesn't exist</div>

				</div>
				<div class="form-group pb-3">
					<label>Password</label>
					<input
						type="password"
						v-model="password"
						class="form-control form-control-lg"
					/>
					<div v-if="status == 'WRONG_PASSWORD'" class="login_error">Wrong Password</div>
				</div>
				<button type="submit" class="btn btn-dark btn-lg btn-block">
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
// import router from "@/router";

export default {
	data() {
		return {
			username: "",
			password: "",
			status: ""
		};
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
				this.status = signin_res.data.code
				console.log("signin_res: ", signin_res.data)
				console.log("signin_res_use: ", signin_res.data.user)
				if (signin_res.data.code == 'SUCCESS') {
					this.$cookies.set("user", {...signin_res.data.user})
					delete signin_res.data.user
					this.$cookies.set("sekes_tokens", signin_res.data)
					// console.log("cookie set: ", signin_res.data)

					this.$router.push('/editprofile')
				}
			}
			catch (e) {
				console.log("error in signin form submit: ", e)
				throw(e)
			}
			
		},
	},
	created() {
		console.log("cookie signin disabled")
		// console.log("Signin Created");
		// if (this.$cookies.isKey("user") && this.$cookies.get("user").user.username != null) {
		// 	console.log("already logged in by cookie");
		// 	this.$emit("setLoggedIn", true);
		// 	this.$router.push('/editprofile')
		// }
		// else {
		// 	console.log("not cookie signed in")
		// 	console.log(this.$cookies.keys())
		// 	console.log(this.$cookies.isKey('user'))

		// }
	},
};
</script>

<style scoped>

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  /* border: 3px solid green; */
}
.forgot-password,
.forgot-password a {
  text-align: right;
  font-size: 13px;
  padding-top: 10px;
  color: #7a7a7a;
  margin: 0;
}
.forgot-password a {
  color: #2554FF;
}
</style>