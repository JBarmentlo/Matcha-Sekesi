<template>
	<div class="center">
		<div class="inner-block">
			<div v-if="success">
				<p class="centered-paragraph">
					Thank you {{ username }} for validating your email !
				</p>
			</div>
			<div v-if="error">
				<p class="centered-paragraph">
					Oopsies something went wrong, a team of very skilled monkeys is fixing
					the problem !
				</p>
			</div>
		</div>
	</div>
</template>
<script>
import { verifyMail } from "../services/auth";
export default {
	data() {
		return {
			success      : false,
			username     : "",
			hash         : "",
			verify_result: null,
			error        : false
		};
	},
	methods: {},
	async created() {
		console.log("ceated verify mail");
		this.hash = this.$route.params.hash;
		try {
			this.verify_result = await verifyMail(this.hash)
			this.username      = this.verify_result.data.username;
			this.success       = true
		}
		catch (e) {
			console.log("error in verify mail: ", e)
			this.error = true
		}
	},
};
</script>

<style scoped>

</style>