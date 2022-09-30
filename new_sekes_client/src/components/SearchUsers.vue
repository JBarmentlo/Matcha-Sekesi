<template>
	<div>
		<form class="row" @submit.prevent>
			<label for="min_age">Min Age</label>
			<input id="min_age" v-model="min_age" type="number"/>
			
			<label for="max_age">Max Age</label>
			<input id="max_age" v-model="max_age" type="number"/>

			<label for="min_rating">Min Score</label>
			<input id="min_rating" v-model="min_rating" type="number"/>

			<label for="zipcode">Zipcode</label>
			<input id="zipcode" v-model="zipcode" type="text"/>

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
			<profile-list :users="users" :current_page="current_page"></profile-list>
		</div>
	</div>
</template>

<script>
import { searchUsers } from "../services/search";
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
			limit        : 200,
			current_page : 1,
			user         : this.$cookies.get('user')

		}
	},
	methods: {
		async search() {
			console.log(this.min_age, this.max_age, this.required_tags, this.min_rating, this.zipcode)
			let rese = await searchUsers(this.$cookies.get('sekes_tokens'),this.min_age, this.max_age, this.required_tags, this.min_rating, this.zipcode, this.offset, this.limit, this.order_by, this.asc_or_desc)
			this.users = rese.data.data
			this.current_page = 1
		},

		addScoreBlend(user) {
			let score = user.popScore
			if ((user.zipCode != null) && (user.zipCode == this.$cookies.get('user').zipCode)) {
				score += 2
			}
			score += user.tag_list.filter(t => this.$cookies.get('user').tag_list.includes(t)).length
			return {...user, score: score}
		}

	},

	async created() {
		console.log(this.min_age, this.max_age, this.required_tags, this.min_rating, this.zipcode)
		let rese = await searchUsers(this.$cookies.get('sekes_tokens'), this.user.age - 10, this.user.age + 40, this.user.tag_list, 0, null, this.offset, this.limit, this.order_by, this.asc_or_desc)
		this.users = rese.data.data.map(this.addScoreBlend).sort((a,b) => {a.score < b.score})
		this.current_page = 1
	}

}
</script>

<style scoped>


</style>