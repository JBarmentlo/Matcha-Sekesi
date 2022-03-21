<template>
  <div class="vue-tempalte">
    <!-- Navigation -->
    <NavBar @setLoggedIn="setLoggedIn" v-bind:logged_in="logged_in"/>
    <!-- Main -->
    <div class="App">
      <div class="vertical-center">
        <div class="inner-block">
          <router-view 
            @setLoggedIn="setLoggedIn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue"

export default {
  name: 'App',
  
  components: {
    NavBar
  },

  data() {
    return {
      logged_in   : false
    }
  },

  methods: {
    async setLoggedIn(val) {
      this.logged_in = val;
      console.log("logged in set to: %s", val)
    },

    logIn(userID, token, signature) {
      this.logged_in = val;
      console.log("logged in set to: %s", val)
    },
  },
}
</script>