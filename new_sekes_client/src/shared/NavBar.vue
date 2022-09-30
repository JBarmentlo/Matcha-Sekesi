<template>
    <nav class="navbar shadow bg-white rounded justify-content-between flex-nowrap flex-row static-top">
        <div class="container">
			<!-- <router-link class = "navbar-brand float-left" to="/">Sekesi.io</router-link> -->
			<!-- Image and text -->
			<nav class="navbar navbar-light bg-light">
			<a class="navbar-brand" href="#">
				<img src="../assets/logo.png" width="30" height="30" class="d-inline-block align-top" alt="">
				Sekesi.io
			</a>
			</nav>
            <div v-if="!logged_in">
                <ul class="nav navbar-nav flex-row float-right">
                    <li class="nav-item px-1">
                        <router-link class="btn btn-outline-primary" to="/signin">Sign in</router-link>
                    </li>
                    <li class="nav-item px-1">
                        <router-link class="btn btn-outline-primary" to="/signup">Sign up</router-link>
                    </li>
                </ul>
            </div>
            <div v-if="logged_in">
                <ul class="nav navbar-nav flex-row float-right">
					<li class="nav-item px-1">
                        <router-link class = "pr-3" to="/getallusers"><img src = "../assets/search.png" height = "32"/></router-link>
                    </li>
                    <li class="nav-item px-1">
                        <router-link class = "pr-3" to="/editprofile"><img src = "../assets/profile.png" height = "32"/></router-link>
                    </li>
					<li class="nav-item px-1">
                        <router-link class = "pr-3" to="/cat"><img src = "../assets/message.png" height = "32"/></router-link>
                    </li>
					<li class="nav-item px-1">
                        <NotifHandler/>
                    </li>
                    <li class="nav-item px-1">
                    <li @click="logout" class="nav-item px-1">
                        <img  src = "../assets/logout.png" height = "32"/>
                    </li>
                </ul>
            </div>
        </div>
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

<style scoped>

</style>
