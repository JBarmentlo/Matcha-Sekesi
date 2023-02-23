<template>
    <div class="container">
        <div v-if="suggestion == true">
            <h1 class="title text-center">Our suggestions:</h1>
            <button @click="change_view">Make my own research</button>
        </div>
        <div v-else>
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
                    <input type="radio" id="Popularity" name="order_by" value="pop_score" checked v-model="order_by">
                    <label for="Popularity">Popularity</label>
                </div>
                <div>
                    <input type="radio" id="age" name="order_by" value="age" v-model="order_by">
                    <label for="age">Age</label>
                </div>
                <div>
                    <input type="radio" id="zip" name="order_by" value="distance" v-model="order_by">
                    <label for="zip">Zipcode</label>
                </div>
                <div>
                    <input type="radio" id="tags" name="order_by" value="number_of_common_tags" v-model="order_by">
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
        <div class="mt-3">
            <button @click="change_view" >See suggestions instead</button>
        </div>
        <div class="mt-2" v-if="(suggestion == false && research == true) || (suggestion == true)"><h1 class="title text-center">Results of your research:</h1></div>
        </div>
        <div class="row" v-if="(suggestion == false && research == true) || (suggestion == true)">
            <LoadingSpinner v-if="users.length==0 && search_done==false"  class="container">Find the perfect Partner</LoadingSpinner >
            <span v-if="users.length==0 && search_done==false" class="text-center">Finding the perfect partner for you</span>
            <span v-if="users.length==0 && search_done==true" class="text-center mt-5">Humm sorry, the world is a sad place and there is no one out there for you</span>
            <profile-list :users="users"  @ChangeUserListPage="change_page" :current_page="current_page"></profile-list>
        </div>
    </div>
</template>

<script>
import { searchUsers, searchUsersInitial } from "../services/search";
import ProfileList from '../shared/ProfileList.vue'
import TagInputHandler from '../shared/TagInputHandler.vue'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'
import Slider from '@vueform/slider/dist/slider.vue2.js'
import { ValidationProvider } from 'vee-validate';
import LoadingSpinner from './LoadingSpinner'


export default {
    components: { ProfileList, TagInputHandler, Slider, ValidationProvider, LoadingSpinner},
    data() {
        return {
            users           : [],
            age             : [25, 60],
            required_tags   : [],
            rating          : [0, 5],
            zipcode         : null,
            order_by        : "pop_score",
            asc_or_desc     : "DESC",
            offset          : 0,
            limit           : 200,
            current_page    : 1,
            search_done     : false,
            research        : false,
            suggestion      : true,
            suggested_users : null
        }
    },

    computed: {
        token: {
            get: function() {
                return this.$root.store.state.token;
            },
            set: function(sekes_token) {
                this.$root.store.setTokenAction(sekes_token);
            }
        },

        user: {
            get: function() {
                return this.$root.store.state.user;
            },
            set: function(user) {
                this.$root.store.setUserAction(user);
            }
        },

        logged_in: {
            get: function() {
                return this.$root.store.state.logged_in;
            },
            set: function(logged_in) {
                this.$root.store.setLoggedInAction(logged_in);
            }
        },

        profile_complete: function() {
            return this.$root.store.getProfileComplete();
        }
    },

    methods: {
        async change_view() {
            if (this.suggestion == true) {
                this.suggestion = false
                this.research = false
            }
            else {
                this.suggestion = true
                this.users = this.suggested_users
                this.search_done = true
                this.current_page = 1
            }
        },
        async search() {
            if (!this.profile_complete) {
                  this.$swal("Please complete your profile with an image, a bio and some tags.\nAnd validate your email.")
                return
            }
            if (this.$refs.zipcode_valid.flags.invalid) {
                return
            }
            this.zipcode = this.zipcode == "" ? null : this.zipcode
            this.users = []
            this.search_done = false
            let rese = await searchUsers(this.token ,this.age[0], this.age[1], this.required_tags, this.rating[0], this.rating[1], this.zipcode, this.offset, this.limit, this.order_by, this.asc_or_desc)
            this.users = rese.data.data
            this.search_done = true
            this.current_page = 1
            this.suggestion = false
            this.research = true
        },

        addScoreBlend(user) {
            let score = user.pop_score
            if ((user.zipCode != null) && (user.zipCode == this.user.zipCode)) {
                score += 2
            }
            score += user.tag_list.filter(t => this.user.tag_list.includes(t)).length
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
        },

        change_page(page) {
            this.current_page = page
        }

    },

    async created() {
        // console.log("DESIIIIRE: ", desires)
        // let rese = await searchUsers(this.token , this.user.age - 10, this.user.age + 40, this.user.tag_list, 0, 5, null, this.offset, this.limit, this.order_by, this.asc_or_desc, desires)
        let rese = await searchUsersInitial(this.token, this.offset, this.limit)
        this.users = rese.data.data
        this.suggested_users = JSON.parse(JSON.stringify(this.users))
        this.search_done = true
        this.current_page = 1
    }

}
</script>

<style src="@vueform/slider/themes/default.css"></style>

<style scoped>


.filter_categories {
    padding: 20px;
    border-radius: 5px;
    background-color : #ffffffcb;
}

#app.darkmode .filter_categories {
    background: rgba(0, 0, 0, 0.683);
}

.filter_title {
    margin-bottom: 5%;
    padding: 2%;
    border-radius: 20px;
    border: 0.01rem solid rgba(0, 0, 0, 0.600);
    background-color: white
}

#app.darkmode .filter_title {
    background: rgba(255, 255, 255, 0.14);
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