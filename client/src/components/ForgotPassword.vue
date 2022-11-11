<template>
	<div class="center pt-5">
		<div class="vue-tempalte">
			<div v-if="!requestSent">
				<form @submit="onSubmit">
					<h3>Forgot Password</h3>
					<div class="form-group pb-3">
						<label for="mail">Email address</label>
						<input
							id="mail"
							type="email"
							v-model="mail"
							class="form-control form-control-lg"
						/>
					</div>
					<button type="submit" class="btn btn-dark btn-lg btn-block">
						Reset password
					</button>
				</form>
			</div>
			<div v-else>
				<div v-if="error">
					There was an error handling your request, please try again shortly.
				</div>
				<div v-else class="text-center">
					An email was sent to <b>{{ mail }}</b>. <br /><br/>
					Check your inbox to reset your password, the link is only valid for
					15 minutes. <br/>
					If you haven't received anything, you may have enterred an incorrect email, or it is not associated with any account.
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { requestPassReset } from "../services/auth";

export default {
	data() {
		return {
			requestSent: false,
			error      : false,
			mail       : "",
		};
	},

	props: {},

	methods: {
		async onSubmit(e) {
			console.log("requestin reset");
			e.preventDefault();
			try {
				await requestPassReset(this.mail)
				console.log("Success in request reset pass")
				this.requestSent = true;
			}
			catch (e) {
				console.log("error in request reset pass: ", e)
				this.error = true
			}
		},
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

.inner-block {
  background: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  padding: 40px 55px 45px 55px;
  border-radius: 15px;
  transition: all .3s;
}

</style>