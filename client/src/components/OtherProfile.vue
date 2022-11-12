<template>
  <div class="container" v-if="user != null">
    <div class="row">
      <div class="col-md-auto container_col">
        <div class="card h-100">
          <div class="d-flex flex-column justify-content-center align-items-center">
            <img class="profile_pic" :src="user.profilePic" />
            <span class="name mt-3">
              {{ user.firstName }} {{ user.lastName }}
              <b-icon-circle-fill v-if="user.connected == 1" id="disponibility" class="connected" font-scale="0.5"></b-icon-circle-fill>
              <b-icon-circle v-else id="disponibility" class="disconnected" font-scale="0.5" ></b-icon-circle>
            </span>
            <span class="username">
              <p>aka</p>
              {{ user.username }}
            </span>
            <span class="connection_info" v-if="user.connected == 1" target="disponibility" placement="right" >connected</span>
            <span class="connection_info" v-else target="disponibility" placement="right" >Last connected: {{ last_connected }}</span>
            <span class="email mt-3"><b-icon-mailbox /> {{ user.mail }}</span>
            <div class="buttons">
              <div class="row justify-content-md-center">
                <div class="col-md-auto">
                  <b-button size="sm" v-if="user.did_i_like_him == 0" @click="like(user.username)" variant="outline-info" class="mb-2">
                    <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon> Like
                  </b-button>
                  <b-button size="sm" v-else @click="unlike(user.username)" id="unlike" variant="info" class="mb-2">
                    <b-icon icon="hand-thumbs-up-fill" aria-hidden="true"></b-icon> Liked
                    <b-tooltip target="unlike" placement="top" triggers="hover">Unlike</b-tooltip>
                  </b-button>
                </div>
                <div class="col-md-auto">
                  <b-button size="sm" v-if="user.did_i_block_him == 0" @click="block(user.username)" variant="outline-secondary" class="mb-2">
                    <b-icon icon="x-circle" aria-hidden="true"></b-icon> Block
                  </b-button>
                  <b-button size="sm" v-else @click="unblock(user.username)" id="unblock" variant="danger" class="mb-2">
                    <b-icon icon="x-circle-fill" aria-hidden="true"></b-icon> Blocked
                    <b-tooltip target="unblock" placement="top" triggers="hover">Unblock</b-tooltip>
                  </b-button>
                </div>
                <div class="col-md-auto">
                  <b-button size="sm" v-if="reported == false" variant="outline-warning" @click="report(user.username)">
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
      <div class="col-md-7 container_col">
        <div class="card h-100">
          <div class="d-flex flex-column justify-content-center align-items-center">
			<div class="carroussel">
				<ProfileImageCarousel :images="user_images" :disabled="true" />
			</div>
            <div class="row infos justify-content-md-center">
              <div class="col-md-auto">
                <p class="title">Popularity:</p>
                <p class="important">{{ popScore }}</p>
              </div>
              <div class="col-md-auto">
                <p class="title">
                  <b-icon icon="pin-map-fill"></b-icon> ZipCode:
                </p>
                <p class="important">{{ user.zipCode }}</p>
              </div>
              <div class="col-md-auto">
                <p class="title">date of birth:</p>
                <p class="important">{{ birth_date }}</p>
              </div>
            </div>
            <div class="orientation">
              <span class="important">{{ user.gender }}</span>
              &
              <span class="important">{{ user.sekesualOri }}</span>
            </div>
            <TagInputHandler v-model="user.tag_list" :disabled="true" />
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
	position: absolute;
	bottom: 10px;
	margin-bottom: 0px;
}

.profile_pic, .carroussel {
  margin-top: 20px;
}

.profile_pic {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 50%;
}

.username,
.name {
  font-size: 30px;
  color: black;
  font-weight: bold;
  text-align: center;
}

.username {
  font-size: 25px;
}

.username > p {
  font-size: initial;
  font-weight: initial;
  margin-bottom: 0rem;
}

.infos {
  color: black;
  margin-top: 20px;
  text-align: center;
}

.orientation {
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
  color: rgb(98, 98, 98);
  text-align: center;
  max-width: 40%;
}
</style>
