<template>
  <div>
		<img :src="profile_pic" :alt="user.username">
			
			<input
				hidden
				id="fileUpload"
				type="file"
				@change="UploadAndAddImage"
			>
			<button @click="chooseFiles()">Add Image</button>

  </div>
</template>

<script>
import { uploadImage }from '../services/upload'


export default {
  props: ['url'],
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
        document.getElementById("fileUpload").click()
    },

    EmitUpdateProfilePic(image_url) {
        console.log("adding image: ", image_url)
        for (let i = 0; i < 4; i++) {
            if (this.images[i] == null) {
              this.$emit("AddImage", image_url, i)
              return
            }
        }
        console.log("EROOOOR IN ADDIMAGES")
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
            // this.$emit("AddImage", upload_res.data.url)
            this.EmitAddImage(upload_res.data.url)
          }
          catch {
            console.log("ERR")
          }
        }
    },

    mounted() {
      console.log("IM", this.user_images)
    }
  }
}
</script>