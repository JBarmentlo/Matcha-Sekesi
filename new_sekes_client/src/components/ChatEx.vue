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
import { getMyMessages } from '../services/chat'
import { getMatches } from '../services/user'
register()
export default {
	data() {
		return {
			currentUserId: '1234',
			rooms: [
								{
					roomId: '1',
					roomName: 'Room 1',
					avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
					users: [
						{ _id: '1234', username: 'John Doe' },
						{ _id: '4321', username: 'John Snow' }
					]
				},
				{
					roomId: '2',
					roomName: 'Room 2',
					avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
					users: [
						{ _id: '12342', username: 'John Doe2' },
						{ _id: '43212', username: 'John Snow2' }
					]
				}
			],
			messages: [],
			messagesLoaded: false,
			rawMessages: []
		}
	},
	methods: {
		fetchMessages({ room }) {
			console.log("fetch")
			this.messagesLoaded = false
			setTimeout(() => {
				if (room == undefined) {
					this.messages = []
					this.messagesLoaded = true
					return
				}
				else {
					this.messages = this.rawMessages.filter(m => (m.sender == room.roomName || m.receiver == room.roomName)).map(this.formatMsg)
					this.messagesLoaded = true
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

		formatMsg(msg) {
			return {
					_id: msg.id,
					content: msg.msg,
					senderId: msg.sender,
					username: msg.sender,
					date: msg.last_updated.slice(0, 10),
					timestamp: msg.last_updated.slice(11, 19)
				}
		}
	},
    async mounted() {
        this.rawMessages = (await getMyMessages(this.$cookies.get('sekes_tokens'))).data.data.reverse()
        let matches = (await getMatches(this.$cookies.get('sekes_tokens'))).data.data
				console.log(matches)
				let new_rooms = matches.map(m => this.matchToRoom(m))
				this.rooms = new_rooms
				this.currentUserId = this.$cookies.get('user').username
    },
}
</script>



<style lang="scss">
body {
	font-family: 'Quicksand', sans-serif;
}
</style>