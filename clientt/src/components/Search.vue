<template>
	<profile-list :users="users"></profile-list>
</template>

<script>
import ProfileList from './ProfileList.vue'

export default {
	components: { ProfileList },
	data() {
		return {
			users: []
		}
	}
}
</script>

<style scoped>

</style>