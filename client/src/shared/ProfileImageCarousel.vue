<template>
  <div class="carroussel_container">
    <b-carousel
      v-if="user_images.length != 0"
      ref="myCarousel"
      id="carousel-1"
      v-model="slide"
      :interval="0"
      :controls="user_images.length > 1"
      indicators
      background="#ababab"
      no-animation
      style="text-shadow: 1px 1px 2px #333"
    >
      <div v-for="url in user_images" :key="url">
        <b-carousel-slide class="carroussel_images" :img-src="url"></b-carousel-slide>
      </div>
    </b-carousel>
    <div v-if="!disabled">
        <div class="row">
        <div class="col fields" v-if="!no_space_left">
            <input hidden id="fileUpload" type="file" @change="UploadAndAddImage" />
            <button class="button_caroussel" @click="chooseFiles()"><b-icon-plus /> Add Image</button>
        </div>
        <div class="col-auto" v-if="!empty">
            <button id="trash" class="button_caroussel" @click="emitDeleteCurrentSlide"><b-icon-trash /></button>
            <b-tooltip target="trash" placement="top" triggers="hover">Delete image</b-tooltip>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import { uploadImage } from "../services/upload";

export default {
  props: {
    images: Array,
    disabled: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },

  data() {
    return {
      slide: 0,
    };
  },

  computed: {
    user_images: function () {
      return this.images.filter((im) => {
        return (im != undefined) & (im != null);
      });
    },

    no_space_left: function() {
        return (this.user_images.length == 4)
    },

    empty: function() {
        return (this.user_images.length == 0)
    },

    user_image_indexes: function () {
      let indexes = [];
      for (let i = 0; i < 4; i++) {
        if (this.images[i] != null) {
          indexes.push(i);
        }
      }
      return indexes;
    },
  },

  methods: {
    chooseFiles() {
      document.getElementById("fileUpload").click();
    },

    emitDeleteCurrentSlide() {
      this.$emit("DeleteImage", this.user_image_indexes[this.slide]);
    },

    EmitAddImage(image_url) {
      console.log("adding image: ", image_url);
      for (let i = 0; i < 4; i++) {
        if (this.images[i] == null) {
          this.$emit("AddImage", image_url, i);
          return i;
        }
      }
      console.log("EROOOOR IN ADDIMAGES");
    },

    async UploadAndAddImage(e) {
      const file = e.target.files[0];
      console.log("UPAAA; ", file);

      if (file == null) {
        console.log("WIERD SELECT NO FILE BUT CHANGE");
        return;
      } else {
        try {
          let upload_res = await uploadImage(
            this.$cookies.get("sekes_tokens"),
            file
          );
            this.EmitAddImage(upload_res.data.url);
        } catch (e) {
          console.log("ERR", e);
        }
      }
    },

    setSlide(index) {
        console.log("AB going to slide: " + index)
        this.$refs.myCarousel.setSlide(index)
    },

    mounted() {
      console.log("IM", this.user_images);
    },
  },
};
</script>

<style scoped>
@import url("../assets/profile.css");

.carroussel_images {
  object-fit: cover;
}


</style>
