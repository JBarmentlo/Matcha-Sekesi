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
		<p v-if="!success && sent">
			There was an error resetting your password, please request a reset again !
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
			sent		: false

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

