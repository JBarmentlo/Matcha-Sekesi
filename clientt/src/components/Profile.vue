<template>
	<div class="container rounded bg-white mt-5 mb-5">
		<div class="row">
			<div class="col-md-3 border-right">
				<div class="d-flex flex-column align-items-center text-center p-3 py-5">
					<img
						class="rounded-circle mt-5"
						width="150px"
						src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
					/><span class="font-weight-bold">{{ username }}</span
					><span class="text-black-50">{{ bio }}</span
					><span> </span>
				</div>
			</div>
			<div class="col-md-5 border-right">
				<div class="p-3 py-5">
					<div class="d-flex justify-content-between align-items-center mb-3">
						<h4 class="text-right">Profile Settings</h4>
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
							<label class="labels">Interests</label
							><input
								type="text"
								class="form-control"
								placeholder="enter phone number"
								value=""
							/>
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

				</div>
			</div>
			<div class="col-md-4">
				<div class="p-3 py-5">
					<!-- <div
						class="d-flex justify-content-between align-items-center experience"
					>
						<span>Edit Experience</span
						><span class="border px-3 p-1 add-experience"
							><i class="fa fa-plus"></i>&nbsp;Experience</span
						>
					</div> -->
					<br />
					<div class="col-md-12 pb-2">
						<label class="labels">Sekesual Orientation</label>
						<div>
							<b-dropdown id="dropdown-1" v-bind:text="sekesualOri" class="m-md-2">
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
					<br />
					<div class="col-md-12 pb-2">
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
import { getMyUserDetails, updateUserProfile } from "../services/user.script";
import formValidate from "../services/formValidate"

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
		};
	},

	mounted() {
		console.log("mounterd");
		getMyUserDetails(this.$cookies.get("user"))
			.then((user) => {
				(this.firstName = user.data.firstName ? user.data.firstName : "Not Specified"),
					(this.username = user.data.username ? user.data.username : "Not Specified"),
					(this.lastName = user.data.lastName
						? user.data.lastName
						: "Not Specified"),
					(this.bio = user.data.bio ? user.data.bio : "No Bio"),
					(this.zipCode = user.data.zipCode
						? user.data.zipCode
						: "Not Specified"),
					(this.sekesualOri = user.data.sekesualOri
						? user.data.sekesualOri
						: "Not Specified"),
					(this.mail = user.data.mail ? user.data.mail : "Not Specified"),
					(this.gender = user.data.gender ? user.data.gender : "Not Specified");
			})
			.catch((err) => {
				console.log(err);
			});
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
                firstName   : this.firstName == "Not Specified" ? null : this.firstName,
                lastName    : this.lastName == "Not Specified" ? null : this.lastName,
                bio         : this.bio == "Not Specified" ? null : this.bio,
                zipCode     : this.zipCode == "Not Specified" ? null : this.zipCode,
                sekesualOri : this.sekesualOri == "Not Specified" ? null : this.sekesualOri,
                mail        : this.mail == "Not Specified" ? null : this.mail,
                gender      : this.gender == "Not Specified" ? null : this.gender,
            }
            if (formValidate.validateUpdate(updato))
            {
                updateUserProfile(this.$cookies.get("user"), updato)
            }
        },
	},
};
</script>

<style scoped>
</style>