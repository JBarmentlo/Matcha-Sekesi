<template>
		<vue-advanced-chat
			height="calc(100vh - 20px)"
			:current-user-id="currentUserId"
			:rooms="JSON.stringify(rooms)"
			:rooms-loaded="true"
			:room_id="JSON.stringify('2')"
			:messages="JSON.stringify(messages)"
			:messages-loaded="messagesLoaded"
			show-files=false
			show-audio=false
			show-reaction-emojis=false
			show-add-room=false
			message-actions=[]
			:theme="this.chat_light_or_dark"
			@send-message="sendMessage($event.detail[0])"
			@fetch-messages="fetchMessages($event.detail[0])"
			ref="gato"
		/>
</template>

<script>
import { register }                         from 'vue-advanced-chat'
import { getMyMessages, getConvo, sendMsg } from '../services/chat'
import { getMatches }                       from '../services/user'
register()
export default {
	data() {
		return {
			currentUserId: '1234',
			rooms: [
			],
			messages: [],
			messagesLoaded: false,
			rawMessages: [],
			polling: null
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

		chat_light_or_dark: {
            get: function() {
				if (this.$root.store.state.dark_mode_on) {
					return 'dark'
				}
				else {
					return 'light'
				}
            },
        }
    },

	methods: {
		fetchMessages({ room }) {
			console.log("fetch")
			this.messagesLoaded = false
			setTimeout(async () => {
				if (room == undefined) {
					this.messages = []
					this.messagesLoaded = true
					return
				}
				else {
					if (this.polling != null) {
						// console.log("stop poll: ", this.polling)
						clearInterval(this.polling)
					}
					this.messages = (await getConvo(this.token, room.roomName, 0, 100)).data.data.reverse().map(this.formatMsg)
					this.messagesLoaded = true
					this.pollRoom(room)
					return
				}
			})
		},

		usersToConvoId(one, two) {
			let short
			let long

			if (one.length <= two.length) {
				short = one
				long = two
			}
			else {
				short = two
				long = one
			}
			return `${short}${long.length}${long}`
		},

		sendMessage(message) {
			console.log("sending: ",message)
			this.messages = [
				...this.messages,
				{
					_id      : -1,
					content  : message.content,
					senderId : this.currentUserId,
					timestamp: new Date().toString().substring(16, 21),
					date     : new Date().toDateString()
				}
			]
			console.log(message.content.replace(new RegExp("'", "g"), "''"))
			console.log("romid", message.roomId)
			sendMsg(this.token, message.roomId , message.content.replace(new RegExp("'", "g"), "''"), this.usersToConvoId(this.currentUserId, message.roomId))
		},

		matchToRoom(match) {
			return {
				roomId: match.liker,
				roomName: match.liker,
				avatar: this.profilePicNull(match.profilePic),
				users: [
						{ _id: match.liker, username: match.liker },
						{ _id: match.matchee, username: match.matchee }
				]
			}
		},

		pollRoom (room) {
			this.polling = setInterval(async () => {
				let new_mesg = (await getConvo(this.token, room.roomName, 0, 100)).data.data.reverse().map(this.formatMsg)
				if (new_mesg.length > this.messages.length) {
					this.messages = (await getConvo(this.token, room.roomName, 0, 100)).data.data.reverse().map(this.formatMsg)
				}
			}, 1000)
		},


		profilePicNull(url) {
			if (url != null) {
				return url;
			}
			return require("../assets/empty_profile.png");
		},

		formatMsg(msg) {
			return {
					_id      : msg.id,
					content  : msg.msg,
					senderId : msg.sender,
					username : msg.sender,
					date     : msg.last_updated.slice(0, 10),
					timestamp: msg.last_updated.slice(11, 16)
			}
		}
	},
	async mounted() {
			this.rawMessages   = (await getMyMessages(this.token)).data.data.reverse()
			let matches        = (await getMatches(this.token)).data.data
			let new_rooms      = matches.map(m => this.matchToRoom(m))
            console.log(matches, new_rooms)
			this.rooms         = new_rooms
			this.currentUserId = this.user.username
	},

	beforeDestroy () {
		if (this.polling != null) {
			clearInterval(this.polling)
		}
	}
}
</script>



<style lang="scss">
body {
	font-family: 'Quicksand', sans-serif;
}
</style>