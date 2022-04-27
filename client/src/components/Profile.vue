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
								placeholder="Tell us a few words about you"
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
						<div class="col-md-12 pt-4">
							<div class="file" v-if="pictures.length <= 5">
								<form @submit.prevent="onSubmit" enctype="multipart/form-data">
									<div class="fields">
										<label> Upload Pictures </label><br />
											<input id="file-input" type="file" ref="file" @change="onSelect" accept = ".png,.jpg,.jpeg">
											<div class="row">
												<div class="column" v-for="(url, index) in pictures" :key="index">
													<label v-if="index == pictures_to_upload" for="file-input" class = "next">
														<img :src=pictures[index]>
													</label>
													<label v-if="index != pictures_to_upload" class = "empty">
														<img :src=pictures[index]>
													</label>
												</div>
											</div>
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
				
				<!-- <b-container fluid class="p-4 bg-light">  -->
					<!-- v-if='pictures[0] != ""' -->
					<!-- <b-col>
						<b-col v-for="(url, index) in pictures" :key="url">
							<b-img v-if='url != ""' thumbnail fluid-grow :src=url alt="Image 1"></b-img>
							<b-row>
								<b-col lg="4" class="pb-2"><b-button @click="deletePic(index)" size="sm">Delete</b-button></b-col>
								<b-col lg="8" class="pb-2"><b-button @click="profilePic = pictures[index]" size="sm">Make Profile</b-button></b-col>
							</b-row>
						</b-col>
					</b-col> -->
				<!-- </b-container> -->
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
import empty_profile from "../assets/empty_profile.png";
import empty_photo from "../assets/empty2.png";
import plus_photo from "../assets/plus.png";

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
			profilePic: "",
			defaultProfilePic: "",
			pictures: [],
			pictures_to_upload: 0,
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
					console.log("DATA PICTURE::::::");
					console.log(user.data.pictures);
					(this.pictures_to_upload = user.data.pictures.length - 1);
					(this.pictures = new Array(5));
					for (let i = 0; i < 5; i++) {
						if (i < user.data.pictures.length) {
							if (user.data.pictures[i] != "") {
								this.pictures[i] = user.data.pictures[i];
							}
							else if (user.data.pictures[i] == "" && i == user.data.pictures.length - 1) {
								this.pictures[i] = plus_photo;
							}
						}
						else {
							this.pictures[i] = empty_photo;
						}
						console.log("i = " + i)
					}
					console.log("DATA PICTURE::::::");
					console.log(this.pictures);
					if (user.data.profilePic == "") {
						console.log("EMPTY PROFILE");
						(this.profilePic = empty_profile);
					}
					else {
						(this.profilePic = user.data.profilePic);
					}
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
		actual_pictures() {
			var actual_pic = []
			for (let i = 0; i < this.pictures.length; i++) {
				const picture = this.pictures[i];
				if (picture.localeCompare(empty_photo) == 0 || picture.localeCompare(plus_photo) == 0) {
					actual_pic.push("");
					return actual_pic;
				}
				else {
					actual_pic.push(picture);
				}
			}
			console.log("PICTURES AFTER");
			console.log(actual_pic);
			return actual_pic;
		},
		updateProfile() {
			console.log("updating profile with these pictures:");
			console.log(this.pictures);
			const updato = {
				firstName: this.firstName,
				lastName: this.lastName,
				bio: this.bio,
				zipCode: this.zipCode,
				sekesualOri: this.sekesualOri,
				mail: this.mail,
				gender: this.gender,
				pictures: this.actual_pictures(),
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
			this.onSubmit();
		},
		async onSubmit() {
			const formData = new FormData();
			if (this.file == null)
				return
			formData.append("file", this.file);
			try {
				console.log(formData);
				console.log("Sending form data:...")
				axios.post("http://localhost:8080/api/upload", formData)
				.then( (res) => {
					this.pictures[this.pictures_to_upload] = "http://localhost:8080/static/" + res.data.file.filename;
					this.pictures_to_upload += 1;
					if (this.pictures_to_upload < 5) {
						this.pictures[this.pictures_to_upload] = plus_photo;
					}
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

.row {
  display: flex;
  flex-wrap: wrap;
  padding: 0 4px;
}

/* Create four equal columns that sits next to each other */
.column {
  flex: 50%;
  max-width: 50%;
  padding: 0 4px;
}

.column > label > img {
  margin-top: 8px;
  vertical-align: middle;
  background-color: rgb(229, 225, 225);
  width: 100%;
}

.next > img:hover {
	background-color: rgb(240, 236, 236);
	cursor: pointer;
}

input[type = "file"] {
	display: none
}

label > button {
	/* background-image: "../assets/plus.png"; */
	margin-top: 8px;
	vertical-align: middle;
	background-color: rgb(229, 225, 225);
	width: 100%;
}



/* Responsive layout - makes a two column-layout instead of four columns */
@media screen and (max-width: 800px) {
  .column {
    flex: 50%;
    max-width: 50%;
  }
}

/* Responsive layout - makes the two columns stack on top of each other instead of next to each other */
@media screen and (max-width: 600px) {
  .column {
    flex: 100%;
    max-width: 100%;
  }
}

</style>