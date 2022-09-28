<template>
  <div>
		<img :src="profile_pic" :alt="profile_pic">
			<br/>
			<input
				hidden
				id="ProfilePicUpload"
				type="file"
				@change="UploadAndAddImage"
			>
			<button @click="chooseFiles()">Change Profile Pic</button>

  </div>
</template>

<script>
import { uploadImage }from '../services/upload'


export default {
  props: ['url'],
  
  model: {
    prop: 'url',
    event: 'upload_profile_pic'
  },

  data() {
    return {
    }
  },

  computed: {
		profile_pic: function() {
				if (this.url != null) {
						return this.url
				}
				return require("../assets/empty_profile.png")
		}
  },

  methods: {
    chooseFiles() {
        document.getElementById("ProfilePicUpload").click()
    },

    EmitUpdateProfilePic(image_url) {
        this.$emit("upload_profile_pic", image_url)
    },

    async UploadAndAddImage(e) {
        const file = e.target.files[0]
        if (file == null) {
          console.log("WIERD SELECT NO FILE BUT CHANGE")
          return
        }
        else {
          try {
            let upload_res = await uploadImage(this.$cookies.get('sekes_tokens'), file)
            this.$emit("upload_profile_pic", upload_res.data.url)
          }
          catch {
            console.log("ERR")
          }
        }
    },

    mounted() {
    }
  }
}
</script>

<style scoped>

img {
    width: 90px;
    height: 90px;
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
    border-radius: 100px;
}

</style>