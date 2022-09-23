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
      <!-- Text slides with image -->
    <div v-for="url in image_urls" :key="url">
        <b-carousel-slide
            caption="First slide"
            text="Nulla vitae elit libero, a pharetra augue mollis interdum."
            :img-src=url
        ></b-carousel-slide>
    </div>

    </b-carousel>

    <p class="mt-4">
      Slide #: {{ slide }}<br>
      Sliding: {{ sliding }}
    </p>
    <button @click="EmitAddImage">
        Add Slide
    </button>
    <button @click="emitDeleteCurrentSlide" >
        Remove Slide
    </button>
  </div>
</template>

<script>
  export default {
    props: ['images'],
    data() {
      return {
        slide: 0,
        sliding: null,
        image_urls: this.images
      }
    },
    methods: {
        emitDeleteCurrentSlide() {
            this.$emit("DeleteImage", this.slide)
        },
        EmitAddImage() {
            this.$emit("AddImage")
        }
    },
    mounted() {
        console.log("IMAGEGE: ", this.image_urls)

    }
  }
</script>