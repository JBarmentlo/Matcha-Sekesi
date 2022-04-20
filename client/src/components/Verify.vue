<template>
	<div class="center">
		<div class="inner-block">
			<div v-if="success">
				<p class="centered-paragraph">
					Thank you {{ username }} for validating your email !
				</p>
			</div>
			<div v-else>
				<p class="centered-paragraph">
					Oopsies something went wrong, a team of very skilled monkeys is fixing
					the problem !
				</p>
			</div>
		</div>
	</div>
</template>
<script>
import { verify } from "../services/auth.script";
export default {
	data() {
		return {
			success: false,
			username: "",
			hashId: "a",
		};
	},
	methods: {},
	created() {
		console.log("ceated");
		this.hashId = this.$route.params.hashId;
		verify(this.hashId)
			.then((response) => {
				console.log("response %o", response);
				this.success = true;
				this.username = response.data.username;
			})
			.catch((error) => {
				console.log(error);
				this.success = false;
			});
	},
};
</script>

<style scoped>

</style>