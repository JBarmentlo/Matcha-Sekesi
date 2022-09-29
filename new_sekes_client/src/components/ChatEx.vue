<template>
		<vue-advanced-chat
			height="calc(100vh - 20px)"
			:current-user-id="currentUserId"
			:rooms="JSON.stringify(rooms)"
			:rooms-loaded="true"
			:room_id="JSON.stringify('2')"
			:messages="JSON.stringify(messages)"
			:messages-loaded="messagesLoaded"
			@send-message="sendMessage($event.detail)"
			@fetch-messages="fetchMessages($event.detail)"
			ref="gato"
		/>
</template>

<script>
import { register } from 'vue-advanced-chat'
// import { register } from '../../vue-advanced-chat/dist/vue-advanced-chat.es.js'
register()
export default {
	data() {
		return {
			currentUserId: '1234',
			rooms: [
				{
					index: 2,
					roomId: '1',
					roomName: 'Room 1',
					avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
					users: [
						{ _id: '1234', username: 'John Doe' },
						{ _id: '4321', username: 'John Snow' }
					]
				},
				{
					index: 1,
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
			room: null
		}
	},
	methods: {
		fetchMessages({ room, options = {}}) {
			console.log("fetch")
			// console.log(this.$refs.gato)
			console.log(room, options)
			this.messagesLoaded = false
			setTimeout(() => {
				this.messages = [...this.messages, ...this.addMessages(true, room.roomId)]
				if (!options.reset) {
					console.log("loaded true")
					this.messagesLoaded = true
				}
				console.log("done")
				// console.log(this.$refs.gato)
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
		sendMessage( {content, roomId, files, replyMessage }) {
			console.log("MES: ", content, roomId, replyMessage)
			this.messages = [
				...this.messages,
				{
					_id: this.messages.length,
					content: content,
					senderId: this.currentUserId,
					timestamp: new Date().toString().substring(16, 21),
					date: new Date().toDateString(),
					files: files
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
		}
	},
	mounted() {
		// this.messages = this.addMessages(true)
	}
}
</script>

<style lang="scss">
body {
	font-family: 'Quicksand', sans-serif;
}
</style>