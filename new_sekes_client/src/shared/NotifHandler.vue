<template>
		<b-dropdown
				class="dropdown-1"
				text="Nootifs"
		>
				<div v-for="(notif, index) in notifs" :key="notif.id" @click='F(index)'>
						<b-dropdown-item>
								{{notif.type}} {{notif.viewed}}
						</b-dropdown-item>
				</div>
		</b-dropdown>
</template>

<script>
import { getMyNotifs }from '../services/notif'

export default {

data () {
	return {
		polling: null,
		notifs: [],
		offset: 0,
		limit: 10
	}
},
methods: {
	pollData () {
		this.polling = setInterval(async () => {
			console.log("POlling notifs")
			this.notifs = (await getMyNotifs(this.$cookies.get('sekes_tokens'), this.offset, this.limit)).data.data
		}, 3000)
	},

	F(e) {
		console.log("F")
		console.log(e)
	}
},
async mounted() {
	try {
		let nooti = await getMyNotifs(this.$cookies.get('sekes_tokens'), this.offset, this.limit)
		console.log("noote: ", nooti)
		this.notifs = nooti.data.data
		this.pollData()
	}
	catch (e) {
		console.log("error in get notifs: ", e)
	}
},

beforeDestroy () {
	clearInterval(this.polling)
}

}
</script>