<template>
	<div>
		<div class="center">
			<div class = "inner-block">
				<form class = "search_filter"  @submit="save_changes">
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
					<div class = "distance">
						<label for="sb-input">Minimum distance:</label>
						<b-row>
							<b-col md="6" class="mb-2">	
								<b-form-spinbutton
									id="sb-input"
									v-model="min_km"
									min="0"
									max="160"
								></b-form-spinbutton>
							</b-col>
						</b-row>
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
import ProfileList from './ProfileList.vue'
import { getAllUsers} from "../services/user.script";
import { search } from "../services/search.script";


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
	methods: {
		save_changes(e) {
			console.log("saving changes");
			e.preventDefault();
			search({
				min_age : this.min_age,
				max_age: this.max_age,
				interest_tags: this.interest_tags,
				min_rating: this.min_rating,
				min_km: this.min_km,
			})
			.then((data) => {

			if (data.data.message == "Profil research was succesful") {
				console.log("search done");
				console.log(data.data.users);
				this.users = data.data.users;
			} else console.log("wtf search");
			
			})
			.catch((err) => {
				console.log("error at search %o", err.response.data);
				alert(err.response.data.message);
			});
		}
		
	},
	created() {
		console.log("hey");
		getAllUsers(this.$cookies.get("user")).then(users => {this.users = users.data}).catch(err => {console.log("error fetchin all users %o", err)})
	},

}
</script>

<style scoped>


</style>