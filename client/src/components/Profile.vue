<template>
	<div class="container">
	<div class="row gutters">
	<div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
	<div class="card h-100">
		<div class="card-body d-flex flex-column">
			<div class="account-settings">
				<div class="user-profile">
					<div class="user-avatar">
						<img :src="profilePic" :alt="username">
					</div>
					<h5 class="user-name">{{ username }}</h5>
					<h6 class="user-email">{{ mail }}</h6>
				</div>
				<div class = "popularity">
					<div class = "d-flex justify-content-center align-items-center text-center">
						<div class = "views p-3">
							<i class="fa fa-eye fa-lm"></i>  {{ consults }}
						</div>
						<div class = "likes p-3">
							<i class="fa fa-thumbs-up fa-lm"></i>  {{ likes }}
						</div>
					</div>
				</div>
				<div v-if="bio.length != 0" class="about">
					<h5>About</h5>
					<p>{{ bio }}</p>
				</div>
			</div>
			
		</div>
	</div>
	</div>
	<div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
	<div class="card h-100">
		<div class="card-body">
			<div class="row gutters pt-2">
				<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
					<h6 class="mb-2 text-primary">Account Details</h6>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
					<div class="form-group">
						<label class="labels">Name</label>
						<input
							type="text"
							v-model="firstName"
							class="form-control"
							placeholder="Enter first name"
							value=""
						/>
						<div v-if="firstName == '' && validation == false" class="validation_error">Please Enter a Name</div>
					</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
					<div class="form-group">
						<label class="labels">Last Name</label>
						<input
							type="text"
							v-model="lastName"
							class="form-control"
							value=""
							placeholder="Enter last name"
						/>
						<div v-if="lastName == '' && validation == false" class="validation_error">Please Enter a Last Name</div>
					</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
					<div class="form-group">
						<label class="labels">Email</label>
						<input
							type="text"
							v-model="mail"
							class="form-control"
							placeholder="Enter email adress"
							value=""
						/>
						<div v-if="mail == '' && validation == false" class="validation_error">Please Enter an email</div>
					</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
					<div class="form-group">
						<router-link class = "btn btn-dark btn-md btn-block" to="/forgot-password">Reset my password
						</router-link>
					</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
					<label class="labels">ZIP Code</label>
					<input
						type="text"
						v-model="zipCode"
						class="form-control"
						placeholder="zip"
						value=""
					/>
					<div v-if="zipCode == null && validation == false" class="validation_error">Please Enter a ZipCode</div>
				</div>
			</div>
			<div class="row gutters pt-5">
				<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
					<h6 class="mt-3 mb-2 text-primary">Personal details</h6>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
					<label class="labels">Interests</label>
					<tags-input element-id="tags"
					v-model="selectedTags"
					:existing-tags="existingTags"
					:typeahead="true"></tags-input>
				</div>
				<div class="col">
					<label class="labels">Sekesual Orientation</label>
					<div>
						<b-dropdown
							class="dropdown-1"
							v-bind:text="sekesualOri"
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
				<div class="col">
					<label class="labels"> Gender </label>
					<div>
						<b-dropdown class="dropdown-2" v-bind:text="gender">
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
						<div v-if="gender == null && validation == false" class="validation_error">Please select a gender</div>

					</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-3">
					<label class="labels">Bio</label>
					<textarea
						type="text"
						v-model="bio"
						class="form-control"
						placeholder="Tell us a few words about you"
						value=""
						maxlength="255"
						rows="6"
					/>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
				</div>
				<div class="col">
					<div class="file" v-if="pictures.length <= 5">
						<form @submit.prevent="onSubmit" enctype="multipart/form-data">
							<div class="fields mt-4">
								<label > Pictures </label><br />
									<input id="file-input" type="file" ref="file" @change="onSelect" accept = ".png,.jpg,.jpeg">
									<div class="row">
										<div class="column" v-for="(url, index) in pictures" :key="index">
											<label v-if="index < pictures_to_upload" class = "full">
												<img :src=url width="260" height='220'>
												<b-icon @click="deletePic(index)" icon="trash" font-scale="1" class="m-2" type="button" data-toggle="tooltip" data-placement="top" title="Delete picture"></b-icon>
												<b-icon v-if="profilePic == url" icon="star-fill" font-scale="1" class="m-2" ></b-icon>
												<b-icon @click="profilePic = pictures[index]" v-if="profilePic != url" icon="star" font-scale="1" class="m-2" type="button" data-toggle="tooltip" data-placement="top" title="Make Profile"></b-icon>
											</label>
											<label v-if="index == pictures_to_upload" for="file-input" class = "next">
												<img :src=pictures[index]>
											</label>
											<label v-if="index > pictures_to_upload" class = "empty">
												<img :src=pictures[index]>
											</label>
										</div>
									</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div class="row gutters">
				<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
					<div class="text-right">
						<button type="button" id="submit" name="submit" class="btn btn-secondary btn-rounded m-2">Cancel</button>
						<button type="button" id="submit" name="submit" class="btn btn-primary btn-rounded m-2" @click="updateProfile">Update</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	</div>
	</div>
	</div>
</template>

<script>
import { getMyUserDetails, updateUserProfile, getTags, getConsultsOfMe} from "../services/user.script";
import { likesOfMe } from "../services/like.script";
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
			profilePic: empty_profile,
			defaultProfilePic: empty_profile,
			pictures: [],
			pictures_to_upload: 0,
			selectedTags: [],
			existingTags: [],
			likes: -1,
			likes_of_me: [],
			consults: -1,
			consults_of_me: [],
			show_delete: false,
			profile_completed : false,
			validation : true
		};
	},

	mounted() {
		console.log("mounted my profile");
		getMyUserDetails(this.$cookies.get("user"))
			.then((user) => {
				(this.firstName 		= user.data.firstName),
					(this.username 		= user.data.username),
					(this.lastName 		= user.data.lastName),
					(this.bio 			= user.data.bio),
					(this.zipCode 		= user.data.zipCode),
					(this.sekesualOri 	= user.data.sekesualOri),
					(this.mail 			= user.data.mail),
					(this.gender 		= user.data.gender);
					(this.selectedTags	= user.data.tags);

					(this.pictures_to_upload = user.data.pictures.length > 0 ? user.data.pictures.length : 0);
					(console.log("ZIP CODO:"));
					(console.log(this.zipCode));
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
							if (user.data.pictures.length == 0 && i == 0) {
								this.pictures[i] = plus_photo;
							}
						}
						console.log("i = " + i)
					}

					if (user.data.profilePic == undefined) {
						(this.profilePic = empty_profile);
					}
					else {
						(this.profilePic = user.profilePic);
					}
			})
			.catch((err) => {
				console.log(err);
			});


		likesOfMe(this.$cookies.get("user"))
			.then((likes_of_me) => {
				console.log("Getting likes of me: " + likes_of_me.data)
				this.likes_of_me = likes_of_me.data
				this.likes = likes_of_me.data.length
			})
			.catch((err) => {
				console.log(err);
			});


		getConsultsOfMe(this.$cookies.get("user"))
			.then((consults_of_me) => {
				console.log("Getting consults of me: " + consults_of_me.data)
				this.consults_of_me = consults_of_me.data
				this.consults = consults_of_me.data.length
			})
			.catch((err) => {
				console.log(err);
			});


		getTags(this.$cookies.get("user"))
		.then(tags => {
			this.existingTags = tags.data
			console.log("tags found: ",  this.existingTags)
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
				// profilePic: this.profilePic,
				selectedTags : this.selectedTags
			};
			if (formValidate.validateUpdate(updato)) {
				updateUserProfile(this.$cookies.get("user"), updato);
			}
			if (!this.profile_completed) {
				this.validation = false
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
			console.log("HEYYYYYYYYY")
			if (this.profile_completed= false) {
				this.validation = false
			}
		},
		deletePic(index)
		{
			if (this.profilePic == this.pictures[index])
				this.profilePic = this.defaultProfilePic
			this.pictures_to_upload -= 1;
			for (let i = index; i < 5; i++) {
				if (i < this.pictures_to_upload) {
					this.pictures[i] = this.pictures[i + 1];
				}
				else if (i == this.pictures_to_upload) {
					this.pictures[i] = plus_photo
				}
				else if (i > this.pictures_to_upload) {
					this.pictures[i] = empty_photo
				}
			}
			
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
  flex: 33%;
  max-width: 33%;
  padding: 0 4px;
}

.column > label > img {
  margin-top: 8px;
  vertical-align: middle;
  background-color: rgb(229, 225, 225);
  width: 100%;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.next > img:hover {
	background-color: rgb(240, 236, 236);
	cursor: pointer;
}

input[type = "file"] {
	display: none
}

.img-overlay {
  position: absolute;
  top: 7%;
  bottom: 0;
  left: 12%;
  right: 0;
  text-align: center;
}


/* Responsive layout - makes a three column-layout instead of four columns */
@media screen and (max-width: 800px) {
  .column {
    flex: 33%;
    max-width: 33%;
  }
}

/* Responsive layout - makes the three columns stack on top of each other instead of next to each other */
@media screen and (max-width: 600px) {
  .column {
    flex: 100%;
    max-width: 100%;
  }
}

.popularity {
	/* background-color:rgba(11, 244, 189, 0.568); */
	color: rgb(56, 56, 56);
}

body {
    margin: 0;
    padding-top: 40px;
    color: #2e323c;
    background: #f5f6fa;
    position: relative;
    height: 100%;
}
.account-settings .user-profile {
    margin: 0 0 1rem 0;
    padding-bottom: 1rem;
    text-align: center;
}
.account-settings .user-profile .user-avatar {
    margin: 0 0 1rem 0;
}
.account-settings .user-profile .user-avatar img {
    width: 160px;
    height: 160px;
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
    border-radius: 100px;
	  object-fit: cover;
}
.account-settings .user-profile h5.user-name {
    margin: 0 0 0.5rem 0;
}
.account-settings .user-profile h6.user-email {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 400;
    color: #9fa8b9;
}
.account-settings .about {
    margin: 2rem 0 0 0;
    text-align: center;
}
.account-settings .about h5 {
    margin: 0 0 15px 0;
    color: #007ae1;
}
.account-settings .about p {
    font-size: 0.825rem;
}
.form-control {
    border: 1px solid #cfd1d8;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    font-size: .825rem;
    background: #ffffff;
    color: #2e323c;
}

.card {
    background: #ffffff;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    border: 0;
    margin-bottom: 1rem;
}

.container {
	margin-top: 5%;
}

.validation_error {
	color : red;
	font-size: 80%;
	margin-left: 5px;
}

.card-body {
	background: rgba(255, 255, 255, 0.8);
	box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
	border-radius: 10px;
}

.card {
	background: none;
}


</style>