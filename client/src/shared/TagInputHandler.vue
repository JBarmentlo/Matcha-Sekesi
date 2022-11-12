

<template>
  <div>
    <tags-input element-id="tags"
    v-model="selectedTags"
    :existing-tags="existingTags"
    typeahead-hide-discard
    @tag-added="onTagAdded"
    @tag-removed="onTagRemoved"
    :disabled="disabled"
    :typeahead="true"></tags-input>
  </div>
</template>

<script>
import { getAllTags, updateUserTags }from '../services/tags'


export default {
  props: {
    user_tags: Array,
    // only_existing_tags: {
    //   type: Boolean,
    //   default: () => {
    //     return false
    //   }
    // },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
  },

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
        let tags = res.data.data.map(o => {return {'key': o.tag, 'value': o.tag}})
        this.existingTags = this.existingTags.concat(tags)
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
      // updateUserTags(this.$cookies.get('sekes_tokens'), this.rawSelectedTagList)
    },

    onTagRemoved() {
      this.$emit('change_selected_tags', this.rawSelectedTagList)
    },

    addExistingTags(arr) {
      console.log(arr)
      console.log("RRR: ", arr.map(o => {return {'key': o.tag, 'value': o.tag}}))
      this.existingTags = this.existingTags.concat(arr.map(o => {return {'key': o, 'value': o}}))
    },


    async uploadTags() {
      console.log("Updloading tags")
      try {
        await updateUserTags(this.$cookies.get('sekes_tokens'), this.rawSelectedTagList)
      }
      catch (e) {
        console.log("ERROR in upload tags: ", e)
      }
    }
  },

  mounted() {
    this.getTags()
  }
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/@voerro/vue-tagsinput@2.7.1/dist/style.css");

</style>
