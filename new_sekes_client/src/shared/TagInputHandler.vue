

<template>
  <div>
		<tags-input element-id="tags"
		v-model="selectedTags"
		:existing-tags="existingTags"
		typeahead-hide-discard
		:typeahead="true"></tags-input>
  </div>
</template>

<script>
import { getAllTags }from '../services/tags'


export default {
  props: ['user_tags'],
  data() {
    return {
			selectedTags: [],
			existingTags: []
    }
  },

  computed: {
  },

  methods: {
		async getTags() {
			try {
				let res = await getAllTags(this.$cookies.get('sekes_tokens'))
				this.existingTags = res.data.data.map(o => {return {'key': o.tag, 'value': o.tag}})
			}
			catch (e) {
				console.log("error getting all tags")
			}
		}
  },

	mounted() {
		this.getTags()
	}
}
</script>