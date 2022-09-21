<template>
	<div class="file">
		<form @submit.prevent="onSubmit" enctype="multipart/form-data">
			<div class = "fields">
				<label>Upload File</label> <br />
				<input
					type="file"
					@change="onFileSelect"
				>
			</div>
			<div class="fields">
				<button>Submit</button>
			</div>
			<div class="message">
				<h5>{{message}}</h5>
			</div>
		</form>
	</div>
</template>

<script>
import { uploadImage }from '../services/upload'

export default {
	name: 'FileUpload',

	data() {
		return {
			selected_file : null,
			message       : null,
		}
	},

	methods: {
		onFileSelect(e) {
			const file = e.target.files[0]
			this.selected_file = file
			console.log("file selected: ", this.selected_file)
		},

		async onSubmit() {
			try {
				await uploadImage(this.$cookies.get('sekes_tokens'), this.selected_file)
				this.message = "Upload complete"
			}
			catch {
				this.message = "Error"
				console.log("ERR")
			}
		}
	}
}
</script>