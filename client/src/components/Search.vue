<template>
	<div>
		<div v-if="complete === false" class="center">
			<div class = "inner-block">
				<p class = "text-center ">
				Please complete your profile before looking at other seksi users
				</p>
				<router-link class = "btn btn-dark btn-md btn-block" to="/Profile">Complete my profile
				</router-link>
			</div>
		</div>
		<div v-if="complete === true" class="center">
				<b-dropdown text="Min Age" class = "m-3">
					<div class = "dropdown_menu" >
					<div v-for="index in 100 - 18" :key="index">
						<b-dropdown-item v-if="min_age === index + 17"
							class = "dropdown-item active"
							v-model="min_age"
							>
							{{index + 17}}
						</b-dropdown-item>
						<b-dropdown-item v-if="min_age !== index + 17"
							class = "dropdown-item"
							@click="setminage(index + 17)"
							>
							{{index + 17}}
						</b-dropdown-item>
						
					</div>
					</div>
				</b-dropdown>
				<b-dropdown text="Max Age" class = "m-3">
					<div class = "dropdown_menu" >
					<div v-for="index in 100 - 18" :key="index">
						<b-dropdown-item v-if="min_age === index + 17"
							class = "dropdown-item active"
							v-model="min_age"
							>
							{{index + 17}}
						</b-dropdown-item>
						<b-dropdown-item v-if="min_age !== index + 17"
							class = "dropdown-item"
							@click="setminage(index + 17)"
							>
							{{index + 17}}
						</b-dropdown-item>
						
					</div>
					</div>
				</b-dropdown>
				<b-dropdown text="Popularity score" class = "m-3">
					<b-form-rating
						v-model="min_rating"
					></b-form-rating>
				</b-dropdown>
				<b-dropdown text="Tags" class = "m-3">
						<b-form-tags
							input-id="tags-pills"
							v-model="interest_tags"
							tag-variant="primary"
							tag-pills
							size="lg"
							separator=" "
							placeholder="Add Tag..."
						></b-form-tags>
				</b-dropdown>
				<b-dropdown text="Minimum distance" class = "m-3">
					<b-row>
							<b-col
							>	
								<b-form-spinbutton
									id="sb-input"
									v-model="min_km"
									min="0"
									max="160"
								></b-form-spinbutton>
							</b-col>
						</b-row>
				</b-dropdown>
		</div>
		<profile-list v-if="complete === true" :users="users"></profile-list>
	</div>
</template>

<script>
import { getMyUserDetails } from "../services/user.script";
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
			complete : false
		}
	},
	methods: {
		setminage(val) {
			this.min_age = val;
		},
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
		getMyUserDetails(this.$cookies.get("user"))
		.then((user) => {
			// this.complete  = user.data.profile_completed 
			this.complete  = true // ! TO BE HANDLED
		}).catch((err) => {
			console.log(err);
		});

		getAllUsers(this.$cookies.get("user")).then(users => {this.users = users.data}).catch(err => {console.log("error fetchin all users %o", err)})
	},

}
</script>

<style scoped>

.dropdown_menu {
	max-height: 200px;
	overflow : auto
}


</style>