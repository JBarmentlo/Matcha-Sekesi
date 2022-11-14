<template>
<div>
  <b-navbar toggleable="lg" type="light" variant="info">
    <b-navbar-brand href="#"><routerLink to="/" class="navbar-brand">SEKESI</routerLink></b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ms-auto" v-if="!logged_in">
        <b-nav-item><router-link to="/signin" class="nav-link">Sign in</router-link></b-nav-item>
        <b-nav-item><router-link to="/signup" class="nav-link">Sign up</router-link></b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ms-auto" v-else>
        <b-nav-item><router-link to="/getallusers" class="nav-link">Search <b-icon-search/></router-link></b-nav-item>
        <b-nav-item><router-link to="/editprofile" class="nav-link">Profile <b-icon-person-circle/></router-link></b-nav-item>
        <b-nav-item><router-link to="/cat" class="nav-link">Chat <b-icon-chat-text-fill /></router-link></b-nav-item>
        <NotifHandler />
        <b-nav-item><router-link to="/" @click.native="logout" class="nav-link">Logout <b-icon-arrow-bar-right /></router-link></b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
import router from "@/router";
import NotifHandler from "./NotifHandler.vue";

export default {
  name: "NavBar",

  components: {
    NotifHandler,
  },

  props: {
    logged_in: Boolean,
  },

  data() {
    return {
      notifs: [],
    };
  },

  methods: {
    logout() {
      console.log("LOGGING OUT");
      if (this.$cookies.isKey("user")) this.$cookies.remove("user");
      console.log("remo9ve user xookie");
      if (this.$cookies.isKey("sekes_tokens"))
        this.$cookies.remove("sekes_tokens");
      console.log("remo9ve token xookie");
      this.$emit("setLoggedIn", false);
      if (this.$route.path != "/signin") router.push("/signin");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Michroma&display=swap");

.navbar {
  /* font-size: 120%; */
  padding: 10px;
  background-image: linear-gradient(#f6c0ba, #facefb);
}

.nav-link, .navbar-brand {
  color: #2f62c9c2;
}

.nav-link:hover, .navbar-brand:hover {
  color: #324792c2;
}

.navbar-brand {
  font-family: "Michroma", sans-serif;
}


.nav-item {
  letter-spacing: 2.5px;
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  font-size: 15px;
}


</style>
