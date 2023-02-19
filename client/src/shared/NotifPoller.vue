<template>
    <div>
    </div>
</template>
<script>
import { getMyNotifs, getCurrentTime, getMyNewNotifs }from '../services/notif'

export default {
	data() {
		return {
            initializedNotifs : false,
            last_notif_time   : null,
            notifPolling      : null,
            notifBusy         : false
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
        notifications: {
			get: function() {
				return this.$root.store.state.notifications;
			},
			set: function(notifications) {
				this.$root.store.setNotificationsAction(notifications);
			}
		},
	},


    watch: {
        logged_in: function (val) {
            if (val) {
                // console.log("Start Polling notifs WATCH")
                this.StartPollingNotifications()
            }
            else {
                // console.log("Stop Polling notifs WATCH")
                this.stopPollingNotifs()
            }
        },
    },


	methods: {
        addNotification(notification) {
			this.$root.store.addNotificationAction(notification)
		},

        notifCardText(notif) {
            const dic = {'LIKE': 'liked you.', "CONSULT": 'consulted your profile', "MATCH": 'matched you!', "UNMATCH": 'unmatched you.'}
            return notif.source_user + " " + dic[notif.type]
        },

        notifyUserOfNotif(notif) {
            this.$notify({
                text: this.notifCardText(notif)
            });
        },

        addNotifsToSelf(notif_list) {
            let old_ids = this.notifications.map(n => n.id)
            for (const notif of notif_list) {
                if (old_ids.includes(notif.id)) continue

                this.addNotification(notif)
                this.notifyUserOfNotif(notif)
            }
        },

        async StartPollingNotifications() {
            if (this.notifPolling != null) {
                // console.log("double poll")
                this.stopPollingNotifs()
            }
            this.notifPolling = setInterval(async () => {
                // console.log("NOTIF POLL")
                if (!this.logged_in) {
                    return
                }

                if (this.notifBusy) {
                    return
                }

                this.notifBusy = true

                if (this.initializedNotifs == false) {
                    await this.initializeNotifs()
                    this.initializedNotifs = true
                }

                else if (this.logged_in && this.initializeNotifs) {
                    await this.getNotifs()
                }
                this.notifBusy = false

            }, 1000)
        },

        async initializeNotifs() {
            // console.log("NOTIF INIT")
            try {
                let notif_list = (await getMyNotifs(this.token, 0, 20)).data.data
                if (notif_list.length != 0) {
                    this.last_notif_time = notif_list[0].last_updated
                    this.notifications   = notif_list
                }
                else {
                    this.last_notif_time = (await getCurrentTime(this.token)).data.server_time
                }
            }
            catch (e) {
                console.log("no notifs")
            }
        },

        async getNotifs() {
            // console.log("NOTIF GET")
            try {
                let new_notifs = (await getMyNewNotifs(this.token, this.last_notif_time, 0, 20)).data.data
                new_notifs = new_notifs.filter(n => n.last_updated != this.last_notif_time)
                if (new_notifs.length != 0) {
                    // console.log("new notifs time:", new_notifs.map(n => n.last_updated))
                    this.last_notif_time = new_notifs[0].last_updated
                    this.addNotifsToSelf(new_notifs)
                    // console.log("new notif time: ", this.last_notif_time , new_notifs.length)
                }
            }
            catch (e) {
                console.log(e)
            }
        },

        stopPollingNotifs() {
            console.log("stop polling notifs")
            clearInterval(this.notifPolling)
            this.notifPolling = null
        },
    },

	async mounted() {
	},
    
};
</script>

<style scoped>
@import url("../assets/login.css");

.password > input {
	width: 80%;
}

.loginBtn {
    box-sizing: border-box;
    position: relative;
    padding: 0 15px 0 46px;
    border: none;
    text-align: left;
    line-height: 34px;
    font-size: 13px;
    color: #FFF;
}

.loginBtn:before {
	content: "";
	box-sizing: border-box;
	position: absolute;
	top: 0;
	left: 0;
	width: 34px;
	height: 100%;
}

.loginBtn:focus {
	outline: none;
}
.loginBtn:active {
	box-shadow: inset 0 0 0 32px rgba(0,0,0,0.1);
}

.loginBtn--42 {
/*font-family: "Roboto", Roboto, arial, sans-serif;*/
	background: #fef8f7;
	color: black;
	width: 55%;
}
.loginBtn--42:before {
	border-right: #c0bcbc 1px solid;
	background : url('https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg?uselang=fr');
	background-size: 70%;
	background-repeat: no-repeat;
	background-position: 50%;
}

.loginBtn--42:hover, .loginBtn--42:focus {
    background-color: #f3eceb;
    background-image: linear-gradient(#e3e5e5, #c7c7c7e4);
}


</style>