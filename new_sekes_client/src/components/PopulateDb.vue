<template>
<div class="center">
		<div class="inner-block">
				<form @submit.prevent="submitForm">
					<h3>PopulateDb</h3>
					<div class="form-group">
						<label>Number of users to generate</label>
						<input
							type="text"
							v-model="n"
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
import { createRandomUsers } from "../services/user.js";


export default {
	data() {
		return {
			n: 1,
		};
	},
	methods: {
		async submitForm() {
			// console.log(e)
			try {
				let returns = await createRandomUsers(this.n)
				console.log(returns)
			}
			catch(err) {
				console.log("create user error: %o" , err)
			}

		}
	},
	created() {
	},
};
</script>
