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
			if (this.selected_file == null) {
				this.message = "Please select a file"
			}
			else {
					try {
					await uploadImage(this.$root.store.state.token, this.selected_file)
					this.message = "Upload complete"
				}
				catch (e) {
					this.message = "Error"
					console.log("ERR", (e))
				}
				finally {
					this.selected_file = null
				}
			}
		}
	}
}
</script>