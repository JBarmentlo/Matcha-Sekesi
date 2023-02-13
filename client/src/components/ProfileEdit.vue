<template>
    <div v-if="user != null" class="container">
    <div class="row">
        <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
            <div class="card h-100">
                <div class="card-body d-flex flex-column">
                    <div class="account-settings">
                        <div class="user-profile">
                            <div class="user-avatar">
                                <ProfilePicUpload v-model="user.profilePic"/>
                            </div>

                            <h5 class="important-infos">{{ user.firstName }} {{ user.lastName }}</h5>
                            <h6 class="not-important">aka</h6>
                            <h5 class="important-infos">{{ user.username }}</h5>
                            <h6 class="not-important">{{ user.mail }}</h6>
                        </div>
                        <div class = "popularity">
                            <div class = "d-flex justify-content-center align-items-center text-center">
                                <div id="views" class = "views p-3">
                                    <b-icon-eye />  {{ user.consult_list.length }}
                                </div>
                                <b-tooltip target="views" placement="top" triggers="hover">views</b-tooltip>
                                <div id="likes" class = "likes p-3">
                                    <b-icon-hand-thumbs-up />  {{ user.like_list.length }}
                                </div>
                                <b-tooltip target="likes" placement="top" triggers="hover">likes</b-tooltip>
                                <b-dropdown
                                id="list_people"
                                variant="link"
                                toggle-class="text-decoration-none"
                                no-caret
                                >
                                    <template #button-content>
                                        <span class="caret_down"><b-icon-caret-down-fill class="caret"/></span>
                                    </template>
                                        <b-dropdown-item v-for="liker in user.like_list" :key="liker + 'liker'">
                                            <router-link :to="{ name: 'profile', params: { userName: liker }}">{{liker}}</router-link> liked you.
                                        </b-dropdown-item>
                                        <b-dropdown-item v-for="consulter in user.consult_list" :key="consulter + 'consulter'">
                                            <router-link :to="{ name: 'profile', params: { userName: consulter }}">{{consulter}}</router-link> consulted your profile
                                        </b-dropdown-item>
                                </b-dropdown>
                                <b-tooltip target="list_people" placement="top" triggers="hover">More details</b-tooltip>
                            </div>
                        </div>
                        <div v-if="user.bio && user.bio.length != 0" class="about">
                            <h5>About</h5>
                            <p>{{ user.bio }}</p>
                        </div>
                    </div>
                    <ProfileImageCarousel ref="Jaroussel" :images="user_images" @AddImage="AddImage" @DeleteImage="RemoveImage"/>
                </div>
            </div>
        </div>
    <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
    <div class="card h-100">
        <div class="card-body">
            <div class="row pt-2">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h6 class="mb-2 section">Account Details</h6>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="form-group">
                        <label class="labels">Name</label>
                        <input
                            type="text"
                            v-model="user.firstName"
                            class="form-control"
                            placeholder="Enter first name"
                            maxlength="50"
                            value=""
                        />
                    </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="form-group">
                        <label class="labels">Last Name</label>
                        <input
                            type="text"
                            v-model="user.lastName"
                            class="form-control"
                            value=""
                            placeholder="Enter last name"
                            maxlength="50"
                        />
                    </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="form-group">
                        <label class="labels">Email</label>
                        <input
                            type="text"
                            v-model="user.mail"
                            class="form-control"
                            placeholder="Enter email adress"
                            maxlength="255"
                            value=""
                        />
                        <span v-if="mail_taken" class="login_error">Mail already in use</span>
                    </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="form-group">
                    <label class="labels">ZIP Code</label>
                    <input
                        type="text"
                        v-model="user.zipCode"
                        class="form-control"
                        placeholder="zip"
                        maxlength="100"
                        value=""
                    />
                </div>
                </div>
            </div>
            <div class="row pt-5">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h6 class="mt-3 mb-2 section">Personal details</h6>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div class="form-group">
                    <label class="labels">Interests</label>
                    <TagInputHandler v-model="user.tag_list" ref="tagHandler"/>
                </div>
                </div>
                <div class="col">
                    <label class="labels">Orientation</label>
                    <div>
                        <b-dropdown
                            variant="link"
                            toggle-class="text-decoration-none"
                            class="dropdown-1"
                            v-bind:text="user.sekesualOri"
                        >
                        <template #button-content>
                            <span class="nav-item">{{user.sekesualOri}}</span>
                        </template>
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
                            variant="link"
                            toggle-class="text-decoration-none"
                            class="dropdown-2"
                            v-bind:text="user.gender"
                        >
                        <template #button-content>
                            <span class="nav-item">{{user.gender}}</span>
                        </template>
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
                <div class="form-group">
                    <label class="labels">Bio</label>
                    <textarea
                        type="text"
                        v-model="user.bio"
                        class="form-control"
                        placeholder="Tell us a few words about you"
                        value=""
                        maxlength="255"
                        rows="6"
                    />
                </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-3">
                <div class="form-group">
                    <label class="labels">Date of Birth</label>
                    <b-datepicker v-bind:value="user.DOB" @input="DOBSelected"/>
                </div>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-3">
                    <div class="form-group">
                        <label v-if="!user.gif" class="labels">Add a gif to your profile</label>
                        <div v-if="!user.gif" class = "input-group">
                        <input
                            type="text"
                            ref="gifsearch"
                            v-model="searchTerm"
                            class="form-control"
                            placeholder="Enter a word"
                            value=""
                        />
                        <span class="input-group-btn form-control">
                            <button class="btn m-0" type="button" @click=getGifs()><b-icon-search></b-icon-search></button>
                        </span>
                        <span v-if="search_on" class="input-group-btn form-control">
                            <button class="btn m-0" type="button" @click=removeSearch()><b-icon-x></b-icon-x></button>
                        </span>
                        </div>
                        <div v-if="user.gif">
                            <img :src="user.gif">
                            <b-button class="gif-button" @click=removeGif()>Remove this GIF from your profile<b-icon-x></b-icon-x></b-button>
                        </div>
                        <div v-if="!user.gif && gifs.length > 0" class="gif-container">
                            <img id="gif-image" @click=selectGif(gif) v-for="gif in gifs" :src="gif" :key="gif.id">
                            <b-tooltip  target="gif-image" placement="rigth" triggers="hover">select this gif</b-tooltip>
                        </div>
                </div>
                </div>
            <div class="row">
                <div class="col">
                    <div class="text-right">
                        <button class = "update_button" type="button" id="submit" name="submit"  @click="updateProfile"><b-icon-check-square/>  Update</button>
                        <button class = "cancel_button" type="button" id="submit" name="submit" ><b-icon-x-circle/>  Cancel</button>
                    </div>
                </div>
                <div v-if="isCompleteProfile" class="col-md-auto profile_complete">
                    Profile complete!
                </div>
                <div v-else class="col-md-auto red">
                    Incomplete profile, please add a profile picture.
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
import { BIconEye, BIconHandThumbsUp } from 'bootstrap-vue'

import {updateUser, getMyUser} from '../services/user'
// import { diff } from '../services/utils'

import ProfileImageCarousel from '../shared/ProfileImageCarousel.vue'
import TagInputHandler from '../shared/TagInputHandler.vue'
import ProfilePicUpload from '../shared/ProfilePicUpload.vue'

export default {
    components: {
		ProfileImageCarousel,
        BIconEye,
        BIconHandThumbsUp,
        TagInputHandler,
        ProfilePicUpload,
    },

    data() {
        return {
            searchTerm : "",
            gifs: [],
            search_on : false,
            mail_taken: false
        };
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

		user_images: function() {
				return [this.user.image0, this.user.image1, this.user.image2, this.user.image3]
        },

        profile_pic: function() {
            if (this.user.profilePic != null) {
                return this.user.profilePic
            }
            return require("../assets/empty_profile.png")
        },

        isCompleteProfile: function() {
            return (this.user.profilePic != null)
        }
    },

    methods: {
        getGifs() {
            console.log("Search term: " + this.searchTerm);
            let apiKey = "HFY9lFDhVVSGtPA4tnnFIR0YfPGxzTok";
            let searchEndPoint = "//api.giphy.com/v1/gifs/search?";
            let limit = 5;

            let url = `${searchEndPoint}&api_key=${apiKey}&q=${
            this.searchTerm
            }&limit=${limit}`;
            console.log("url: " + url);
            fetch(url)
            .then(response => {
                return response.json();
            })
            .then(json => {
                this.buildGifs(json);
            })
            .catch(err => {
                console.log(err);
            });
        },


        buildGifs(json) {
            this.search_on = !this.search_on;
            this.gifs = json.data
            .map(gif => gif.id)
            .map(gifId => {
            return `https://media.giphy.com/media/${gifId}/giphy.gif`;
        });
        },


        selectGif(gif){
            console.log("Gifs: " + this.gifs);
            console.log("Gif: " + gif);
            this.gifs = [gif];
            this.search_on = !this.search_on;
            this.user.gif = gif;
            console.log("After click Gifs: " + this.gifs);
        },


        removeSearch() {
            this.gifs = [];
            this.search_on = !this.search_on;
            this.$refs.gifsearch.value = "";
        },

        removeGif() {
            this.user.gif = null;
            this.gifs = [];
        },

		RemoveImage(image_index) {
            console.log("Remov ", image_index)
			this.user['image' + image_index] = null
		},


        AddImage(image_url, index) {
            console.log("Add ", image_url, index)
            this.user['image' + index] = image_url
        },


        async updateProfile() {
            // # TODO: this diffy will be empty
            let user_diffy = {...this.user}
            delete user_diffy.last_connected
            delete user_diffy.connected
            try {
                await this.$refs.tagHandler.uploadTags()
                delete user_diffy.tag_list
                console.log("sending updato: ", user_diffy)
                let update_res = await updateUser(this.token, user_diffy)
                if (update_res.data.code == 'SUCCESS') {
                    let user_response = await getMyUser(this.token)
                    this.user = user_response.data.data
                    this.$swal("Successfully updated your profile.")
                    return
                }
                
                if (update_res.data.code == 'MAIL_TAKEN') {
                    this.mail_taken = true
                }

                if (update_res.data.code == 'ER_DATA_TOO_LONG') {
                    this.data_too_long = true
                }
                this.$swal("Unsuccessful profile update.")
            }
            catch (e) {
                this.$swal("Unsuccessful profile update.")
                console.log("error in update User or get response:\n", e)
            }
        },


        setGender(val) {
            this.user.gender = val;
            console.log("gender %s", this.user.gender);
        },


        setSekesual(val) {
            this.user.sekesualOri = val;
            console.log("sekesualOri %s", this.user.sekesualOri);
        },


        onSelectImage(val) {
            console.log("selected: ", val)
        },


        calculateAge(birthday) {
            var ageDifMs = Date.now() - birthday.getTime();
            var ageDate = new Date(ageDifMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        },


        DOBSelected(e) {
            this.user.DOB = e
            // this.user.age = this.calculateAge(new Date(e.replace(/-/g,'/')))
            // console.log(this.user.age)
        }
    },
};
</script>

<style scoped>

@import url("../assets/profile.css");

.login_error {
	color : red;
	font-size: 80%;
	margin-left: 5px;
}

.popularity {
    color: rgb(56, 56, 56);
}

#app.darkmode .popularity, #app.darkmode #list_people {
    color: white;
}

.caret_down {
    color: black;
}

#app.darkmode .caret_down {
    color: white;
}

.section {
	text-transform: uppercase;
}

.dropdown-1, .dropdown-2{
    position: static;
    border : 0.5px solid;
    background-color: white;
}

.nav-item {
    margin: 0;
    color: inherit;
    color : #2f62c9c2;
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

.gif-container {
  margin-top: 30px;
  flex-direction: column;
  align-items: center;
}

.gif-image:hover {
    opacity: 0.5;
    cursor: pointer;
}

.gif-button {
    margin: 5px;
    font-size: 10px;
}

</style>