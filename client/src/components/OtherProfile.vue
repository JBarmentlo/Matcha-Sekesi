<template>
	<div class="container" v-if="user != null">
		<div class="row">
			<div class="col-md-auto container_col">
		<div class="card h-100">
			<div class="d-flex flex-column justify-content-center align-items-center">
				<img class="profile_pic" :src="user.profilePic" />
				<span class="name mt-3">
					{{user.firstName}} {{user.lastName}}
					<b-icon-circle-fill v-if="user.connected == 1" id="disponibility" class="connected" font-scale="0.5"></b-icon-circle-fill>
					<b-icon-circle v-else id="disponibility" class="disconnected" font-scale="0.5"></b-icon-circle>
				</span>
				<span class="username">
					<p>aka</p>
					{{user.username}}
				</span>
				<span class="connection_info" v-if="user.connected == 1" target="disponibility" placement="right">connected</span>
				<span class="connection_info" v-else target="disponibility" placement="right">Last connected: {{ last_connected }}</span>
				<span class="email mt-3"><b-icon-mailbox />  {{user.mail}}</span>
				<div class="buttons">
				<div class="row justify-content-md-center">
					<div class="col-md-auto">
						<b-button v-if="user.did_i_like_him == 0" @click="like(user.username)" variant="outline-info" class="mb-2">
							<b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon> Like
						</b-button>
						<b-button v-else @click="unlike(user.username)" id="unlike" variant="info" class="mb-2">
							<b-icon icon="hand-thumbs-up-fill" aria-hidden="true"></b-icon> Liked
							<b-tooltip target="unlike" placement="top" triggers="hover">Unlike</b-tooltip>
						</b-button>
					</div>
					<div class="col-md-auto">
						<b-button v-if="user.did_i_block_him == 0" @click="block(user.username)" variant="outline-secondary" class="mb-2">
							<b-icon icon="x-circle" aria-hidden="true"></b-icon> Block
						</b-button>
						<b-button v-else @click="unblock(user.username)" id="unblock" variant="danger" class="mb-2">
							<b-icon icon="x-circle-fill" aria-hidden="true"></b-icon> Blocked
							<b-tooltip target="unblock" placement="top" triggers="hover">Unblock</b-tooltip>
						</b-button>
					</div>
					<div class="col-md-auto">
						<b-button v-if="reported == false" variant="outline-warning" @click="report(user.username)">
							<b-icon icon="exclamation-triangle"></b-icon> Report
						</b-button>
						<b-button v-else disabled>
							<b-icon icon="exclamation-triangle-fill"></b-icon> Reported
						</b-button>
					</div>
				</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-md-6 container_col">
		<div class="card h-100">
			<div class="d-flex flex-column justify-content-center align-items-center">
			<div class="carroussel">
				Carroussel to be added:
				<img src="https://shorturl.at/fpTW9"/>
			</div>
			<span class="popularity"><span class="score">{{ popScore }}</span><span class="ratiote">/5</span> Popularity</span>
			<span class="zipcode"><b-icon icon="pin-map-fill"></b-icon><span class="zip"> {{ user.zipCode }}</span></span>
			<TagInputHandler v-model="user.tag_list" :disabled="true" />
			<div class="about" v-if="user.bio && user.bio.length != 0">
				<p class="bio text mt-5">"{{user.bio}}"</p>
			</div>
		</div>
		</div>
	</div>
	</div>
	</div>
	<!-- <div v-if="user != null" class="container">
		<div class="row gutters">
			<div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
				<div class="card h-100">
					<div class="card-body d-flex flex-column">
						<div class="account-settings">
							<div class="user-profile">
								<div class="user-avatar">
									<img :src="user.profilePic" />
								</div>

								<h5 class="user-name">{{ user.username }}</h5>
								<h6 class="user-email">{{ user.mail }}</h6>
							</div>
							<div class="popularity">
								Popularity score: {{ user.popScore }}
							</div>
							<div v-if="user.connected == 1">Connected</div>
							<div v-else>Last connected {{ user.last_connected }}</div>
							<div v-if="user.bio && user.bio.length != 0" class="about">
								<h5>About</h5>
								<p>{{ user.bio }}</p>
							</div>
						</div>
						<ProfileImageCarousel :images="user_images" :disabled="true" />
                        <button v-if="user.did_i_like_him == 0" class="btn btn-xs fs-10 btn-bold btn-primary" @click="like(user.username)" data-toggle="modal" data-target="#modal-contact">Like</button>
                        <button v-else class="btn btn-xs fs-10 btn-bold btn-primary" @click="unlike(user.username)" data-toggle="modal" data-target="#modal-contact">Unlike</button>
                        <button v-if="user.did_i_block_him == 0" class="btn btn-xs fs-10 btn-bold btn-warning" @click="block(user.username)">Block</button>
                        <button v-else class="btn btn-xs fs-10 btn-bold btn-warning" @click="unblock(user.username)">Unblock</button>
												<button class="btn btn-xs fs-10 btn-bold btn-warning" @click="report(user.username)">Report</button>
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
										disabled
										type="text"
										v-model="user.firstName"
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
										disabled
										type="text"
										v-model="user.lastName"
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
										disabled
										type="text"
										v-model="user.mail"
										class="form-control"
										placeholder="Enter email adress"
										value=""
									/>
								</div>
							</div>
							<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
								<label class="labels">ZIP Code</label>
								<input
									disabled
									type="text"
									v-model="user.zipCode"
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
								<TagInputHandler v-model="user.tag_list" :disabled="true" />
							</div>
							<div class="col">
								<label class="labels">Sekesual Orientation</label>
								<div>
									<b-dropdown
										disabled
										class="dropdown-1"
										v-bind:text="user.sekesualOri"
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
									<b-dropdown
										class="dropdown-2"
										v-bind:text="user.gender"
										disabled
									>
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
									v-model="user.bio"
									class="form-control"
									placeholder="Tell us a few words about you"
									value=""
									maxlength="255"
									rows="6"
									disabled
								/>
							</div>
							<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-3">
								<label class="labels">Date of Birth</label>
								<b-datepicker disabled v-bind:value="user.DOB" />
							</div>
						</div>
						<div class="row gutters"></div>
					</div>
				</div>
			</div>
		</div>
	</div> -->
</template>

<script>
import { likeUser, unlikeUser } from "../services/user";
import { blockUser, unblockUser, reportUser } from "../services/user";
import { getUserProfile } from "../services/user";

// import ProfileImageCarousel from "../shared/ProfileImageCarousel.vue";
import TagInputHandler from "../shared/TagInputHandler.vue";

export default {
	components: {
		// ProfileImageCarousel,
		TagInputHandler,
	},

	props: {
		userName: String,
	},

	data() {
		return {
			user: null,
			reported: false,
		};
	},

	computed: {
		accessTokens: function () {
			if (this.$cookies.isKey("sekes_tokens")) {
				return this.$cookies.get("sekes_tokens");
			} else {
				return null;
			}
		},

		user_images: function () {
			return [
				this.user.image0,
				this.user.image1,
				this.user.image2,
				this.user.image3,
			];
		},

		profile_pic: function () {
			if (this.user.profilePic != null) {
				return this.user.profilePic;
			}
			return require("../assets/empty_profile.png");
		},

		popScore: function() {
			return (Math.round(this.user.popScore * 100) / 100)
		},

		last_connected: function() {
			const date = new Date(this.user.last_connected)
			const options = {
			day: '2-digit',
			month: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
			}
			return (new Intl.DateTimeFormat('en-US', options).format(date))
		}
	},

	methods: {
		like(username) {
			likeUser(this.$cookies.get('sekes_tokens'), username)
			this.user.did_i_like_him = 1
		},

		unlike(username) {
			unlikeUser(this.$cookies.get('sekes_tokens'), username)
			this.user.did_i_like_him = 0
		},

		block(username) {
			blockUser(this.$cookies.get('sekes_tokens'), username)
			this.user.did_i_block_him = 1
		},

		unblock(username) {
			unblockUser(this.$cookies.get('sekes_tokens'), username)
			this.user.did_i_block_him = 0
		},

		report(username) {
			reportUser(this.$cookies.get('sekes_tokens'), username)
			this.reported = true
		},

	},

	async mounted() {
		let res = await getUserProfile(
			this.$cookies.get("sekes_tokens"),
			this.userName
		);
		console.log(res);
		this.user = res.data.data;
	},

	async beforeRouteUpdate(to, from, next) {
    // Call the API query method when the URL changes
		let res = await getUserProfile(
			this.$cookies.get("sekes_tokens"),
			to.params.userName
		);
		this.user = res.data.data
    next()
  }
};
</script>

<style scoped>

.container {
	max-width: 90%;
}

.container_col {
	display: flex;
}

.card {
	padding: 20px;
	padding-bottom: 0px;
}


.buttons {
	margin-top: 100px;
	margin-bottom: 0px;
}

.profile_pic {
	width        : 300px;
	height       : 300px;
	object-fit   : cover;
	border-radius: 50%;
}

.username, .name {
	font-size  : 30px;
	color      : black;
	font-weight: bold;
	text-align : center;
}

.username {
	font-size: 25px;
}

.username > p {
	font-size: initial;
	font-weight: initial;
	margin-bottom: 0rem;
}

.popularity, .zipcode {
	margin-top : 20px;
	font-size  : 25px;
	color      : black
}

.zipcode {
	margin-top: 0px;
	margin-bottom: 20px;
}

.score, .zip {
	font-weight: bold;
	font-size  : 30px;
}

.ratiote {
	font-size  : 15px;
}
.carroussel {
	max-width: 100%;
}

.carroussel > img {
	max-width : 100%;
	object-fit: cover;
}

.bio {
	text-align : center;
}

.connected {
	color : rgb(11, 212, 11);
}

.disconnected {
	color : black;
}

.connection_info {
	color: rgb(98, 98, 98);
	text-align: center;
	max-width: 40%;
}

</style>