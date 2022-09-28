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
			<input v-model="zipcode" type="text"/>

			<label>Required Tags</label>
			<TagInputHandler v-model="required_tags"/>
			<fieldset>
				<legend>Order By</legend>
				<div>
					<input type="radio" id="Popularity" name="order_by" value="popScore" checked v-model="order_by">
					<label for="Popularity">Popularity</label>
				</div>

				<div>
					<input type="radio" id="age" name="order_by" value="age" v-model="order_by">
					<label for="age">Age</label>
				</div>
			</fieldset>

			<fieldset>
				<legend>Ascending or descending</legend>
				<div>
					<input type="radio" id="Acending" name="asc_or_desc" value="ASC" checked v-model="asc_or_desc">
					<label for="Acending">Acending</label>
				</div>

				<div>
					<input type="radio" id="Descending" name="asc_or_desc" value="DESC" v-model="asc_or_desc">
					<label for="Descending">Descending</label>
				</div>
			</fieldset>

		</form>
		<button @click="search">Search</button>
		<div class="row">
			<profile-list :users="users"></profile-list>
		</div>
	</div>
</template>

<script>
import { getAllUsers, searchUsers } from "../services/search";
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
			order_by     : "popScore",
			asc_or_desc  : "DESC",
			offset       : 0,
			limit        : 10,

		}
	},
	methods: {
		async search() {
			console.log(this.min_age, this.max_age, this.required_tags, this.min_rating, this.zipcode)
			let rese = await searchUsers(this.$cookies.get('sekes_tokens'),this.min_age, this.max_age, this.required_tags, this.min_rating, this.zipcode, this.offset, this.limit, this.order_by, this.asc_or_desc)
			console.log("serchress: ", rese.data.data)
			this.users = rese.data.data
		}
	},
	created() {
		console.log("hey");
		getAllUsers(this.$cookies.get("sekes_tokens"), this.min_age, this.max_age, this.interest_tags, this.min_rating, this.zipcode)
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