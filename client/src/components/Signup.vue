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
import inputValidate from "../services/formValidate";
import { signup } from "../services/auth.script";
import router from "@/router";

export default {
	data() {
		return {
			username: "jhonny",
			mail: "joepbarmentlo@gmail.com",
			password: "qwertasd",
			firstName: "useless",
			lastName: "useless",
			ip: null,
			is_valid_username: true,
			is_valid_email: true,
			is_valid_password: true,
		};
	},
	methods: {
		validate_user_name(e) {
			this.is_valid_username = inputValidate.validateUserName(this.username)
		},
		validate_email(e) {
			this.is_valid_email = inputValidate.validateMail(this.mail)
		},
		validate_password(e) {
			this.is_valid_password = inputValidate.validatePassword(this.password)
		},
		signupFormSubmit(e) {
			// console.log("lol")
			// console.log(this.locate())
			// console.log("lol")
			e.preventDefault();
			if (this.is_valid_username == false || this.is_valid_email == false || this.is_valid_password == false) {
				return false;
			}
			signup({
				username: this.username,
				mail: this.mail,
				password: this.password,
			})
			.then((data) => {
				if (data.data.message == "User was registered successfully!") {
					console.log("signed up");
					router.push("/login");
				} else console.log("wtf signup");
				console.log(data.data.message);
			})
			.catch((err) => {
				console.log("error at signup %o", err.response.data);
				alert(err.response.data.message);
			});
		},

		locate() {
			return {
				geoplugin_city: geoplugin_city(),

				geoplugin_region: geoplugin_region(),

				geoplugin_areaCode: geoplugin_areaCode(),

				geoplugin_dmaCode: geoplugin_dmaCode(),

				geoplugin_countryCode: geoplugin_countryCode(),

				geoplugin_countryName: geoplugin_countryName(),

				geoplugin_continentCode: geoplugin_continentCode(),

				geoplugin_latitude: geoplugin_latitude(),

				geoplugin_longitude: geoplugin_longitude(),

				geoplugin_currencyCode: geoplugin_currencyCode(),

				geoplugin_currencySymbol: geoplugin_currencySymbol(),

				geoplugin_currencyConverter: geoplugin_currencyConverter(),
			};
		},
	},
	created() {
		fetch("https://api.ipify.org?format=json")
			.then((x) => x.json())
			.then(({ ip }) => {
				this.ip = ip;
				console.log(this.ip);
			});

		var scripts = ["http://www.geoplugin.net/javascript.gp"];
		scripts.forEach((script) => {
			let tag = document.createElement("script");
			tag.setAttribute("src", script);
			document.head.appendChild(tag);
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