<template>
		<b-dropdown
				class="dropdown-1"
				:text="notifText"
				@show="setSeen"
		>
				<div v-for="(notif, index) in notifs" :key="notif.id" @click='F(index)'>
						<b-dropdown-item>
								{{notifCardText(notif)}}
						</b-dropdown-item>
				</div>
		</b-dropdown>
</template>

<script>
import { getMyNotifs, setSeenNotifs }from '../services/notif'

export default {

data () {
	return {
		polling: null,
		notifs: [],
		offset: 0,
		limit: 10
	}
},

computed: {
	unreadNotifs() {
		return this.notifs.filter(n => n.seen == 0).length
	},

	notifText() {
		if (this.unreadNotifs == 0) {
			return 'Nootifs'
		}
		else {
			return 'Nootifs (' + this.unreadNotifs + ')'
		}
	}
},

methods: {
	pollData () {
		this.polling = setInterval(async () => {
			let old_notif_ids = this.notifs.map(n => n.id)
			this.notifs = (await getMyNotifs(this.$cookies.get('sekes_tokens'), this.offset, this.limit)).data.data
			let new_notifs = this.notifs.filter(n => !old_notif_ids.includes(n.id))
			this.notifyUser(new_notifs)

		}, 3000)
	},

	notifyUser(notif_list) {
		if (notif_list.length != 0) {
			console.log("notify: ", notif_list)
		}
	},

	notifCardText(notif) {
		const dic = {'LIKE': 'liked you.', "CONSULT": 'consulted your profile', "MATCH": 'matched you!', "UNMATCH": 'unmatched you.'}
		return notif.source_user + " " + dic[notif.type]
	},

	async setSeen() {
		console.log("setSeen", this.notifs.map(n => n.id))
		await setSeenNotifs(this.$cookies.get('sekes_tokens') ,this.notifs.map(n => n.id))
		this.notifs = this.notifs.map(n => {return {...n, seen:1}})
	},

	F(e) {
		console.log("F")
		console.log(e)
	}
},

async mounted() {
	try {
		let nooti = await getMyNotifs(this.$cookies.get('sekes_tokens'), this.offset, this.limit)
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