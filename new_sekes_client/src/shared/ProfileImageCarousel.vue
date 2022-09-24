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
    <div v-for="url in images" :key="url">
      <b-carousel-slide
            :img-src=url>
      </b-carousel-slide>
    </div>

  </b-carousel>

  <p class="mt-4">
    Slide #: {{ slide }}<br>
  </p>

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
        selected_file : null,
        message: null
      }
    },
    methods: {
        emitDeleteCurrentSlide() {
            this.$emit("DeleteImage", this.slide)
        },

        EmitAddImage() {
            this.$emit("AddImage")
        },

        async UploadAndAddImage(e) {
            const file = e.target.files[0]
            this.selected_file = file
            console.log("file selected: ", this.selected_file)
            if (this.selected_file == null) {
              console.log("WIERD SELECT NO FILE BUT CHANGE")
              return
            }
            else {
              try {
                let upload_res = await uploadImage(this.$cookies.get('sekes_tokens'), this.selected_file)
                console.log("RESII: ",upload_res)
                this.message = "Upload complete"
                this.$emit("AddImage", upload_res.data.url)
              }
              catch {
                this.message = "Error"
                console.log("ERR")
              }
              finally {
                this.selected_file = null
              }
            }
        }
    },
    mounted() {
        console.log("IMAGEGE: ", this.image_urls)

    }
  }
</script>