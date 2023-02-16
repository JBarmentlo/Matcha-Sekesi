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
import { getMyNotifs, setSeenNotifs, deleteNotifs, getCurrentTime }from '../services/notif'

export default {

data () {
  return {
    polling: null,
    notifs: [],
    offset: 0,
    limit: 100,
    last_notif_time: null,
    first_query: true
  }
},

computed: {
  unreadNotifs() {
    return this.notifs.filter(n => n.seen == 0).length
  },

  numberNotifs() {
    return this.notifs.length
  },


  token: {
    get: function() {
      return this.$root.store.state.token;
    },
    set: function(sekes_token) {
      this.$root.store.setTokenAction(sekes_token);
    }
  }
},

methods: {
  pollData () {
    this.polling = setInterval(async () => {
      try {
        let old_notif_ids = this.notifs.map(n => n.id)
        this.notifs = (await getMyNotifs(this.token, this.offset, this.limit)).data.data
        let new_notifs = this.notifs.filter(n => !old_notif_ids.includes(n.id))
        new_notifs = new_notifs.filter(n => !n.seen)
        if (!this.first_query) {
          // console.log("NOOTI", new_notifs)
          this.notifyUser(new_notifs)
          this.first_query = false
        }
      }
      catch (e) {
        this.stop_polling()
      }
    }, 1000)
  },

  notifyUser(notif_list) {
    if (notif_list.length != 0) {
      console.log("notify handler: ", notif_list)
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
    await setSeenNotifs(this.token ,this.notifs.map(n => n.id))
    this.notifs = this.notifs.map(n => {return {...n, seen:1}})
  },

  async deleteNoot(id) {
    await deleteNotifs(this.token, id)
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
    let time = await getCurrentTime(this.token)
    console.log("TIMEEEEEE: ", time)
    let nooti = await getMyNotifs(this.token, this.offset, this.limit)
    this.notifs = nooti.data.data
    this.pollData()
  }
  catch (e) {
    console.log("no notifs")
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