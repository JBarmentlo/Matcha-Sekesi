<template>
    <div>
    </div>
</template>
<script>
import { getCurrentTime }from '../services/notif'
import { getMyNewMessages, getMyMessages }from '../services/chat'

export default {
	data() {
		return {
            initialized : false,
            last_time   : null,
            polling     : null,
            busy        : false
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

        messages: {
			get: function() {
				return this.$root.store.state.messages;
			},
			set: function(messages) {
				this.$root.store.setMessagesAction(messages);
			}
        },
	},


    watch: {
        logged_in: function (val) {
            if (val) {
                console.log("Start Polling messages WATCH")
                this.StartPolling()
            }
            else {
                console.log("Stop Polling messages WATCH")
                this.stopPolling()
            }
        },
    },


	methods: {
		addMessage(message) {
			this.$root.store.addMessageAction(message)
		},

        notifyUserOfMessage(message) {
            this.$notify({
                text: message.senderId + " sent you a message!"
            });
		},

        addMessagesToSelf(message_list) {
            let old_ids = this.messages.map(n => n.id)
            for (const message of message_list) {
                if (old_ids.includes(message.id)) continue
                this.addMessage(message)
                this.notifyUserOfMessage(message)
            }
        },

        async StartPolling() {
            if (this.polling != null) {
                console.log("double poll")
                this.stopPolling()
            }
            this.polling = setInterval(async () => {
                console.log("Chat POLL")
                if (!this.logged_in) {
                    return
                }

                if (this.busy) {
                    return
                }

                this.busy = true

                if (this.initialized == false) {
                    await this.initialize()
                    this.initialized = true
                }

                else if (this.logged_in && this.initialize) {
                    await this.getMessages()
                }
                this.busy = false

            }, 2000)
        },

        async initialize() {
            console.log("CHAT INIT")
            try {
                let message_list = (await getMyMessages(this.token)).data.data
                if (message_list.length != 0) {
                    this.last_time = message_list[0].last_updated
                    this.messages  = message_list
                }
                else {
                    this.last_time = (await getCurrentTime(this.token)).data.server_time
                }
                console.log("Time", this.last_time)
            }
            catch (e) {
                console.log("no notifs")
            }
        },

        async getMessages() {
            console.log("CHAT GET")
            try {
                let new_messages = (await getMyNewMessages(this.token, this.last_time, 0, 20)).data.data
                new_messages = new_messages.filter(n => n.last_updated != this.last_time)
                if (new_messages.length != 0) {
                    console.log("new notchatifs time:", new_messages.map(n => n.last_updated))
                    this.last_time = new_messages[0].last_updated
                    this.addMessagesToSelf(new_messages)
                    console.log("new msg time: ", this.last_time , new_messages.length)
                }
            }
            catch (e) {
                console.log(e)
            }
        },

        stopPolling() {
            console.log("stop polling msgs")
            clearInterval(this.polling)
            this.polling = null
        },
    },

    beforeDestroy () {
		if (this.polling != null) {
			clearInterval(this.polling)
		}
	}
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