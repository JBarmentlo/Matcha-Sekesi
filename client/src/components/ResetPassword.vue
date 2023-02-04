<template>
	<div class="center pt-5">
		<div class="inner-block">
			<div class="vue-tempalte">
				<ValidationObserver tag="form" ref="ResetFormObserver">
					<form v-if="!sent" @submit="submitResetForm">
						<h3>Reset Password</h3>
						<div class="form-group">
							<label>New Password</label>
							<ValidationProvider :rules="{ passewordo: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/ }" :skipIfEmpty="false" v-slot="{ errors }">
								<input
									type="password"
									v-model="password"
									class="form-control form-control-lg"
								/>
								<span class="login_error">{{ errors[0] }}</span>
							</ValidationProvider>
						</div>
						<div class="form-group pb-3">
							<label>Repeat Password</label>
							<ValidationProvider :rules="{ passewordo: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/ }" :skipIfEmpty="false" v-slot="{ errors }">
								<input
									type="password"
									v-model="passwordRep"
									class="form-control form-control-lg"
								/>
								<span class="login_error">{{ errors[0] }}</span>
							</ValidationProvider>
						</div>
						<button type="submit" class="btn btn-dark btn-lg btn-block">
							Reset Password
						</button>
						<p class="forgot-password text-right mt-2 mb-4">
							<router-link to="/forgot-password">Forgot password ?</router-link>
						</p>
					</form>
				</ValidationObserver>

				<p v-if="success">
					Your password has been reset, try logging in again and find your
					soulmate !
				</p>
				<p v-if="!success && sent && !expired">
					There was an error resetting your password, please request a reset
					again !
				</p>
				<p v-if="!success && sent && expired">
					The link has expired, please request a password reset again.
				</p>
			</div>
		</div>
	</div>
</template>


<script>
// import inputValidate from "../services/formValidate";
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { resetPassword } from "../services/auth";

export default {
	components: {
		ValidationProvider,
		ValidationObserver
	},
	data() {
		return {
			password   : "",
			passwordRep: "",
			success    : false,
			sent       : false,
			expired    : false,
			res_reset  : null,
			error      : false,
			hash       : this.$route.params.hash
			};
	},
	methods: {
		async submitResetForm(e) {
			e.preventDefault();
			console.log("reset pass");
			if (this.password != this.passwordRep) {
				console.log(this.password);
				console.log(this.passwordRep);
				alert("Passwords do not match");
				return;
			}
			if (this.$refs.ResetFormObserver.flags.invalid) {
				return;
			}
			try {
				this.res_reset = await resetPassword(this.hash, this.password)
				this.sent = true;
				if (this.res_reset.data.code == 'SUCCESS') {
					this.success = true;
				}
				else if (this.res_reset.data.code == 'TIMEOUT_RESET') {
					this.expired = true
				}
				else {
					this.error = true
				}
			}
			catch (e) {
				console.log("error in reset pass form: ", e)
			}
		},
	},
	created() {

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