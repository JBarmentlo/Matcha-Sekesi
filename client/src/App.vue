<template>
    <div v-if="store_loaded" id="app"
        :class="[dark_mode_on ? 'darkmode' : '']">
        <NavBar @setLoggedIn="setLoggedIn" v-bind:logged_in="logged_in" @change-mode="enableDarkMode"/>
        <notifications/>
        <router-view @setLoggedIn="setLoggedIn"/>
        <NotifPoller/>
        <MsgPoller/>
    </div>
</template>




<script>
import { getMyMessages } from './services/chat'
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
            store_loaded    : false,
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
        }
    },

    watch: {
        logged_in: function (val) {
            if (val) {
                console.log("Start Polling notifs / messages")
                // this.startPollingMsg(1000)
                console.log("PUSHING editprofile")
                if (this.$route.requiresNotAuth) this.$route.push("/editprofile")
                
            }
            else {
                console.log("Stop Polling notifs / messages")
                clearInterval(this.polling)
                console.log("PUSHING signin")
                if (this.$route.requiresAuth) this.$route.push("/signin")
            }
        },
      },

    methods: {
        enableDarkMode(dark_mode_on) {
            this.dark_mode_on = dark_mode_on
        },
        
        async setLoggedIn(val) {
            throw("SETLOGGEDIN", val)
        },

        startPollingMsg(freq) {
            if (this.chat_disabled) return
            this.last_message_time = null
            let first_poll = true
            this.polling = setInterval(async () => {
                try {
                    if (this.messages == null) {
                        this.messages = (await getMyMessages(this.token, 0, 100)).data.data
                    }
                    else {
                        this.messages = (await getMyMessages(this.token, 0, 100)).data.data.reverse()
                        let new_messages = this.messages.filter(n => !(n.sender == this.user.username))
                        new_messages = new_messages.filter(n => Date.parse(n.last_updated) > this.last_message_time)

                        if (this.last_message_time == null && new_messages.length > 0) {
                            this.last_message_time = Date.parse(new_messages[0].last_updated)
                            console.log("Updated time first", this.last_message_time, new_messages[0])
                        }
                        if (!first_poll && new_messages.length > 0) {
                            this.notifyUser(new_messages)
                            this.last_message_time = Date.parse(new_messages[0].last_updated)
                            console.log("new time", Date.parse(new_messages[0].last_updated))
                        }
                        first_poll = false
                    }
                }
                catch(e) {
                    console.log("Interrrupted Msg polling", e)
                    clearInterval(this.polling)
                }

            }, freq)
            console.log(freq)
        },

        notifyUser(notif_list) {
            if (notif_list.length != 0) {
                // console.log("notify: ", notif_list)
                for (const notif of notif_list) {
                    this.$notify({
                        text: notif.sender + " sent you a message!"
                    });
                }
            }
        },
    },

    created() {
        console.log("Created App");
    },

    async mounted() {
        console.log("Mounting App");
        try {
            this.store_loaded = true
            // TODO: put it back ?
            // await updateUserStore()
            // console.log("starting state", "logged_in:", this.logged_in, "user:", this.user != null, "token:", this.token != null)
            // if (this.$route.meta.requiresNotAuth && this.logged_in) {
                // this.$router.push("/editprofile")
            // }
            // if (this.$route.meta.requiresAuth && !this.logged_in) {
                // this.$router.push("/signin")
            // }
        }
        catch (e) {
            console.log("error mounting app", e)
        }
        this.store_loaded = true
        console.log("App mounted");
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
