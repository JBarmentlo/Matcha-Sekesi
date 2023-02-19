<template>
  <div>
    <img class="profile_pic" :src="profile_pic" :alt="profile_pic">
			<br/>
      <input
        hidden
        id="ProfilePicUpload"
        type="file"
        @change="UploadAndAddImage"
      >
      <span class="hovertext" @click="chooseFiles()" data-hover="Change Profile Pic">
      <b-iconstack class = "camera_container" font-scale="2">
        <b-icon stacked icon="circle" class="circle"></b-icon>
        <b-icon stacked icon="camera-fill" scale="0.67" class="camera"></b-icon>
      </b-iconstack>
      </span>
			<!-- <button class="button_profile" @click="chooseFiles()">Change Profile Pic</button> -->
  </div>
</template>

<script>
import { uploadImage }from '../services/upload'
// import { validate } from 'vee-validate';


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

  components: {
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
      // const acceptedImageTypes = ['image/webp', 'image/jpeg', 'image/png'];

      // if (!acceptedImageTypes.includes(file['type'])) {
      //   alert("We only accept the following image formats: webp, jpeg, png")
      //   console.log("not an image")
      //   return
      // }
      if (file == null) {
        console.log("WIERD SELECT NO FILE BUT CHANGE")
        return
      }
      else {
        try {
          let upload_res = await uploadImage(this.$root.store.state.token, file)
          this.$emit("upload_profile_pic", upload_res.data.url)
        }
        catch (e) {
          console.log("ERR in upload prof", e)
        }
      }
    },

    mounted() {
    }
  }
}
</script>

<style scoped>
@import url("../assets/profile.css");

img {
    width: 150px;
    height: 150px;
    -webkit-border-radius: 100px;
    -moz-border-radius: 100px;
    border-radius: 100px;
    object-fit: cover;
}

.camera_container {
  position: absolute;
  top: -25px;
  left: 25px;
}

.camera_container > * {
  color: rgb(53, 53, 53);
}

.hovertext {
  position: relative;
  border-bottom: 1px dotted black;
  cursor: pointer;
}

.hovertext:before {
  content: attr(data-hover);
  visibility: hidden;
  opacity: 0;
  width: 200px;
  background-color: rgb(67, 67, 71);
  color: white;
  text-align: center;
  border-radius: 5px;
  padding: 2px 0;
  transition: opacity 0.5s ease-in-out;

  position: absolute;
  z-index: 1;
  left: 10px;
  top: 110%;
}

.hovertext:hover:before {
  opacity: 1;
  visibility: visible;
}


</style>