<template>
	<nav class="navbar navbar-expand-sm navbar-dark">
    <routerLink to="/" class="navbar-brand">SEKESI</routerLink>
    <ul class="navbar-nav ms-auto" v-if="!logged_in">
        <li class="nav-item">
			<router-link to="/signin" class="nav-link">Sign in</router-link>
        </li>
        <li class="nav-item">
            <router-link to="/signup" class="nav-link" >Sign up</router-link>
        </li>
    </ul>
	<ul class="navbar-nav ms-auto" v-if="logged_in">
        <li class="nav-item">
            <router-link to="/getallusers" class="nav-link">Search <b-icon-search/></router-link>
        </li>
        <li class="nav-item">
            <router-link to="/editprofile" class="nav-link">Profile <b-icon-person-circle/></router-link>
        </li>
        <li class="nav-item">
            <router-link to="/cat" class="nav-link">Chat <b-icon-chat-text-fill /></router-link>
        </li>
        <li class="nav-item notifhandler">
            <NotifHandler />
        </li>
		<li class="nav-item">
            <router-link @click="logout"  to="/" class="nav-link">Logout <b-icon-arrow-bar-right /></router-link>
        </li>
    </ul>
</nav>

</template>


<script>
import router from '@/router'
import NotifHandler from "./NotifHandler.vue"

export default {
    name    : "NavBar",

    components: {
        NotifHandler,
    },

    props   : {
        logged_in: Boolean
    },

    data() {
        return {
            notifs: []
        }
    },

    methods : {
        logout() {
            if (this.$cookies.isKey("user"))
                this.$cookies.remove("user")
            this.$emit("setLoggedIn", false)
            if (this.$route.path != "/signin")
                router.push("/signin")
        },
    },


}
</script>

<style >

@import url('https://fonts.googleapis.com/css2?family=Michroma&display=swap');

.navbar {
    font-size: 120%;
    padding: 10px;
    /* background-color: #f9cdc3; */
	background-image: linear-gradient(#f6c0ba, #facefb)
}

.navbar * {
    color : #2f62c9c2
}


.navbar-brand {
    font-family: 'Michroma', sans-serif;
}


.nav-item {
    margin: 0 0 0 30px;
    letter-spacing: 2.5px;
	font-family: 'Roboto', sans-serif;
	text-transform: uppercase;
	font-size: 15px;
}

.notifhandler {
    margin: -5px -20px 0 20px;
}




</style>
