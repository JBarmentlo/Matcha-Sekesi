<template>
<div class="center">
	<div class="inner-block">
		<form @submit.prevent="generateUsers">
			<h3>PopulateDb</h3>
			<div class="form-group">
				<label>Number of users to generate</label>
				<input
					type="text"
					v-model="n_user"
					class="form-control form-control-lg"
				/>
			</div>
		<div class="pt-5">
			<label>Tags to pick from</label>
			<TagInputHandler ref="tagger" v-model="tags"/>
		</div>
		
			<div class="form-group pt-5">
				<label>Number of likes per user to generate</label>
				<input
					type="text"
					v-model="n_likes_per_user"
					class="form-control form-control-lg"
				/>
			</div>

			<div class="form-group pt-5">
				<label>Number of consults per user to generate</label>
				<input
					type="text"
					v-model="n_consults_per_user"
					class="form-control form-control-lg"
				/>
			</div>

			<div class="form-group pt-5">
				<label>Number of blocks per user to generate</label>
				<input
					type="text"
					v-model="n_blocks_per_user"
					class="form-control form-control-lg"
				/>
			</div>

			<button type="submit" class="btn btn-dark btn-lg btn-block">
				Genesiiis
			</button>
		</form>
	</div>
</div>
</template>

<script>
import { createRandomUsers, createRandomlikes, createRandomConsults, createRandomblocks } from "../services/test.js";
import TagInputHandler from '../shared/TagInputHandler.vue'
// import {} from '../services/user/g'

export default {
	components: {
		TagInputHandler
	},

	data() {
		return {
			tags: ["Music","Sekes","Travel","Web Dev","Alcoolic","Laughing","Gourmet","Cofee","Sunshine"],
			n_user: 500,
			n_likes_per_user: 10,
			n_blocks_per_user: 2,
			n_consults_per_user: 3,
		};
	},
	methods: {
		async generateUsers() {
			console.log("generating users")
			try {
				let returns = await createRandomUsers(this.n_user, this.tags)
				console.log("Users Created: ", returns)
				let rets = await createRandomlikes(1, this.n_likes_per_user)
				console.log("Likes created: ", rets)
				await createRandomConsults(1, this.n_consults_per_user)
				console.log("Consults created")
				await createRandomblocks(1, this.n_blocks_per_user)
				console.log("Blocks created: ", rets)
			}
			catch(err) {
				console.log("create user error: %o" , err)
			}
		},
	},
	mounted() {
		this.$refs.tagger.addExistingTags(["Music","Sekes","Travel","Web Dev","Alcoolic","Laughing","Gourmet","Cofee","Sunshine"])
	},
};
</script>

