<template>
	<div class="container rounded bg-white mt-5 mb-5">
		<div class="center p-5">
			<span class="font-weight-bold">{{ username }}</span>
		</div>
    <b-carousel 
      id="carousel-1"
      v-model="slide"
      :interval="0"
      controls
      indicators
      background="#ababab"
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333;"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
		<!-- <b-carousel-slide v-for="url in pictures" :key="url" v-bind:img-src="url"> -->
		<b-carousel-slide v-for="url in pictures" :key="url">
		<template v-slot:img>
			<img
			class="d-block class-name center-block"
			height="480"
			:src="url"
			alt="image slot">
		</template>
		</b-carousel-slide>

    </b-carousel>

	<div class="center p-5">
			<span class="font-weight-bold">{{ firstName }} {{ lastName }}</span>
	</div>

		<div class="center">
			<span class="font-italic">"{{ bio }}"</span>
	</div>
	<div class = "row m-5">
		<div class="col ml-5">
				<span >I come from {{ zipCode }}</span>
		</div>
		<div class="col ml-5">
				<span >I identify as a {{ gender }}</span>
		</div>
	</div>
	<div class="col-md-12 pb-2">
		<label class="labels">My Interests</label>
		<tags-input element-id="tags"
		v-model="selectedTags"
		:existing-tags="existingTags"
		:typeahead="true"
		:disabled="true"></tags-input>
		</div>

	<div class="mt-3 text-center center pb-4 border-0">
	<b-icon @click="like()" v-if="!isLiked" icon="heart-fill" font-scale="2" class="m-2" type="button" data-toggle="tooltip" data-placement="top" title="Unlike"></b-icon>
	<b-icon @click="unlike()" v-if="isLiked" icon="heart" font-scale="2" class="m-2" type="button" data-toggle="tooltip" data-placement="top" title="Like"></b-icon>
	<!-- <button @click="unlike()" v-if="isLiked" class="btn btn-primary profile-button m-2" type="button"> UnLike </button> -->
	<b-icon @click="block()" icon="exclamation-circle" font-scale="2" class="m-2" type="button" data-toggle="tooltip" data-placement="top" title="Block"></b-icon>
	<b-icon icon="bell-fill" font-scale="2" class="m-2" type="button" data-toggle="tooltip" data-placement="top" title="Report"></b-icon>
	</div>
  </div>
</template>

<script>
import { getUserDetails, consultUser} from "../services/user.script";
import { isLikedByMe, likeUser, unlikeUser} from "../services/like.script";
import { blockUser } from "../services/block.script";
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
			city			: null,
			zipCode			: null,
			sekesualOri		: null,
			mail			: null,
			gender			: null,
			profilePic		: null ,
			pictures		: [],
			defaultProfilePic: "",
			selectedTags: [],
			existingTags: [],
			isLiked			: false,
			 slide: 0,
        	sliding: null,
			interval: 0
		};
	},
	props: {
		userId: String,
	},

	created() {
		console.log("mounterd");
		console.log("userID: ", this.userId)
		consultUser(this.$cookies.get("user"), this.userId)
		getUserDetails(this.$cookies.get("user"), this.userId)
			.then((user) => {
				(this.id = user.data._id),
				(this.firstName = user.data.firstName),
				(this.username = user.data.username),
				(this.lastName = user.data.lastName),
				(this.bio = user.data.bio),
				(this.city = user.data.city),
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
		isLikedByMe(this.$cookies.get("user"), this.userId)
		.then(likery => {
			this.isLiked = likery.data
			console.log("is liked", likery.data)
		})
	},

	methods: {
		like() {
			this.isLiked = true
			likeUser(this.$cookies.get("user"), this.userId)
			.catch(err => {console.log("err wjile liking %o", err)})
		},
		unlike() {
			unlikeUser(this.$cookies.get("user"), this.userId)
			this.isLiked = false		
		},
		block() {
			blockUser(this.$cookies.get("user"), this.userId)
		},
		onSlideStart(slide) {
        this.sliding = true
      },
      onSlideEnd(slide) {
        this.sliding = false
      }
	},
};
</script>

<style scoped>
</style>