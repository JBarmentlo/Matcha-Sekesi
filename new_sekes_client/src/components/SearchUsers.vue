<template>
	<div>
		<div class="center">
			<div class = "inner-block">
				<form class = "search_filter">
					<div class = "age pb-5">
						<b-row>
							<b-col md="6" class="mb-2">
							<label for="sb-disabled">Min age:</label>
							<b-form-spinbutton
								v-model="min_age"
								min="18"
								max="100"
							></b-form-spinbutton>
							</b-col>
							<b-col md="6" class="mb-2">
							<label for="sb-readonly" class="">Max age:</label>
							<b-form-spinbutton
								v-model="max_age"
								min="18"
								max="100"
							></b-form-spinbutton>
							</b-col>
						</b-row>
					</div>
					<div class = "rating pb-5">
						<label for="sb-inline">Minimum rating:</label>
						<b-form-rating
							v-model="min_rating"
						></b-form-rating>
					</div>
					<div class = "tags pb-5">
						<label for="sb-inline">Tags:</label>
						<b-form-tags
							input-id="tags-pills"
							v-model="interest_tags"
							tag-variant="primary"
							tag-pills
							size="lg"
							separator=" "
							placeholder="Add Tag..."
						></b-form-tags>
					</div>
					<div class = "submit">
						<button type="submit" class="btn btn-dark btn-lg btn-block">
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
		<profile-list :users="users"></profile-list>
	</div>
</template>

<script>
import { getAllUsers } from "../services/search";
import ProfileList from '../shared/ProfileList.vue'

export default {
	components: { ProfileList },
	data() {
		return {
			users        : [],
			min_age      : 30,
			max_age      : 50,
			interest_tags: [],
			min_rating   : 2,
			zipcodes     : [],
		}
	},
	methods: {
		
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