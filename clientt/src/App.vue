<template>
  <div class="vue-tempalte">
    <!-- Navigation -->
    <NavBar/>
    <!-- Main -->
    <div class="App">
      <div class="vertical-center">
        <div class="inner-block">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue"

export default {
  name: 'App',
  components: {
    NavBar
  },
  data() {
    return {
      access_token: '',
      signature   : ''
    }
  },
  methods: {
    toggleAddTask() {
      this.showAddTask = !this.showAddTask
    },
  },
}
</script>