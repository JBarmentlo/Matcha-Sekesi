<template>
  <div class="container" v-if="user != null">
    <div class="row">
      <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <div class="account-settings">
              <div><img class="profile_pic" :src="profile_pic"/></div>
              <h5 class="important-infos mt-3">{{ user.firstName }} {{ user.lastName }}
                <b-icon-circle-fill v-if="user.connected == 1" id="disponibility" class="connected" font-scale="0.5"></b-icon-circle-fill>
                <b-icon-circle v-else id="disponibility" class="disconnected" font-scale="0.5" ></b-icon-circle>
              </h5>
              <h6 class="not-important">aka</h6>
              <h5 class="important-infos">{{ user.username }}</h5>
              <h6 class="connection_info not-important" v-if="user.connected == 1" target="disponibility" placement="right" >connected</h6 >
              <div class="connection_info not-important" v-else target="disponibility" placement="right" >Last connected: {{ last_connected }}</div >
              <h6 class="email mt-3"><b-icon-mailbox /> {{ user.mail }}</h6>
              <div class="likeorblock_buttons">
                <div class="row justify-content-md-center">
                  <div class="col-md-auto">
                    <b-button size="sm" v-if="user.did_i_like_him == 0" @click="like(user.username)" variant="outline-info" class="mb-2" >
                      <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon> Like
                    </b-button>
                    <b-button size="sm" v-else @click="unlike(user.username)" id="unlike" variant="info" class="mb-2" >
                      <b-icon icon="hand-thumbs-up-fill" aria-hidden="true" ></b-icon> Liked
                      <b-tooltip target="unlike" placement="top" triggers="hover" >Unlike</b-tooltip >
                    </b-button>
                  </div>
                  <div class="col-md-auto">
                    <b-button size="sm" v-if="user.did_i_block_him == 0" @click="block(user.username)" variant="outline-secondary" class="mb-2" >
                      <b-icon icon="x-circle" aria-hidden="true"></b-icon> Block
                    </b-button>
                    <b-button size="sm" v-else @click="unblock(user.username)" id="unblock" variant="danger" class="mb-2" >
                      <b-icon icon="x-circle-fill" aria-hidden="true"></b-icon> Blocked
                      <b-tooltip target="unblock" placement="top" triggers="hover" >Unblock</b-tooltip >
                    </b-button>
                  </div>
                  <div class="col-md-auto">
                    <b-button size="sm" v-if="reported == false" variant="outline-warning" @click="report(user.username)" >
                      <b-icon icon="exclamation-triangle"></b-icon> Report
                    </b-button>
                    <b-button size="sm" v-else disabled>
                      <b-icon icon="exclamation-triangle-fill"></b-icon> Reported
                    </b-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
        <div class="card h-100">
          <div class="card-body">
            <div class="row justify-content-center">
              <div class="col justify-self-center carroussel">
              <ProfileImageCarousel :images="user_images" :disabled="true" />
              </div>
            </div>
            <div class="row infos justify-content-md-center">
              <div class="col-md-auto">
                <p>Popularity:</p>
                <p class="important">{{ popScore }}</p>
              </div>
              <div v-if="user.zipCode" class="col-md-auto">
                <p>
                  <b-icon icon="pin-map-fill"></b-icon> ZipCode:
                </p>
                <p class="important">{{ user.zipCode }}</p>
              </div>
              <div v-if="birth_date" class="col-md-auto">
                <p>date of birth:</p>
                <p class="important">{{ birth_date }}</p>
              </div>
            </div>
            <div class="orientation">
              <span v-if="user.gender" class="important">{{ user.gender }}</span>
              <span v-if="user.gender">&</span>
              <span class="important">{{ user.sekesualOri }}</span>
            </div>
            <TagInputHandler v-if="user.tag_list.length != 0" v-model="user.tag_list" :disabled="true" />
            <div class="about" v-if="user.bio && user.bio.length != 0">
              <p class="bio text mt-5">"{{ user.bio }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { likeUser, unlikeUser } from "../services/user";
import { blockUser, unblockUser, reportUser } from "../services/user";
import { getUserProfile } from "../services/user";

import ProfileImageCarousel from "../shared/ProfileImageCarousel.vue";
import TagInputHandler from "../shared/TagInputHandler.vue";

export default {
  components: {
    ProfileImageCarousel,
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

    popScore: function () {
      return Math.round(this.user.popScore * 100) / 100;
    },

    last_connected: function () {
      const date = new Date(this.user.last_connected);
      const options = {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    },

    birth_date: function () {
      const date = new Date(this.user.DOB);
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    },
  },

  methods: {
    like(username) {
      likeUser(this.$cookies.get("sekes_tokens"), username);
      this.user.did_i_like_him = 1;
    },

    unlike(username) {
      unlikeUser(this.$cookies.get("sekes_tokens"), username);
      this.user.did_i_like_him = 0;
    },

    block(username) {
      blockUser(this.$cookies.get("sekes_tokens"), username);
      this.user.did_i_block_him = 1;
    },

    unblock(username) {
      unblockUser(this.$cookies.get("sekes_tokens"), username);
      this.user.did_i_block_him = 0;
    },

    report(username) {
      reportUser(this.$cookies.get("sekes_tokens"), username);
      this.reported = true;
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
    this.user = res.data.data;
    next();
  },
};
</script>

<style scoped>
@import url("../assets/shared.css");


.profile_pic {
  width: 200px;
  height: 200px;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.carroussel{
  max-width: 50%;
  margin-top: 5%;

}

.infos {
  color: black;
  margin-top: 20px;
  text-align: center;
}

.orientation {
  text-align : center;
  color: inherit;
  margin-bottom: 10px;
}

.important {
  font-weight: bold;
  font-size: 120%;
}

.bio {
  text-align: center;
  margin-bottom: 20px;
}

.connected {
  color: rgb(11, 212, 11);
}

.disconnected {
  color: black;
}

.connection_info {
  max-width: 100%;
}


</style>
