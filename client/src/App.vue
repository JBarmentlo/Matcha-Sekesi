<template>
    <div v-if="store_loaded" id="app"
        :class="[dark_mode_on ? 'darkmode' : '']">
        <NavBar v-bind:logged_in="logged_in" @change-mode="enableDarkMode"/>
        <notifications/>
        <router-view />
        <NotifPoller/>
        <MsgPoller/>
    </div>
</template>




<script>
import NavBar from "./shared/NavBar.vue"
import NotifPoller from "./shared/NotifPoller.vue"
import MsgPoller from "./shared/MsgPoller.vue"

export default {
    name: 'App',

    components: {
        NavBar,
        NotifPoller,
        MsgPoller,
    },

    data() {
        return {
            messages        : null,
            polling         : null,
            chat_disabled   : true
        }
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

        dark_mode_on: {
            get: function() {
                return this.$root.store.state.dark_mode_on;
            },
            set: function(dark_mode_on) {
                this.$root.store.state.dark_mode_on = dark_mode_on;
            }
        },

        store_loaded() {
            return this.$root.store.initialized
        }
    },

    methods: {
        enableDarkMode(dark_mode_on) {
            this.dark_mode_on = dark_mode_on
        },
    },

    created() {
        console.log("Created App");
    },

    async mounted() {
    },

    beforeDestroy () {
        if (this.polling != null) {
            clearInterval(this.polling)
        }
    }
}
</script>




<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap");


:root {
  --font: Roboto, sans-serif;
  --textColor: #2f62c9c2;
    background-color: #fbd2fc;
}

:root #app.darkmode {
    --textColor: #f6c0ba;
    background-color: rgb(13, 13, 138);
}

#app {
    font-family: var(--font);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--textColor);
    background-color: #fbd2fc;
    letter-spacing: 2px;
}

#app.darkmode {
    background-color: rgb(13, 13, 138);
}



</style>
