<template>
	<div>
		<form class = "search_filter">
			<div class = "age">
				<b-row>
					<b-col md="6" class="mb-2">
					<label for="sb-disabled">min age</label>
					<b-form-spinbutton id="sb-disabled" v-model="min_age" disabled></b-form-spinbutton>
					</b-col>
					<b-col md="6" class="mb-2">
					<label for="sb-readonly" class="">max age</label>
					<b-form-spinbutton id="sb-readonly" v-model="max_age" readonly></b-form-spinbutton>
					</b-col>
				</b-row>
			</div>
			<div class = "tags">
				<b-form-tags
					input-id="tags-pills"
					v-model="interest_tags"
					tag-variant="primary"
					tag-pills
					size="lg"
					separator=" "
					placeholder="Enter new tags separated by space"
				></b-form-tags>
			</div>
			<div class = "rating">
				<b-form-rating v-model="min_rating"></b-form-rating>
			</div>
			<div class = "distance">
				<label for="sb-inline">Minimum distance</label>
    			<b-form-spinbutton id="sb-inline" v-model="min_km" inline></b-form-spinbutton>
			</div>
		</form>
		<profile-list :users="users"></profile-list>
	</div>
</template>

<script>
import ProfileList from './ProfileList.vue'
import { getAllUsers} from "../services/user.script";


export default {
	components: { ProfileList },
	data() {
		return {
			users: [],
			min_age : 30,
			max_age: 50,
			interest_tags: [],
			min_rating: 2,
			min_km: 10,
		}
	},
	created() {
		getAllUsers(this.$cookies.get("user")).then(users => {this.users = users.data}).catch(err => {console.log("error fetchin all users %o", err)})
	}
}
</script>

<style scoped>

</style>