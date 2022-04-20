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
							><input
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
							<label class="labels">Password</label
							><input
								type="password"
								v-model="password"
								class="form-control"
								placeholder="Password"
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
						<div class="col-md-6 pt-4">
							<div class="file" v-if="pictures.length <= 4">
								<form @submit.prevent="onSubmit" enctype="multipart/form-data">
									<div class="fields">
										<label> Upload Pictures </label><br />
										<input type="file" ref="file" @change="onSelect" />
									</div>
									<div v-if="file != null" class="fields">
										<button class="btn btn-primary profile-button">Upload</button>
									</div>
									<div class="message">
										{{ message }}
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				<b-container fluid class="p-4 bg-light">
					<b-col>
						<b-col v-for="(url, index) in pictures" :key="url">
							<b-img thumbnail fluid-grow :src=url alt="Image 1"></b-img>
							<b-row>
								<b-col lg="4" class="pb-2"><b-button @click="deletePic(index)" size="sm">Delete</b-button></b-col>
								<b-col lg="8" class="pb-2"><b-button @click="profilePic = pictures[index]" size="sm">Make Profile</b-button></b-col>
							</b-row>
						</b-col>
					</b-col>
				</b-container>
			</div>
			<div class="mt-3 text-center center pb-4 border-0">
				<button
					@click="updateProfile"
					class="btn btn-primary profile-button"
					type="button"
				>
					Save Profile
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { getMyUserDetails, updateUserProfile, getTags} from "../services/user.script";
import formValidate from "../services/formValidate";
import axios from "axios";

export default {
	data() {
		return {
			username: "Not Specified",
			firstName: "Not Specified",
			lastName: "Not Specified",
			password: "",
			bio: "Not Specified",
			zipCode: "Not Specified",
			sekesualOri: "Not Specified",
			mail: "Not Specified",
			gender: "Not Specified",
			message: null,
			file: null,
			profilePic: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
			defaultProfilePic: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
			pictures: [],
			selectedTags: [],
			existingTags: []
		};
	},

	mounted() {
		console.log("mounterd");
		getMyUserDetails(this.$cookies.get("user"))
			.then((user) => {
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

		getTags(this.$cookies.get("user"))
		.then(tags => {
			this.existingTags = tags.data
			console.log("tagis found: ",  this.existingTags)
		})
	},

	methods: {
		setGender(val) {
			this.gender = val;
			console.log("gender %s", this.gender);
		},
		setSekesual(val) {
			this.sekesualOri = val;
			console.log("sekesualOri %s", this.sekesualOri);
		},
		updateProfile() {
			const updato = {
				firstName: this.firstName,
				lastName: this.lastName,
				bio: this.bio,
				zipCode: this.zipCode,
				sekesualOri: this.sekesualOri,
				mail: this.mail,
				gender: this.gender,
				pictures: this.pictures,
				profilePic: this.profilePic,
				selectedTags : this.selectedTags
			};
			if (formValidate.validateUpdate(updato)) {
				updateUserProfile(this.$cookies.get("user"), updato);
			}
		},
		onSelect() {
			const file = this.$refs.file.files[0];
			this.file = file;
		},
		async onSubmit() {
			const formData = new FormData();
			if (this.file == null)
				return
			formData.append("file", this.file);
			try {
				console.log(formData);
				axios.post("http://localhost:8080/api/upload", formData)
				.then( (res) => {
					this.pictures.push("http://localhost:8080/static/" + res.data.file.filename)
				})
				this.message = "Uploaded";
			} catch (err) {
				console.log(err);
				this.message = "Something Went wrong";
			}
			this.file = null
		},
		deletePic(index)
		{
			if (this.profilePic == this.pictures[index])
				this.profilePic = this.defaultProfilePic
			this.pictures.splice(index, 1)
		}
	},
};
</script>

<style scoped>
</style>