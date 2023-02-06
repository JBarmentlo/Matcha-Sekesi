<template>
<div>
  <b-navbar toggleable="lg" type="light" variant="info" :class="[isActive ? 'darkk' : 'lightt']">
    <b-navbar-brand v-if="!logged_in" href="#"><routerLink to="/" class="navbar-brand">SEKESI</routerLink></b-navbar-brand>
    <b-navbar-brand v-else href="#"><routerLink to="/editprofile" class="navbar-brand">SEKESI</routerLink></b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ms-auto" v-if="!logged_in">
        <b-nav-item><router-link to="/signin" class="nav-link">Sign in</router-link></b-nav-item>
        <b-nav-item><router-link to="/signup" class="nav-link">Sign up</router-link></b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ms-auto" v-else>
        <b-nav-item v-if="profile_complete"><router-link to="/getallusers" class="nav-link">Search <b-icon-search/></router-link></b-nav-item>
        <b-nav-item v-else><span @click="complete_profile_popup()" class="nav-link">Search <b-icon-search/></span ></b-nav-item>
        <b-nav-item><router-link to="/editprofile" class="nav-link">Profile <b-icon-person-circle/></router-link></b-nav-item>
        <b-nav-item><router-link to="/cat" class="nav-link">Chat <b-icon-chat-text-fill /></router-link></b-nav-item>
        <NotifHandler />
        <b-nav-item-dropdown right class="nav-link" >
          <template slot="button-content">
              <b-icon-gear-fill/>
          </template>
          <div>
                <b-dropdown-item

                @click="toggle">
                {{ isActive ? "LightMode" : "DarkMode"}}
                >
                </b-dropdown-item>
            </div>
        </b-nav-item-dropdown>
        <b-nav-item><router-link to="/" @click.native="logout" class="nav-link">Logout <b-icon-arrow-bar-right /></router-link></b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
import { router } from "@/router";
import NotifHandler from "./NotifHandler.vue";

export default {
  name: "NavBar",

  components: {
    NotifHandler,
  },

  data() {
    return {
      notifs: [],
      isActive: false,
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

    profile_complete: function() {
      // return this.$root.store.state.user.is_complete_profile;
      return this.$root.store.getProfileComplete();
    }
  },

  methods: {
    toggle() {
      this.isActive = !this.isActive;
      this.$emit('change-mode', this.isActive )
      console.log('emit child')
    },

    logout() {
      console.log("LOGGING OUT");
      this.user = null;
      this.token = null;
      this.logged_in = false
      console.log("ROUTE: ", this.$route.path)
      if (this.$route.path != "/signin") {
        console.log("ROUTE: pushing /singing")
        router.push("/signin");
      }
    },

    complete_profile_popup() {
      this.$swal("Please complete your profile with an image, a bio and some tags.\nAnd validate your email.")
    }
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Michroma&display=swap");

.navbar {
  padding: 10px;
  background-image: linear-gradient(#f6c0ba, #facefb);
}

.navbar.darkk {
  background-image: linear-gradient(rgba(110, 110, 251, 0.526), rgb(13, 13, 138));
}

.nav-link, .navbar-brand {
  color: #2f62c9c2;
}

.nav-link:hover, .navbar-brand:hover {
  color: #2f62c9;
}


.navbar.darkk .nav-link, .navbar.darkk .navbar-brand{
  color: #f6c0ba;
}

.navbar.darkk .nav-link:hover, .navbar.darkk .navbar-brand:hover{
  color: #f6c0bab1;
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
