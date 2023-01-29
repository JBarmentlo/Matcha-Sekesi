<template>
	<div class="center pt-5">
			<!-- <div class="vue-template"> -->
				<ValidationObserver tag="form" ref="formObserver">
				<form @submit="signupFormSubmit">
					<h3>SIGN UP</h3>
					<div v-if="status_not_200" class="login_error">There was an error handling your request</div>
					<div class="form-group">
						<label>Username</label>
						<ValidationProvider rules="required|alpha_num|length:5" immediate v-slot="{ errors }">
							<input
								autocomplete="username"
								type="username"
								v-model="username"
								class="form-control form-control-lg"
							/>
							<span class="login_error">{{ errors[0] }}</span>
						</ValidationProvider>
						<div v-if="!is_valid_username" class="login_error">Error: 5 characters minimum are required</div>
						<div v-if="username_taken" class="login_error">Username not available</div>

					</div>

					<div class="form-group">
						<label>First Name</label>
						<ValidationProvider rules="required|alpha|length:1" immediate v-slot="{ errors }">
							<input
								type="text"
								v-model="firstName"
								class="form-control form-control-lg"
							/>
							<span class="login_error">{{ errors[0] }}</span>
						</ValidationProvider>
					</div>

					<div class="form-group">
						<label>Last Name</label>
						<ValidationProvider rules="required|alpha|length:1" immediate v-slot="{ errors }">
							<input
								type="text"
								v-model="lastName"
								class="form-control form-control-lg"
							/>
							<span class="login_error">{{ errors[0] }}</span>
						</ValidationProvider>
					</div>

					<div class="form-group">
						<label>Email address</label>
						<ValidationProvider rules="required|email" immediate v-slot="{ errors }">
							<input
								type="email"
								v-model="mail"
								class="form-control form-control-lg"
							/>
							<span class="login_error">{{ errors[0] }}</span>
						</ValidationProvider>
						<div v-if="!is_valid_email" class="login_error">Error: An email should contain a "@" and "."</div>
						<div v-if="mail_already_used" class="login_error">Mail already in use</div>
					</div>

					<div class="form-group pb-2">
						<label>Password</label>
						<ValidationProvider :rules="{ passewordo: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/ }" :skipIfEmpty="false" immediate v-slot="{ errors }">
							<div class = "input-group">
								<input
									autocomplete="current-password"
									:type="visible ? 'text' : 'password'"
									v-model="password"
									class="form-control form-control-lg"
								/>
								<span class="input-group-btn form-control">
									<button class="btn m-0" v-on:click="password_visibility" type="button">
									<b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
									<b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
									</button>
								</span>
							</div>
							<span class="login_error">{{ errors[0] }}</span>
						</ValidationProvider>
					</div>

					<button type="submit" class = "button_submit">
						Sign Up
					</button>

					<p class="forgot-password text-right">
						Already registered
						<router-link :to="{ name: 'Sign In' }">sign in?</router-link>
					</p>
					<b-button class="mt-3 loginBtn loginBtn--42" href='https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ed770153aaf57b2adf7cc62cc3c5d3014088889adbbfb5d2373d57a7b95c9fc6&redirect_uri=https%3A%2F%2Fmatcha.yoopster.com%2Fapi%2Fauth%2Foauth%2F&response_type=code'>
						Sign up with 42
					</b-button>
				</form>
				</ValidationObserver>
			<!-- </div> -->
	</div>
</template>
<script>
// import inputValidate from "../services/formValidate";
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { signup } from "../services/auth";
import router from "@/router";
import { getLoc } from '../services/user.js'
export default {
	components: {
		ValidationProvider,
		ValidationObserver
	},

	data() {
		return {
			username         : "",
			mail             : "",
			password         : "",
			firstName        : "",
			lastName         : "",
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
			status_not_200   : false,
			visible          : false
		};
	},
	methods: {
		password_visibility() {
			this.visible = !this.visible
		},

		async signupFormSubmit(e) {
			console.log("LOCALISATION:", this.locate())
			e.preventDefault();
			if (this.$refs.formObserver.flags.invalid) {
				console.log("invalid form")
				return false;
			}
			let signup_res = await signup({
				username  : this.username,
				firstName : this.firstName,
				lastName  : this.lastName,
				mail      : this.mail,
				password  : this.password,
				city      : this.city,
				latitude  : this.latitude,
				longitude : this.longitude,
				zipCode   : this.zipCode,
			})
			console.log("Form sent. response: ", signup_res.data)
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
					console.log("mail taken")
					this.mail_already_used = true
				}
				if (signup_res.data.message.includes("key 'USERS.USERS_username_uindex'")) {
					console.log("username taken")
					this.username_taken = true
				}
			}
			if (signup_res.data.code == "SUCCESS") {
				console.log("sign up success");
				router.push("/signin");
			}
		},

		locate() {
			return {

			}
		}
	},

	created() {

	},
    async mounted() {
		try {
			let res        = (await getLoc()).data
			this.city      = res.city
			this.longitude = res.loc.split(",")[0]
			this.latitude  = res.loc.split(",")[1]
			this.zipCode   = res.postal
		}
		catch {
			console.log("No loc")
		}
	}
};
</script>


<style scoped>
@import url("../assets/login.css");

.login_error {
	color : red;
	font-size: 80%;
	margin-left: 5px;
}

.loginBtn {
    box-sizing: border-box;
    position: relative;
    padding: 0 15px 0 46px;
    border: none;
    text-align: left;
    line-height: 34px;
    font-size: 13px;
    color: #FFF;
}

.loginBtn:before {
	content: "";
	box-sizing: border-box;
	position: absolute;
	top: 0;
	left: 0;
	width: 34px;
	height: 100%;
}

.loginBtn:focus {
	outline: none;
}
.loginBtn:active {
	box-shadow: inset 0 0 0 32px rgba(0,0,0,0.1);
}

.loginBtn--42 {
/*font-family: "Roboto", Roboto, arial, sans-serif;*/
	background: #fef8f7;
	color: black;
	width: 55%;
}
.loginBtn--42:before {
	border-right: #c0bcbc 1px solid;
	background : url('https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg?uselang=fr');
	background-size: 70%;
	background-repeat: no-repeat;
	background-position: 50%;
}

.loginBtn--42:hover, .loginBtn--42:focus {
    background-color: #f3eceb;
    background-image: linear-gradient(#e3e5e5, #c7c7c7e4);
}



</style>