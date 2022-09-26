

<template>
  <div>
    <tags-input element-id="tags"
    v-model="selectedTags"
    :existing-tags="existingTags"
    typeahead-hide-discard
    @tag-added="onTagAdded"
    @tag-removed="onTagRemoved"
    :typeahead="true"></tags-input>
  </div>
</template>

<script>
import { getAllTags }from '../services/tags'


export default {
  props: ['user_tags'],

  model: {
    prop: 'user_tags',
    event: 'change_selected_tags'
  },

  data() {
    return {
      selectedTags: this.tagTransform(this.user_tags),
      existingTags: [],
      currentUserTags: this.$cookies.get('user').tag_list
    }
  },

  computed: {
    rawSelectedTagList: function() {
      return this.selectedTags.map(o => {return o.value})
    }
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
    },

    tagTransform(tags) {
      return tags.map(o => {return {'key': o, 'value': o}})
    },

    onTagAdded() {
      this.$emit('change_selected_tags', this.rawSelectedTagList)
    },

    onTagRemoved() {
      this.$emit('change_selected_tags', this.rawSelectedTagList)
    },

    // async UpdateUserTags() {
      // try {
        // let res = await 
      // }
    // }
  },

  mounted() {
    this.getTags()
  }
}
</script>