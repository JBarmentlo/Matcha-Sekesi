<template>
	<div>
		<form class="row" @submit.prevent>
			<label for="">Min Age</label>
			<input v-model="min_age" type="number"/>
			
			<label for="">Max Age</label>
			<input v-model="max_age" type="number"/>

			<label for="">Min Score</label>
			<input v-model="min_rating" type="number"/>

			<label for="">Zipcode</label>
			<input v-model="zipcodes" type="text"/>

			<label>Required Tags</label>
			<TagInputHandler v-model="required_tags"/>
		</form>
		<button @click="search">Search</button>
		<div class="row">
			<profile-list :users="users"></profile-list>
		</div>
	</div>
</template>

<script>
import { getAllUsers } from "../services/search";
import ProfileList from '../shared/ProfileList.vue'
import TagInputHandler from '../shared/TagInputHandler.vue'

export default {
	components: { ProfileList, TagInputHandler },
	data() {
		return {
			users        : [],
			min_age      : 0,
			max_age      : 50,
			required_tags: [],
			min_rating   : 0,
			zipcode      : null,
		}
	},
	methods: {
		search() {
			console.log(this.min_age, this.max_age, this.required_tags, this.min_rating, this.zipcodes)
		}
	},
	created() {
		console.log("hey");
		getAllUsers(this.$cookies.get("sekes_tokens"), this.min_age, this.max_age, this.interest_tags, this.min_rating, this.zipcodes)
		.then(users => {
			console.log("YUSERS: ", users.data.data)
			this.users = users.data.data;
			})
		.catch(err => {console.log("error fetchin all users %o", err)})
	},

}
</script>

<style scoped>


</style>