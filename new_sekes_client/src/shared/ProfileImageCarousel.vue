<template>
  <div>
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="4000"
      controls
      indicators
      background="#ababab"
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333;"
    >
    <div v-for="url in user_images" :key="url">
      <b-carousel-slide
            :img-src=url>
      </b-carousel-slide>
    </div>
  </b-carousel>


	<form enctype="multipart/form-data">
			<div class = "fields">
				<label>Add Image</label> <br />
				<input
					type="file"
					@change="UploadAndAddImage"
				>
			</div>
		</form>

    <button @click="emitDeleteCurrentSlide" >
        Remove Image
    </button>
  </div>
</template>

<script>
import { uploadImage }from '../services/upload'


export default {
  props: ['images'],
  data() {
    return {
      slide: 0,
      image_urls: this.images,
    }
  },

  computed: {
      user_images: function() {
        return this.images.filter((im) => {return (im != undefined & im != null)})
      },

      user_image_indexes: function() {
        let indexes = []
        for (let i = 0; i < 4; i++) {
            if (this.images[i] != null) {
                indexes.push(i)
            }
        } 
        return indexes
      }
  },

  methods: {
      emitDeleteCurrentSlide() {
          this.$emit("DeleteImage", this.user_image_indexes[this.slide])
      },

      EmitAddImage(image_url) {
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