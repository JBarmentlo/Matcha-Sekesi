<template>
	<div class="container">
		<form @submit.prevent>
			<div class="row filter_categories">
			<div class="col filter_item">
				<label class="filter_title" for="min_age">Min Age:</label>
				<div class = "row sliders">
					<input class="slider" id="min_age" v-model="min_age" type="range" min=18 :max="max_age">
					<div class="age">{{ min_age }}</div>
				</div>
			</div>
			<div class="col filter_item">
				<label class="filter_title" for="max_age">Max Age:</label>
				<div class = "row sliders">
					<input class="slider" id="max_age" v-model="max_age" type="range" :min="min_age" max=69>
					<div class="age">{{ max_age }}</div>
				</div>
			</div>
			<div class="col filter_item">
				<label class="filter_title" for="min_rating">Min Score:</label>
				<input id="min_rating" class = "simple_input" v-model="min_rating" type="number"/>
			</div>
			<div class="col filter_item">
				<label class="filter_title" for="zipcode">Zipcode:</label>
				<input id="zipcode" class = "simple_input" v-model="zipcode" type="text"/>
			</div>
			<div class="col filter_item">
				<label class="filter_title">Required Tags:</label>
				<TagInputHandler v-model="required_tags"/>
			</div>
			<div class="col filter_item">
			<fieldset>
				<label class="filter_title" for="min_rating">Order by:</label>
				<div>
					<input type="radio" id="Popularity" name="order_by" value="popScore" checked v-model="order_by">
					<label for="Popularity">Popularity</label>
				</div>

				<div>
					<input type="radio" id="age" name="order_by" value="age" v-model="order_by">
					<label for="age">Age</label>
				</div>
			</fieldset>
			</div>
			<div class="col filter_item">
			<fieldset>
				<button v-on:click="order_list">
					<b-icon-arrow-up v-if="asc_or_desc == 'ASC'"></b-icon-arrow-up>
					<b-icon-arrow-down v-else></b-icon-arrow-down>
				</button>
			</fieldset>
			</div>
			</div>

		</form>
		<button @click="search">Show results:</button>
		<div class="row">
			<profile-list :users="users" :current_page="current_page"></profile-list>
		</div>
	</div>
</template>

<script>
import { searchUsers } from "../services/search";
import ProfileList from '../shared/ProfileList.vue'
import TagInputHandler from '../shared/TagInputHandler.vue'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'



export default {
	components: { ProfileList, TagInputHandler },
	data() {
		return {
			users        : [],
			min_age      : 18,
			max_age      : 50,
			required_tags: [],
			min_rating   : 0,
			zipcode      : null,
			order_by     : "popScore",
			asc_or_desc  : "DESC",
			offset       : 0,
			limit        : 200,
			current_page : 1,
			user         : this.$cookies.get('user')

		}
	},
	methods: {
		async search() {
			console.log(this.min_age, this.max_age, this.required_tags, this.min_rating, this.zipcode)
			let rese = await searchUsers(this.$cookies.get('sekes_tokens'),this.min_age, this.max_age, this.required_tags, this.min_rating, this.zipcode, this.offset, this.limit, this.order_by, this.asc_or_desc)
			this.users = rese.data.data
			this.current_page = 1
		},

			slideStart () {
		console.log('slideStarted')
		},
		slideStop (value) {
			this.min_age = value
			console.log(value)
		},

		addScoreBlend(user) {
			let score = user.popScore
			if ((user.zipCode != null) && (user.zipCode == this.$cookies.get('user').zipCode)) {
				score += 2
			}
			score += user.tag_list.filter(t => this.$cookies.get('user').tag_list.includes(t)).length
			return {...user, score: score}
		},
		order_list() {
			if (this.asc_or_desc == 'ASC') {
				this.asc_or_desc = "DESC"
			}
			else {
				this.asc_or_desc = "ASC"
			}
		}

	},

	async created() {
		console.log(this.min_age, this.max_age, this.required_tags, this.min_rating, this.zipcode)
		let rese = await searchUsers(this.$cookies.get('sekes_tokens'), this.user.age - 10, this.user.age + 40, this.user.tag_list, 0, null, this.offset, this.limit, this.order_by, this.asc_or_desc)
		this.users = rese.data.data.map(this.addScoreBlend).sort((a,b) => {a.score < b.score})
		this.current_page = 1
	}

}
</script>

<style scoped>


.filter_categories {
	padding: 20px;
	border-radius: 5px;
	background-color : rgba(255, 255, 255, 0.600);
}

.filter_title {
	margin-bottom: 5%;
	padding: 2%;
	border-radius: 20px;
	border: 0.01rem solid rgba(0, 0, 0, 0.600);
	background-color: white
}


.simple_input {
	font-family: 'Roboto', sans-serif;
	color: rgba(0, 0, 0, 0.600);
	border-radius: 0.2rem;
	border: 0.05rem solid rgba(0, 0, 0, 0.205);
	padding: 4%;
	background-color: rgb(255, 255, 255);
	width: 70%;
	display: block;
	transition: all 0.3s;
}

.slider {
	margin-top : 3%;
	left: 6%;
	width : 70%;
}

.age {
	padding-left: 6%
}

</style>