<template>
	<div class="vue-tempalte">
		<form v-if="!sent" @submit="submitResetForm">
			<h3>Reset Password</h3>
			<div class="form-group">
				<label>New Password</label>
				<input type="password" v-model="password" class="form-control form-control-lg" />
			</div>
			<div class="form-group pb-3">
				<label>Repeat Password</label>
				<input type="password" v-model="passwordRep" class="form-control form-control-lg"/>
			</div>
			<button type="submit" class="btn btn-dark btn-lg btn-block">
				Sign In
			</button>
			<p class="forgot-password text-right mt-2 mb-4">
				<router-link to="/forgot-password">Forgot password ?</router-link>
			</p>
		</form>
		<p v-if="success">
			Your password has been reset, try logging in again and find your soulmate !
		</p>
		<p v-if="!success && sent && !expired">
			There was an error resetting your password, please request a reset again !
		</p>
		<p v-if="!success && sent && expired">
			The link has expired, please request a password reset again.
		</p>
	</div>
</template>
<script>
import inputValidate from "../services/formValidate";
import { resetPassword } from "../services/auth.script";
import router from "@/router";
import Vue from "vue";

export default {
	data() {
		return {
			password	: "",
			passwordRep	: "",
			success		: false,
			sent		: false,
			expired		: false
		};
	},
	methods: {
		submitResetForm(e) {
			e.preventDefault();
			console.log("reset pass");
			if (this.password != this.passwordRep) {
				console.log(this.password)
				console.log(this.passwordRep)
				alert("Passwords do not match");
				return;
			}
			if (!inputValidate.validatePassword(this.password))
			{
				alert("Password invalid");
				return
			}
			resetPassword(this.$route.params.hashId, this.password)
				.then(data => {
					console.log(data.data);
					console.log("Reset pass");
					this.success = true
					this.sent    = true
				})
				.catch((err) => {
					console.log("error at reset %o", err.response.data);
					this.success = false
					this.sent    = true
					if (err.response.data.message = "Code expired")
						this.expired = true
				});
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
			// router.push("/profile");
		}
	},
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
body {
  background: #2554FF !important;
  min-height: 100vh;
  display: flex;
  font-weight: 400;
}
body,
html,
.App,
.vue-tempalte,
.vertical-center {
  width: 100%;
  height: 100%;
}
.navbar-light {
  background-color: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
}
.vertical-center {
  display: flex;
  text-align: left;
  justify-content: center;
  flex-direction: column;    
}
.inner-block {
  width: 450px;
  margin: auto;
  background: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  padding: 40px 55px 45px 55px;
  border-radius: 15px;
  transition: all .3s;
}
.vertical-center .form-control:focus {
  border-color: #2554FF;
  box-shadow: none;
}
.vertical-center h3 {
  text-align: center;
  margin: 0;
  line-height: 1;
  padding-bottom: 20px;
}
label {
  font-weight: 500;
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
.social-icons {
  text-align: center;
  font-family: "Open Sans";
  font-weight: 300;
  font-size: 1.5em;
  color: #222222;
}
.social-icons ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.social-icons ul li {
  display: inline-block;
  zoom: 1;
  width: 65px;
  vertical-align: middle;
  border: 1px solid #e3e8f9;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
  margin-right: 5px;
  background: #f4f6ff;
}
.social-icons ul li a {
  display: block;
  font-size: 1.4em;
  margin: 0 5px;
  text-decoration: none;
}
.social-icons ul li a i {
  -webkit-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  -o-transition: all 0.2s ease-in;
  -ms-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
}
.social-icons ul li a:focus i,
.social-icons ul li a:active i {
  transition: none;
  color: #222222;
}
</style>