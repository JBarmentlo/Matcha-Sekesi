<template>
    <nav class="navbar shadow bg-white rounded justify-content-between flex-nowrap flex-row static-top">
        <div class="container">
            <a class="navbar-brand float-left" href="https://www.positronx.io" target="_blank">
                Sekesi.io
            </a>
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
                        <router-link class="btn btn-outline-primary" to="/profile">My Profile</router-link>
                    </li>
                    <li class="nav-item px-1">
                        <router-link class="btn btn-outline-primary" to="/search">Search</router-link>
                    </li>
                    <li class="nav-item px-1">
                        <button class="btn btn-outline-primary" @click="logout" >Log out</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav> 
</template>

<script>
import router from '@/router'
export default {
    name    : "NavBar",

    props   : {
        logged_in: Boolean
    },

    methods : {
        logout() {
            if (this.$cookies.isKey("user"))
                this.$cookies.remove("user")
            this.$emit("setLoggedIn", false)
            if (this.$route.path != "/login")
                router.push("/login")
        }
    }
}
</script>



<style scoped>
</style>
