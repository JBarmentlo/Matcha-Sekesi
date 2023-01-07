<template>
  <b-nav-item-dropdown right class="nav-link" :disabled="!numberNotifs" @hide="setSeen">
    <template slot="button-content">
        Notifs
        <b-icon-bell-fill :class="unreadNotifs ? 'active_notif' : 'unactive_notif'"/>
        <b-icon-circle-fill :class="unreadNotifs ? 'active_notif' : 'unactive_notif'" v-show="unreadNotifs" class = "active_notif"/>
    </template>
    <div v-for="notif in notifs" :key="notif.id">
          <b-dropdown-item  v-if="notif.seen == 1" variant="secondary" @click="deleteAndRedirect(notif.id, notif.source_user)">
            {{notifCardText(notif)}}<b-icon-x/>
          </b-dropdown-item>
          <b-dropdown-item v-else variant="primary" @click="deleteNoot(notif.index)">
            {{notifCardText(notif)}}<b-icon-x/>
          </b-dropdown-item>
      </div>
  </b-nav-item-dropdown>
</template>

<script>
import { getMyNotifs, setSeenNotifs, deleteNotifs }from '../services/notif'

export default {

data () {
  return {
    polling: null,
    notifs: [],
    offset: 0,
    limit: 100
  }
},

computed: {
  unreadNotifs() {
    return this.notifs.filter(n => n.seen == 0).length
  },

  numberNotifs() {
    return this.notifs.length
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
      try {
        let old_notif_ids = this.notifs.map(n => n.id)
        this.notifs = (await getMyNotifs(this.$cookies.get('sekes_tokens'), this.offset, this.limit)).data.data
        let new_notifs = this.notifs.filter(n => !old_notif_ids.includes(n.id))
        this.notifyUser(new_notifs)
      }
      catch (e) {
        this.stop_polling()
      }
      
    }, 1000)
  },

  notifyUser(notif_list) {
    if (notif_list.length != 0) {
      console.log("notify: ", notif_list)
      for (const notif of notif_list) {
        this.$notify({
          text: this.notifCardText(notif)
        });
      }
    }
  },

  notifCardText(notif) {
    const dic = {'LIKE': 'liked you.', "CONSULT": 'consulted your profile', "MATCH": 'matched you!', "UNMATCH": 'unmatched you.'}
    return notif.source_user + " " + dic[notif.type]
  },

  async setSeen() {
    await setSeenNotifs(this.$cookies.get('sekes_tokens') ,this.notifs.map(n => n.id))
    this.notifs = this.notifs.map(n => {return {...n, seen:1}})
  },

  async deleteNoot(id) {
    await deleteNotifs(this.$cookies.get('sekes_tokens'), id)
  },

  async deleteAndRedirect(id, username) 
  {
    this.deleteNoot(id)
    if (this.$route.path != "/profile/"+ username) {
      this.$router.push("/profile/"+ username)
    }
  },

  stop_polling() {
    console.log("stop polling notifs")
    clearInterval(this.polling)
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
  console.log("destroy notif handler")
  clearInterval(this.polling)
}

}
</script>

<style scoped>


.active_notif {
  color: red;
  width: 5%;
  margin-bottom: 3%;
  margin-right: 3%;
}

.unactive_notif {
  color: grey;
}

</style>