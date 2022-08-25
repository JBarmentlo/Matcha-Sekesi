<template>
	<div class="center pt-5">
			<!-- <div class="vue-template"> -->
				<form @submit="signupFormSubmit">
					<h3>Sign Up</h3>
					<div v-if="status_not_200" class="login_error">There was an error handling your request</div>
					<div class="form-group">
						<label>Username</label>
						<input
							autocomplete="username"
							type="username"
							v-model="username"
							class="form-control form-control-lg"
							@keyup="validate_user_name"
						/>
						<div v-if="!is_valid_username" class="login_error">Error: 5 characters minimum are required</div>
						<div v-if="username_taken" class="login_error">Username not available</div>

					</div>

					<div class="form-group">
						<label>First Name</label>
						<input
							type="text"
							v-model="firstName"
							class="form-control form-control-lg"
						/>
					</div>

					<div class="form-group">
						<label>Last Name</label>
						<input
							type="text"
							v-model="lastName"
							class="form-control form-control-lg"
						/>
					</div>

					<div class="form-group">
						<label>Email address</label>
						<input
							type="email"
							v-model="mail"
							class="form-control form-control-lg"
							@keyup="validate_email"
						/>
						<div v-if="!is_valid_email" class="login_error">Error: An email should contain a "@" and "."</div>
						<div v-if="mail_already_used" class="login_error">Mail already in use</div>
					</div>

					<div class="form-group pb-2">
						<label>Password</label>
						<input
							autocomplete="current-password"
							type="password"
							v-model="password"
							class="form-control form-control-lg"
							@keyup="validate_password"
						/>
						<div v-if="!is_valid_password" class="login_error">Error: 5 characters minimum are required</div>
					</div>

					<button type="submit" class="btn btn-dark btn-lg btn-block">
						Sign Up
					</button>

					<p class="forgot-password text-right">
						Already registered
						<router-link :to="{ name: 'Sign In' }">sign in?</router-link>
					</p>
				</form>
			<!-- </div> -->
	</div>
</template>
<script>
// import inputValidate from "../services/formValidate";
import { signup } from "../services/auth";
import router from "@/router";

export default {
	data() {
		return {
			username         : "jhonny",
			mail             : "joepbarmentlo@gmail.com",
			password         : "qwertasd",
			firstName        : "useless",
			lastName         : "useless",
			zipCode          : null,
			city             : null,
			latitude         : null,
			longitude        : null,
			ip               : null,
			is_valid_username: true,
			is_valid_email   : true,
			is_valid_password: true,

			mail_already_used: false,
			username_taken   : false,
			status_not_200   : false
		};
	},
	methods: {
		validate_user_name(e) {
			console.log(e)
			this.is_valid_username = true
		},
		validate_email(e) {
			console.log(e)
			this.is_valid_email = true
		},
		validate_password(e) {
			console.log(e)
			this.is_valid_password = true
		},
		async signupFormSubmit(e) {
			// console.log("LOCALISATION:", this.locate())
			e.preventDefault();
			if (this.is_valid_username == false || this.is_valid_email == false || this.is_valid_password == false) {
				return false;
			}
			let signup_res = await signup({
				username : this.username,
				firstName: this.firstName,
				lastName : this.lastName,
				mail     : this.mail,
				password : this.password,
			})
			// console.log("SIGnup RES: ", signup_res)
			this.username_taken    = false
			this.mail_already_used = false
			if (signup_res.status != 200) {
				this.status_not_200 = true
				return
			}
			if (signup_res.data.code == 'ER_DUP_ENTRY') {
				console.log("err dup entry on signup")
				console.log(signup_res.data.message)
				if (signup_res.data.message.includes("key 'USERS.USERS_mail_uindex'")) {
					this.mail_already_used = true
				}
				if (signup_res.data.message.includes("key 'USERS.USERS_username_uindex'")) {
					this.username_taken = true
				}
			}
			if (signup_res.data.code == "SUCCESS") {
				console.log("sign up success");
				router.push("/signin");
			}
		},
	},
	created() {
		fetch("https://api.ipify.org?format=json")
			.then((x) => x.json())
			.then(({ ip }) => {
				this.ip = ip;
				console.log(this.ip);
			});
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
.login_error {
	color : red;
	font-size: 80%;
	margin-left: 5px;
}



</style>