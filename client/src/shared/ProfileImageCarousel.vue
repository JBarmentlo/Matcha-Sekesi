<template>
	<div>
		<b-carousel
			v-if="user_images.length != 0"
			id="carousel-1"
			v-model="slide"
			:interval="0"
			controls
			indicators
			background="#ababab"
			img-width="1024"
			img-height="480"
			no-animation
			style="text-shadow: 1px 1px 2px #333"
		>
			<div v-for="url in user_images" :key="url">
				<b-carousel-slide class="carroussel_images" :img-src="url"> </b-carousel-slide>
			</div>
		</b-carousel>
    <div v-if="!disabled">
      <div class="fields">
        <!-- <label>Add Image</label> <br /> -->
        <input hidden id="fileUpload" type="file" @change="UploadAndAddImage" />
        <button class = "button_caroussel" @click="chooseFiles()"><b-icon-plus/>  Add Image</button>
      </div>

      <button class= "button_caroussel" @click="emitDeleteCurrentSlide"><b-icon-trash/>  Remove Image</button>
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
					return;
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
					// this.$emit("AddImage", upload_res.data.url)
					this.EmitAddImage(upload_res.data.url);
				} catch {
					console.log("ERR");
				}
			}
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
	min-width: 300px;
	max-width: 600px;
	max-height: 500px;
	object-fit: cover;
}

</style>