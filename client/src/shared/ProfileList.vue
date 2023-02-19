<template>
<div v-if="user != null" class="container">
<div class="col-md-12">
    <div class="pt-4"></div>

    <div class="card b-1 hover-shadow mb-20" v-for="(user, index) in users.slice((current_page - 1) * user_per_page, current_page * user_per_page)" :key="user.username">
        <div class="media card-body">
            <div class="media-left pr-12">
                <img class="avatar round-radius" :src=profile_pic_url(user.profilePic) alt="...">
            </div>
            <div class="media-body">
                <div class="mb-2">
                    <router-link :to="'/profile/' + user.username" class="fs-20 pr-16">{{user.username}}</router-link>
                </div>
                <p class="bio fs-16 ls-1">{{user.bio}}</p>
            </div>
            <div class="media-right text-right d-none d-md-block">
                <p class="fs-14 text-fade mb-30"><i class="fa fa-map-marker pr-1"></i>{{user.city}}<br/> {{user.zipCode}}</p>
                <span class="text-fade">
                    <i class="fa  pr-1"> {{user.age}}, {{user.gender}},  {{user.sekesualOri}}
                    </i>
                </span>
            </div>
        </div>
        <footer class="card-footer flexbox align-items-center">
            <div>

            </div>
            <div class="card-hover-show">
                <!-- <router-link :to="{ name: 'profile', params: { userId: user._id } }" class="btn btn-xs fs-10 btn-bold btn-info" href="#">View Profile</router-link> -->
                <button v-if="user.did_i_like_him == 0" class="btn btn-xs fs-10 btn-bold btn-primary" @click="like(index, user.username)" data-toggle="modal" data-target="#modal-contact">Like</button>
                <button v-else class="btn btn-xs fs-10 btn-bold btn-primary" @click="unlike(index, user.username)" data-toggle="modal" data-target="#modal-contact">Unlike</button>
                <button class="btn btn-xs fs-10 btn-bold btn-warning" @click="block(index, user.username)">Block</button>
            </div>
        </footer>
    </div>

    <nav>
        <ul class="pagination justify-content-center">
            <div v-for="page_num in total_pages" :key="page_num">
                <li v-if="page_num == current_page" class="page-item active"><a class="page-link" >{{page_num}}</a></li>
                <li v-else                          class="page-item">       <a class="page-link" @click="change_page(page_num)">{{page_num}}</a></li>
            </div>
        </ul>
    </nav>
    <br>
</div>
</div>

</template>


<script>

import { likeUser, unlikeUser } from "../services/user";
import { blockUser, unblockUser } from "../services/user";

export default {
    data() {
        return {
        }
    },

    computed: {
        total_pages() {
            return Math.ceil(this.users.length / this.user_per_page)
        },

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
    },

    props: {
        users: Array,

        current_page: {
            type: Number,
            default: () => {
                return 1
            }
        },

        user_per_page: {
            type: Number,
            default: () => {
                return 10
            }
        },
    },

    model: {
    prop: 'users',
    event: 'users_change'
  },

    methods: {
        change_page(current_page) {
              this.$emit("ChangeUserListPage", current_page);
        },
        
        profile_pic_url(url) {
            if (url != null) {
                return url
            }
            return require("../assets/empty_profile.png")
        },

        async like(index, username) {
            if (this.user.is_complete_profile == 0) {
                this.$swal('Please complete your profile with a profile picture, tags and a bio to be able to like users.')
                return
            }
            try {
                await likeUser(this.token, username)
                let new_users = this.users
                new_users.splice(index, 1, {...this.users[index], did_i_like_him: 1})
                this.$emit('users_change', new_users)
            }
            catch (e) {
                console.log("HIHI like", e)
                this.$swal("Outdated token please login again")
            }
        },

        async unlike(index, username) {
            try {
                unlikeUser(this.token, username)
                let new_users = this.users
                new_users.splice(index, 1, {...this.users[index], did_i_like_him: 0})
                this.$emit('users_change', new_users)
            }
            catch (e) {
                console.log("HIHI unlike", e)
                this.$swal("Outdated token please login again")
            }
        },

        async block(index, username) {
            try {
                blockUser(this.token, username)
                let new_users = this.users
                new_users.splice(index, 1)
                this.$emit('users_change', new_users)
            }
            catch (e) {
                console.log("HIHI block", e)
                this.$swal("Outdated token please login again")
            }
        },

        async unblock(index, username) {
            try {
                unblockUser(this.token, username)
                let new_users = this.users
                new_users.splice(index, 1)
                this.$emit('users_change', new_users)
            }
            catch (e) {
                console.log("HIHI unblock", e)
                this.$swal("Outdated token please login again")
            }
        },
    },

    created() {
    }
}
</script>



<style scoped>
@import url("../assets/profile.css");


.media {
    padding: 16px 12px;
    -webkit-transition: background-color .2s linear;
    transition: background-color .2s linear;
}

.media-right {
    width: 20%;
}

.media {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: start;
    align-items: flex-start;
}

.card-body {
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 1.25rem;
}

.media .avatar {
    flex-shrink: 0;
}

.no-radius {
    border-radius: 0 !important;
}

.avatar {
    border-radius: 50%;
    height       : 160px;
    width        : 220px;
    object-fit   : cover;
}


img {
    max-width: 100%;
    vertical-align: middle;
    border-style: none;
}

.mb-2 {
    margin-bottom: .5rem!important;
}

.fs-20 {
    font-size: 20px !important;
}

.pr-16 {
    padding-right: 16px !important;
}

.ls-1 {
    letter-spacing: 1px !important;
}

.fw-300 {
    font-weight: 300 !important;
}

.fs-16 {
    font-size: 16px !important;
}

.media-body {
    padding: 20px;
    margin-bottom: 0;
}

.bio {
    font-family: Roboto,sans-serif;
    font-weight: 400;
    font-size: 11px;
    color: #8b95a5;
}

.fs-14 {
    font-size: 14px !important;
}

.mb-30 {
    margin-bottom: 30% !important;
}

.text-fade {
    color: rgba(77,82,89,0.7) !important;
}

#app.darkmode .text-fade {
    color: rgba(189, 201, 217, 0.7) !important;
}

.card-footer:last-child {
    border-radius: 0 0 calc(.25rem - 1px) calc(.25rem - 1px);
}

.card-footer {
    background-color: #fcfdfe;
    border-top: 1px solid rgba(77,82,89,0.07);
    color: #8b95a5;
    padding: 10px 20px;
}

.flexbox {
    display: -webkit-box;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.align-items-center {
    -ms-flex-align: center!important;
    align-items: center!important;
}

.card-footer {
    padding: .75rem 1.25rem;
    background-color: rgba(0,0,0,.03);
    border-top: 1px solid rgba(0,0,0,.125);
}


.card-footer {
    background-color: initial;
    border-top: 1px solid rgba(77, 82, 89, 0.07);
    color: #8b95a5;
    padding: 10px 20px
}

.card-footer>*:last-child {
    margin-bottom: 0
}

.hover-shadow {
    -webkit-box-shadow: 0 0 35px rgba(0, 0, 0, 0.11);
    box-shadow: 0 0 35px rgba(0, 0, 0, 0.11)
}

.fs-10 {
    font-size: 10px !important;
}
</style>