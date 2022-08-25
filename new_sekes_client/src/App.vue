<template>
  <div id="app">
    <NavBar @setLoggedIn="setLoggedIn" v-bind:logged_in="logged_in"/>
    <router-view/>
  </div>
</template>




<script>
import NavBar from "./components/NavBar.vue"

// process.env.USER_ID; // "239482"
// process.env.USER_KEY; // "foobar"
// process.env.NODE_ENV; // "development"

export default {
  name: 'App',
  
  components: {
    NavBar
  },

  data() {
    return {
      logged_in       : false,
      currentUser     : Object,
    }
  },

  computed: {
  },

  methods: {
    async setLoggedIn(val) {
      this.logged_in = val;
      console.log("logged in set to: %s", val)
      this.CometFullShebang()
    },
  },

  created() {
    console.log("Created App");
	},
}
</script>




<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */
</style>
