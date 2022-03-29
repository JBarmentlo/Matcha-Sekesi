<template>
	<div class="container rounded bg-white mt-5 mb-5">
		<div class="row">
			<div class="col-md-3 border-right">
				<div class="d-flex flex-column align-items-center text-center p-3 py-5">
					<img
						class="rounded-circle mt-5"
						width="150px"
						v-bind:src="profilePic"
					/><span class="font-weight-bold">{{ username }}</span
					><span class="text-black-50">{{ bio }}</span
					><span> </span>
				</div>
			</div>
			<div class="col-md-5 border-right">
				<div class="p-3 py-5">
					<div class="d-flex justify-content-between align-items-center mb-3">
						<h4 class="text-right">Profile</h4>
					</div>
					<div class="row mt-2">
						<div class="col-md-6">
							<label class="labels">Name</label
							><text
								type="text"
								v-model="firstName"
								class="form-control"
								placeholder="first name"
								value=""
							/>
						</div>
						
						<div class="col-md-6">
							<label class="labels">Surname</label
							><input
								type="text"
								v-model="lastName"
								class="form-control"
								value=""
								placeholder="surname"
							/>
						</div>
					</div>
					<div class="row mt-3">
						<div class="col-md-12 pb-2">
							<label class="labels">Interests</label>
							<tags-input element-id="tags"
							v-model="selectedTags"
							:existing-tags="existingTags"
							:typeahead="true"></tags-input>
							<input type="text" class="form-control" placeholder="enter interests" value=""/>
						</div>
						<div class="col-md-12 pb-2">
							<label class="labels">Bio</label
							><input
								type="text"
								v-model="bio"
								class="form-control"
								placeholder="enter address line 1"
								value=""
							/>
						</div>
						<div class="col-md-12 pb-2">
							<label class="labels">Mail</label
							><input
								type="text"
								v-model="mail"
								class="form-control"
								placeholder="Email"
								value=""
							/>
						</div>
						<div class="col-md-12 pb-2">
							<label class="labels">ZIP Code</label
							><input
								type="text"
								v-model="zipCode"
								class="form-control"
								placeholder="zip"
								value=""
							/>
						</div>
						<div class="col-md-12 pb-2">
							<label class="labels">Pictures</label
							><input
								type="text"
								class="form-control"
								placeholder="enter email id"
								value=""
							/>
						</div>
					</div>
					<div class="row mt-2">
						<div class="col-md-6">
							<label class="labels">Sekesual Orientation</label>
							<div>
								<b-dropdown
									id="dropdown-1"
									v-bind:text="sekesualOri"
									class="m-md-2"
								>
									<b-dropdown-item @click="setSekesual('Hetero')">
										Hetero
									</b-dropdown-item>
									<b-dropdown-item @click="setSekesual('Gay')">
										Gay
									</b-dropdown-item>
									<b-dropdown-item @click="setSekesual('Bi')">
										Bi
									</b-dropdown-item>
								</b-dropdown>
							</div>
						</div>
						<div class="col-md-6">
							<label class="labels"> Gender </label>
							<div>
								<b-dropdown id="dropdown-1" v-bind:text="gender" class="m-md-2">
									<b-dropdown-item @click="setGender('Male')">
										Male
									</b-dropdown-item>
									<b-dropdown-item @click="setGender('Female')">
										Female
									</b-dropdown-item>
									<b-dropdown-item @click="setGender('NonBinary')">
										NonBinary
									</b-dropdown-item>
								</b-dropdown>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				<b-container fluid class="p-4 bg-light">
					<b-col>
						<b-col v-for="url in pictures" :key="url">
							<b-img thumbnail fluid :src=url alt="Image 1"></b-img>
						</b-col>
					</b-col>
				</b-container>
			</div>
		</div>
	</div>
</template>

<script>
import { getUserDetails, updateUserProfile, getTags} from "../services/user.script";
import formValidate from "../services/formValidate";
import axios from "axios";

export default {
	data() {
		return {
			id				: null,
			username 		: null,
			firstName		: null,
			lastName		: null,
			bio				: null,
			zipCode			: null,
			sekesualOri		: null,
			mail			: null,
			gender			: null,
			message			: null,
			file			: null,
			profilePic		: null ,
			pictures		: [],
			defaultProfilePic: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
			selectedTags: [],
			existingTags: []
		};
	},
	props: {
		userId: "6241c9163ddadaf6dec0654c",
	},

	created() {
		console.log("mounterd");
		console.log("userID: ", this.userId)
		getUserDetails(this.$cookies.get("user"), "6241c9163ddadaf6dec0654c")
			.then((user) => {
				(this.id = user.data._id),
				(this.firstName = user.data.firstName),
				(this.username = user.data.username),
				(this.lastName = user.data.lastName),
				(this.bio = user.data.bio),
				(this.zipCode = user.data.zipCode),
				(this.sekesualOri = user.data.sekesualOri),
				(this.mail = user.data.mail),
				(this.gender = user.data.gender);
				(this.pictures = user.data.pictures);
				(this.profilePic = user.data.profilePic);
				(this.selectedTags = user.data.tags);
			})
			.catch((err) => {
				console.log(err);
			});
	},

	methods: {
	},
};
</script>

<style scoped>
</style>