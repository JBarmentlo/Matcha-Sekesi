<template>
    <div class="container">
    <div class="row gutters">
    <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
    <div class="card h-100">
        <div class="card-body d-flex flex-column">
            <div class="account-settings">
                <div class="user-profile">
                    <div class="user-avatar">
                        <ProfilePicUpload v-model="user.profilePic"/>
                    </div>

                    <h5 class="user-name">{{ user.username }}</h5>
                    <h6 class="user-email">{{ user.mail }}</h6>
                </div>
                <div class = "popularity">
                    <div class = "d-flex justify-content-center align-items-center text-center">
                        <div class = "views p-3">
                            <b-icon-eye />  {{ user.consult_list.length }}
                        </div>
                        <div class = "likes p-3">
                            <b-icon-hand-thumbs-up />  {{ user.like_list.length }}
                        </div>
                    </div>
                </div>
                <div v-if="user.bio && user.bio.length != 0" class="about">
                    <h5>About</h5>
                    <p>{{ user.bio }}</p>
                </div>
            </div>
		<ProfileImageCarousel :images="user_images" @AddImage="AddImage" @DeleteImage="RemoveImage"/>
            
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
                    <TagInputHandler v-model="user.tag_list"/>
                </div>
                <div class="col">
                    <label class="labels">Sekesual Orientation</label>
                    <div>
                        <b-dropdown
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
                        <b-dropdown class="dropdown-2" v-bind:text="user.gender">
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
                    />
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                </div>
                <div class="col">
                    <file-upload />
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


import {updateUser, getMyUser} from '../services/user'
import FileUpload from '../shared/FileUpload.vue'
import ProfileImageCarousel from '../shared/ProfileImageCarousel.vue'
import TagInputHandler from '../shared/TagInputHandler.vue'
import ProfilePicUpload from '../shared/ProfilePicUpload.vue'
import { diff } from '../services/utils'

import { BIconEye, BIconHandThumbsUp } from 'bootstrap-vue'
export default {
    components: {
        FileUpload,
		ProfileImageCarousel,
        BIconEye,
        BIconHandThumbsUp,
        TagInputHandler,
        ProfilePicUpload
    },

    data() {
        return {
            existingTags : [],
            user : {...this.$cookies.get('user')},
            test: 'lol'
        };
    },

    computed: {
        accessTokens: function() {
            if (this.$cookies.isKey('sekes_tokens')) {
                return this.$cookies.get('sekes_tokens')
            }
            else {
                return null
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
        }
    },

    methods: {
		RemoveImage(image_index) {
            console.log("Remov ", image_index)
			this.user['image' + image_index] = null
		},

        AddImage(image_url, index) {
            console.log("Add ", image_url, index)
            this.user['image' + index] = image_url
        },

        async updateProfile() {
            console.log("Updating profile dummy: ", {...this.user})
            let user_diffy = diff(this.$cookies.get('user'), this.user)
            // console.log("DIFFY: ", user_diffy)
            if (Object.keys(user_diffy).length === 0) {
                console.log("useless update ignored")
                return
            }
            try {
                await updateUser(this.$cookies.get('sekes_tokens'), user_diffy)
                let user_response = await getMyUser(this.$cookies.get('sekes_tokens'))
                // console.log("res: ",user_response.data.data)
                this.$cookies.set('user', user_response.data.data)
                this.user = user_response.data.data
            }
            catch (e) {
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
        }
    },

    mounted() {
    },
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/@voerro/vue-tagsinput@2.7.1/dist/style.css");

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