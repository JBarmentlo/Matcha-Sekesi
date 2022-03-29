<template>
  <div class="main-container">
    <div>
      <NavBar @setLoggedIn="setLoggedIn" v-bind:logged_in="logged_in"/>
    </div>
    <div class="App">
      <router-view 
        @setLoggedIn="setLoggedIn"
      />
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue"
import { likesOfMe, likesByMe } from "./services/like.script"
import { blocksOfMe, blocksByMe } from "./services/block.script"
import { getMyUserDetails } from "./services/user.script"

export default {
  name: 'App',
  
  components: {
    NavBar
  },

  data() {
    return {
      logged_in   : false,
      currentUser : Object,
      likesOfMe   : Array,
      likesByMe   : [],
      blocksByMe  : Array,
    }
  },

  computed: {
    likes: function() {
      return(this.likesOfMe.concat(this.likesByMe))
    }
  },

  methods: {
    async setLoggedIn(val) {
      this.logged_in = val;
      console.log("logged in set to: %s", val)
    },
    async updateLikes() {
      this.likesByMe = await likesByMe(this.$cookies.get('user'))
      this.likesOfMe = await likesOfMe(this.$cookies.get('user'))
    },
    async updateBlocks() {
      this.blocksByMe = await blocksByMe(this.$cookies.get('user'))
    },
    async getCurrentUser() {
      this.currentUser = await getMyUserDetails(this.$cookies.get('user'))
    }
  },

  created() {
    console.log("Created");
    console.log(this.likesOfMe);
    if (
      this.$cookies.isKey("user") &&
      this.$cookies.get("user").data.id != null
    ) {
      console.log("already logged in by cookie");
      this.setLoggedIn(true)
    }
    if (this.$cookies.isKey('user'))
    {
      this.updateLikes()
      this.updateBlocks()
      this.getCurrentUser()
    }
	},
}
</script>


<style >

.App,
.main-container {
  width: 100%;
  height: 100%;
}

.center {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	border: 3px solid green;
}

.inner-block {
	background: #ffffff;
	box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
	padding: 40px 55px 45px 55px;
	border-radius: 15px;
	transition: all 0.3s;
  max-width: 80%;
  max-height: 80%;
}

</style>