<template>
	<div class="container">
		<form @submit.prevent>
			<div class="row justify-content-md-center filter_categories">
			<div class="col filter_item">
				<label class="filter_title" for="age">Age:</label>
				<div class = "row sliders">
					<Slider
					class="green_slider"
					v-model="age"
					:min="18"
					:max="99"
					/>
				</div>
			</div>
			<div class="col filter_item">
				<label class="filter_title" for="rating">Score:</label>
				<Slider
					class="green_slider"
					v-model="rating"
					:min="0"
					:max="5"
					/>
			</div>
			<div class="col filter_item">
				<label class="filter_title" for="zipcode">Zipcode:</label>
				<ValidationProvider ref="zipcode_valid" rules="zipcode|zipcodeNum" immediate v-slot="{ errors }">
					<input id="zipcode" class = "simple_input" v-model="zipcode" type="text"/>
					<span class="login_error">{{ errors[0] }}</span>
				</ValidationProvider>
			</div>
			<div class="col filter_item">
				<label class="filter_title">Required Tags:</label>
				<TagInputHandler v-model="required_tags" :only_existing_tags="true"/>
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
				<div>
					<input type="radio" id="zip" name="order_by" value="zipCode" v-model="order_by">
					<label for="zip">Zipcode</label>
				</div>
				<div>
					<input type="radio" id="tags" name="order_by" value="tag_list" v-model="order_by">
					<label for="tags">Tags</label>
				</div>
			</fieldset>
			</div>
			<div class="col-md-auto filter_item">
			<b-button-group>
				<b-button v-on:click="order_list">
					<b-icon-arrow-up v-if="asc_or_desc == 'ASC'"></b-icon-arrow-up>
					<b-icon-arrow-down v-else></b-icon-arrow-down>
				</b-button>
				<b-button @click="search">Show results:</b-button>
			</b-button-group>
			</div>
			</div>
		</form>
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
import Slider from '@vueform/slider/dist/slider.vue2.js'
import { ValidationProvider } from 'vee-validate';


export default {
	components: { ProfileList, TagInputHandler, Slider, ValidationProvider},
	data() {
		return {
			users        : [],
			age			 : [25, 40],
			required_tags: [],
			rating		 : [0, 5],
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
			if (this.$refs.zipcode_valid.flags.invalid) {
				return
			}
			console.log(this.age, this.required_tags, this.rating, this.zipcode)
			let desires = this.allCompatible({gender: this.user.gender, sekesualOri: this.user.sekesualOri})
			// let desire = this.determineAppropriateSekes(this.user.gender, this.user.sekesualOri)
			console.log("DESIIIIRE: ", desires)
			this.zipcode = this.zipcode == "" ? null : this.zipcode
			let rese = await searchUsers(this.$cookies.get('sekes_tokens'),this.age[0], this.age[1], this.required_tags, this.rating[0], this.rating[1], this.zipcode, this.offset, this.limit, this.order_by, this.asc_or_desc, desires)
			this.users = rese.data.data
			this.current_page = 1
		},

		compatible(one, two) {
			if (one.gender == two.gender) {
				return (["Gay", "Bi"].includes(one.sekesualOri) && ["Gay", "Bi"].includes(two.sekesualOri))
			}
			else {
				return (["Hetero", "Bi"].includes(one.sekesualOri) && ["Hetero", "Bi"].includes(two.sekesualOri))
			}
		},

		allCompatible(one) {
			let genders = ["Male", "Female", "NonBinary"]
			let sekesuals = ["Hetero", "Bi", "Gay"]
			let pairs = []
			for (const g of genders) {
				for (const s of sekesuals) {
					// console.log(one.gender, one.sekesualOri)
					// console.log(g, s)
					// console.log(this.compatible(one, {gender: g, sekesualOri: s}))
					// console.log("----")
					if (this.compatible(one, {gender: g, sekesualOri: s})) {
						pairs.push({gender: g, sekesualOri: s})
					}
				}
			}
			return pairs
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
			this.search()
		}

	},

	async created() {
		let desires = this.allCompatible({gender: this.user.gender, sekesualOri: this.user.sekesualOri})
		console.log("DESIIIIRE: ", desires)
		let rese = await searchUsers(this.$cookies.get('sekes_tokens'), this.user.age - 10, this.user.age + 40, this.user.tag_list, 0, 5, null, this.offset, this.limit, this.order_by, this.asc_or_desc, desires)
		this.users = rese.data.data.map(this.addScoreBlend).sort((a,b) => {a.score < b.score})
		this.current_page = 1
	}

}
</script>

<style src="@vueform/slider/themes/default.css"></style>

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

.green_slider {
	margin-top: 30px;
	--slider-tooltip-font-size: 0.775rem;
	--slider-tooltip-line-height: 0.9rem;
}

</style>