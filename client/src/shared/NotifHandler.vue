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
import { setSeenNotifs, deleteNotifs }from '../services/notif'

export default {

data () {
  return {
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
  async setSeen() {
    await setSeenNotifs(this.token, Object.keys(this.notifs))
    for (const id of Object.keys(this.notifs)) {
      this.$root.store.setSeenNotif(id)    
    }
  },

  async deleteNoot(id) {
    await deleteNotifs(this.token, id)
    this.$root.store.deleteNotification(id)
  },

  async deleteAndRedirect(id, username)
  {
    this.deleteNoot(id)
    if (this.$route.path != "/profile/"+ username) {
      this.$router.push("/profile/"+ username)
    }
  },
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