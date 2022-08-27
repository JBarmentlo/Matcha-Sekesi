<template>
	<div class="container">
	<div class="row gutters">
	<div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
	<div class="card h-100">
		<div class="card-body d-flex flex-column">
			<div class="account-settings">
				<div class="user-profile">
					<div class="user-avatar">
						<img :src="profilePic" :alt="current_user.username">
					</div>
					<h5 class="user-name">{{ current_user.username }}</h5>
					<h6 class="user-email">{{ current_user.mail }}</h6>
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
				<div v-if="current_user.bio && current_user.bio.length != 0" class="about">
					<h5>About</h5>
					<p>{{ current_user.bio }}</p>
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
							v-model="current_user.firstName"
							class="form-control"
							placeholder="Enter first name"
							value=""
						/>
					</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
					<div class="form-group">
						<label class="labels">Last Name</label>
						<input
							type="text"
							v-model="current_user.lastName"
							class="form-control"
							value=""
							placeholder="Enter last name"
						/>
					</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
					<div class="form-group">
						<label class="labels">Email</label>
						<input
							type="text"
							v-model="current_user.mail"
							class="form-control"
							placeholder="Enter email adress"
							value=""
						/>
					</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
					<div class="form-group">
						<label class="labels">Password</label>
						<input
							type="password"
							v-model="password"
							class="form-control"
							placeholder="Password"
							value=""
						/>
					</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
					<label class="labels">ZIP Code</label>
					<input
						type="text"
						v-model="current_user.zipCode"
						class="form-control"
						placeholder="zip"
						value=""
					/>
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
							v-bind:text="current_user.sekesualOri"
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
						<b-dropdown class="dropdown-2" v-bind:text="current_user.gender">
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
				<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-3">
					<label class="labels">Bio</label>
					<textarea
						type="text"
						v-model="current_user.bio"
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
							<div class="fields">
								<label> Upload Pictures </label><br />
									<input id="file-input" type="file" ref="file" @change="onSelect" accept = ".png,.jpg,.jpeg">
									<div class="row">
										<div class="column" v-for="(url, index) in pictures" :key="index">
											<label v-if="index < pictures_to_upload" class = "full">
												<img :src=pictures[index] @mouseover="show_delete = true" @mouseleave="show_delete = false">
												<b-col lg="4"><button class = "img-overlay btn btn-warning px-3" @click="deletePic(index)" size="sm" ><i class="fa fa-trash"></i></button></b-col>
												<b-col lg="12"><button type="button" class="img-overlay btn btn-outline-default waves-effect" @click="profilePic = pictures[index]"><i class="fa fa-star pr-2" aria-hidden="true"></i>Make Profile</button></b-col>
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
							<div class="message">
								{{ message }}
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

export default {
	data() {
		return {
			password          : '',
			current_user      : this.$cookies.get('user').user,
			message           : null,
			file              : null,
			profilePic        : "",
			defaultProfilePic : "",
			pictures          : [],
			pictures_to_upload: 0,
			selectedTags      : [],
			existingTags      : [],
			likes             : -1,
			likes_of_me       : [],
			consults          : -1,
			consults_of_me    : [],
			show_delete       : false,
		};
	},

	computed: {
		user: function() {
			if (this.$cookies.isKey('user')) {
				return this.$cookies.get('user').user
			}
			else {
				return null
			}
		},

		accessTokens: function() {
			if (this.$cookies.isKey('user')) {
				return this.$cookies.get('user')
			}
			else {
				return null
			}
		}
	},

	methods: {
		updateProfile() {
			return
		},

		onSelect() {

		},

		setGender(val) {
			this.current_user.gender = val;
			console.log("gender %s", this.current_user.gender);
		},

		setSekesual(val) {
			this.current_user.sekesualOri = val;
			console.log("sekesualOri %s", this.current_user.sekesualOri);
		},
	},

	mounted() {
		console.log("Yooser", this.$cookies.get('user'))
		console.log(this.user)

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
    width: 90px;
    height: 90px;
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
    border-radius: 100px;
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


</style>