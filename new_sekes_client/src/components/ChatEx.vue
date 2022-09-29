<template>
		<vue-advanced-chat
			height="calc(100vh - 20px)"
			:current-user-id="currentUserId"
			:rooms="JSON.stringify(rooms)"
			:rooms-loaded="true"
			:room_id="JSON.stringify('2')"
			:messages="JSON.stringify(messages)"
			:messages-loaded="messagesLoaded"
			@send-message="sendMessage($event.detail[0])"
			@fetch-messages="fetchMessages($event.detail[0])"
			ref="gato"
		/>
</template>

<script>
import { register } from 'vue-advanced-chat'
import { getMyMessages, getConvo } from '../services/chat'
import { getMatches } from '../services/user'
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
					this.messages = (await getConvo(this.$cookies.get('sekes_tokens'), room.roomName, 0, 100)).data.data.reverse().map(this.formatMsg)
					this.messagesLoaded = true
					this.pollRoom(room)
					return
				}
			})
		},
		
		addMessages(reset, room_id) {
			const messages = []
			for (let i = 0; i < 30; i++) {
				messages.push({
					_id: reset ? i : this.messages.length + i,
					content: `${reset ? '' : 'paginated'} message ${room_id} ${i + 1}`,
					senderId: '4321',
					username: 'John Doe',
					date: '13 November',
					timestamp: '10:20'
				})
			}
			return messages
		},
		sendMessage(message) {
			this.messages = [
				...this.messages,
				{
					_id: this.messages.length,
					content: message.content,
					senderId: this.currentUserId,
					timestamp: new Date().toString().substring(16, 21),
					date: new Date().toDateString()
				}
			]
		},
		addNewMessage() {
			setTimeout(() => {
				this.messages = [
					...this.messages,
					{
						_id: this.messages.length,
						content: 'NEW MESSAGE',
						senderId: '1234',
						timestamp: new Date().toString().substring(16, 21),
						date: new Date().toDateString()
					}
				]
			}, 2000)
		},

		matchToRoom(match) {
			let short
			let long

			if (match.liker.length <= match.matchee.length) {
				short = match.liker
				long = match.matchee
			}
			else {
				short = match.matchee
				long = match.liker
			}
			return {
				roomId: `${short}${long.length}${long}`,
				roomName: match.matchee,
				avatar: match.profilePic,
				users: [
						{ _id: short, username: short },
						{ _id: long, username: long }
				]
			}
		},

		pollRoom (room) {
			this.polling = setInterval(async () => {
				this.messages = (await getConvo(this.$cookies.get('sekes_tokens'), room.roomName, 0, 100, true)).data.data.reverse().map(this.formatMsg)
			}, 1000)
			// console.log("start poll: ", this.polling)
		},

		formatMsg(msg) {
			return {
					_id: msg.id,
					content: msg.msg,
					senderId: msg.sender,
					username: msg.sender,
					date: msg.last_updated.slice(0, 10),
					timestamp: msg.last_updated.slice(11, 16)
			}
		}
	},
	async mounted() {
			this.rawMessages = (await getMyMessages(this.$cookies.get('sekes_tokens'))).data.data.reverse()
			let matches = (await getMatches(this.$cookies.get('sekes_tokens'))).data.data
			// console.log(matches)
			let new_rooms = matches.map(m => this.matchToRoom(m))
			this.rooms = new_rooms
			this.currentUserId = this.$cookies.get('user').username
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