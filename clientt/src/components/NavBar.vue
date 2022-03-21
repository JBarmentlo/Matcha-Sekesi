<template>
    <nav class="navbar shadow bg-white rounded justify-content-between flex-nowrap flex-row fixed-top">
        <div class="container">
        <a class="navbar-brand float-left" href="https://www.positronx.io" target="_blank">
            Sekesi.io
        </a>
        <ul class="nav navbar-nav flex-row float-right">
            <li class="nav-item px-1">
            <router-link class="btn btn-outline-primary" to="/login">Sign in</router-link>
            </li>
            <li class="nav-item px-1">
            <router-link class="btn btn-outline-primary" to="/">Sign up</router-link>
            </li>
        </ul>
        </div>
    </nav> 
</template>

<script>
export default {
    name: "NavBar"
}
</script>

<style scoped>
/* .navbar-nav > li{
  padding-left:5px;
  padding-right:5px;
} */
</style>

