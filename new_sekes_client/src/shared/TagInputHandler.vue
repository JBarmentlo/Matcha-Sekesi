

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
    event: 'select_tag'
  },

  data() {
    return {
      selectedTags: this.tagTransform(this.user_tags),
      existingTags: []
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

    onTagAdded(slug) {
      console.log(`Tag added: ${slug}`);
    },

    onTagRemoved(slug) {
      console.log(`Tag removed: ${slug}`);
    },
  },

  mounted() {
    this.getTags()
  }
}
</script>