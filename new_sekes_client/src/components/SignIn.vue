<template>
<div class="center">
		<div>
				<form @submit="submitLoginForm">
					<h3>Sign In</h3>
					<div class="form-group">
						<label>Username</label>
						<input
							type="text"
							v-model="username"
							class="form-control form-control-lg"
						/>
					</div>
					<div class="form-group pb-3">
						<label>Password</label>
						<input
							type="password"
							v-model="password"
							class="form-control form-control-lg"
						/>
					</div>
					<button type="submit" class="btn btn-dark btn-lg btn-block">
						Sign In
					</button>
					<p class="forgot-password text-right mt-2 mb-4">
						<router-link to="/forgot-password">Forgot password ?</router-link>
					</p>
				</form>
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
		};
	},
	methods: {
		async submitLoginForm(e) {
			console.log("login in form submit");
			e.preventDefault();
			let signin_res = await signin({
				username: this.username,
				password: this.password
			})
			console.log("signin_res: ", signin_res)
		},
	},
	created() {
		console.log("Created");
		if (
			this.$cookies.isKey("user") &&
			this.$cookies.get("user").data.id != null
		) {
			console.log("already logged in by cookie");
			this.$emit("setLoggedIn", true);
		}
	},
};
</script>

<style scoped>


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