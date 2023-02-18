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
import { getMyNotifs, setSeenNotifs, deleteNotifs, getCurrentTime, getMyNewNotifs }from '../services/notif'

export default {

data () {
  return {
    polling: null,
    notifs: {},
    offset: 0,
    limit: 100,
    last_notif_time: null,
    first_query: true,
    time: null,
    disabled: true
  }
},

computed: {
  unreadNotifs() {
    let num = 0
    Object.keys(this.notifs).forEach(key => {
      num = num + 1 - this.notifs[key].seen
    });
    return num
  },

  numberNotifs() {
    return Object.keys(this.notifs).length
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
        let new_notifs = (await getMyNewNotifs(this.token, this.time, this.offset, this.limit)).data.data
        new_notifs = new_notifs.filter(n => n.last_updated != this.time)
        if (new_notifs.length != 0) {
          console.log(new_notifs.map(n => n.last_updated))
          this.time = new_notifs[0].last_updated
          this.addNotifsToSelf(new_notifs)
          this.notifyUser(new_notifs)
          console.log("new time: ", this.time , new_notifs.length)
        }
      }
      catch (e) {
        console.log(e)
        // this.stop_polling()
      }
    }, 2000)
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
    await setSeenNotifs(this.token, Object.keys(this.notifs))
    for (const id of Object.keys(this.notifs)) {
      this.notifs[id].seen = 1
    }
  },

  async deleteNoot(id) {
    await deleteNotifs(this.token, id)
    let tmp = {...this.notifs}
    delete tmp[id]
    this.notifs = tmp
    console.log('dekeke')
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
  },

  addNotifsToSelf(notif_list)
  {
    for (const notif of notif_list) {
      console.log("added:", notif)
      let notif_obj = {}
      notif_obj[notif.id] = notif
      this.notifs = Object.assign({}, this.notifs, notif_obj)
      this.notifs[notif.id] = notif
    }
  },
},

async mounted() {
  if (this.disabled) return

  try {
    let notif_list = (await getMyNotifs(this.token, this.offset, this.limit)).data.data
    if (notif_list.length != 0) {
      this.time = notif_list[0].last_updated
      this.addNotifsToSelf(notif_list)
    }
    else {
      this.time = (await getCurrentTime(this.token)).data.server_time
    }
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