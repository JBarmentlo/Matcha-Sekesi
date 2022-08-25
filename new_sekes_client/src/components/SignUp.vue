<template>
	<div class="center">
		<div class="inner-block">
			<!-- <div class="vue-template"> -->
				<form @submit="signupFormSubmit">
					<h3>Sign Up</h3>
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
						<router-link :to="{ name: 'login' }">sign in?</router-link>
					</p>
				</form>
			<!-- </div> -->
		</div>
	</div>
</template>
<script>
// import inputValidate from "../services/formValidate";
import { signup } from "../services/auth";
// import router from "@/router";

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
			console.log("SINUPRESL ", signup_res)
			if (signup_res.data.code == 'ER_DUP_ENTRY') {
				console.log("err dup entry on signup")
				console.log(signup_res.data.message)
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
.login_error {
	color : red;
	font-size: 80%;
	margin-left: 5px;
}



</style>