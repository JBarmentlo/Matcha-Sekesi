<template>
  <b-dropdown
    style="position: static"
    variant="link"
    toggle-class="text-decoration-none"
    no-caret
    @hide="setSeen"
    >
    <template #button-content>
    <span class="nav-item">Notifs<b-icon-bell-fill/><b-icon-circle-fill v-show="unreadNotifs > 0" class = "active_notif"/><b-icon-caret-down-fill class="caret"/></span>
    </template>
    <div v-for="notif in notifs" :key="notif.id">
      <b-dropdown-item  v-if="notif.seen == 1" variant="secondary" @click="deleteNoot(notif.id)"><p>
          {{notifCardText(notif)}}</p>
      </b-dropdown-item>
          <b-dropdown-item v-else variant="primary" @click="deleteNoot(notif.index)"><p>
          {{notifCardText(notif)}}</p>
      </b-dropdown-item>
    </div>
  </b-dropdown>
  <!-- <b-dropdown
      class="dropdown-1"
      :text="notifText"
      @hide="setSeen"
  >
      <div v-for="notif in notifs" :key="notif.id">
          <b-dropdown-item v-if="notif.seen == 1" variant="secondary" @click="deleteNoot(notif.id)">
              {{notifCardText(notif)}}
          </b-dropdown-item>
              <b-dropdown-item v-else variant="primary" @click="deleteNoot(notif.index)">
              {{notifCardText(notif)}}
          </b-dropdown-item>
      </div>
  </b-dropdown> -->
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

<style scoped>

.dropdown-menu {
  position: static;
  left: 50%;
}

.nav-item {
  text-decoration: none;
  color: white
}

.caret {
  max-height: 10px;
  margin-bottom: 3%;
}



.active_notif {
  color: red;
  width: 5%;
  margin-bottom: 3%;
  margin-right: 3%;
}

</style>