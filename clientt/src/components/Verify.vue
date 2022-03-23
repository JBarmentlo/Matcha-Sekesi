<template>
    <div class="vue-tempalte">
		<p class="centered-paragraph">
			<div v-if="success">
				Thank you {{username}} for validating your email !
			</div>
			<div v-else>
				Oopsies something went wrong, a team of very skilled monkeys is fixing the problem !
			</div>
			<!-- {{$route.params.hashId}} -->
		</p>
    </div>
</template>
<script>
import {verify} 		from '../services/auth.script'
    export default {
        data() {
            return {
				success		: false,
				username	: '',
				hashId		: 'a',
            }
        },
        methods: {

        },
		created() {
			console.log("ceated")
			this.hashId = this.$route.params.hashId
			verify(this.hashId)
			.then(response => {
				console.log("response %o", response)
				this.success = true
				this.username = response.data.username
			})
			.catch(error => {
				console.log(error)
				this.success = false
			})
		}
    }
</script>