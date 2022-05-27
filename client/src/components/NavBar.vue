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
                        <router-link class="btn btn-outline-primary" to="/login">Sign in</router-link>
                    </li>
                    <li class="nav-item px-1">
                        <router-link class="btn btn-outline-primary" to="/">Sign up</router-link>
                    </li>
                </ul>
            </div>
            <div v-if="logged_in">
                <ul class="nav navbar-nav flex-row float-right">
					<li class="nav-item px-1">
                        <router-link class = "pr-3" to="/search"><img src = "../assets/search.png" height = "32"/></router-link>
                    </li>
                    <li class="nav-item px-1">
                        <router-link class = "pr-3" to="/profile"><img src = "../assets/profile.png" height = "32"/></router-link>
                    </li>
					<li class="nav-item px-1">
                        <router-link class = "pr-3" to="/"><img src = "../assets/message.png" height = "32"/></router-link>
                    </li>
					<li class="nav-item px-1">
                        <router-link class = "pr-3" to="/"><img src = "../assets/notification.png" height = "32"/></router-link>
                    </li>
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
import { getMyNotifs, setNotifViewed } from "../services/notifications.script";


export default {
    name    : "NavBar",

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
            if (this.$route.path != "/login")
                router.push("/login")
        }
    },

    mounted() {
        getMyNotifs(this.$cookies.get("user"))
        .then(notifRes => {
            this.notifs = notifRes.data
        })
    }
}
</script>



<style scoped>

</style>
