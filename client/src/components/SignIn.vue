<template>
	<div class="center pt-5">
		<div v-if="status != 'SUCCESS'">
			<form @submit="submitLoginForm">
				<h3>SIGN IN</h3>
				<div class="form-group">
					<label>Username</label>
					<input
						type="text"
						v-model="username"
						class="form-control form-control-lg"
					/>
					<div v-if="wrongUser" class="login_error">User doesn't exist</div>

				</div>
				<div class="form-group pb-3">
					<label>Password</label>
					<div class = "input-group">
					<input
						:type="visible ? 'text' : 'password'"
						v-model="password"
						class="form-control form-control-lg"
					/>
					<span class="input-group-btn form-control">
						<button class="btn m-0" v-on:click="password_visibility" type="button">
						<b-icon-eye-fill v-if="!visible"></b-icon-eye-fill>
						<b-icon-eye-slash-fill v-else></b-icon-eye-slash-fill>
						</button>
					</span>
					</div>
					<div v-if="wrongPass" class="login_error">Wrong Password</div>
				</div>
				<button type="submit" class = "button_submit">
					Sign In
				</button>
				<div>
					<p>Or</p>
				<b-button class="mt-3 loginBtn loginBtn--42" href='https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ed770153aaf57b2adf7cc62cc3c5d3014088889adbbfb5d2373d57a7b95c9fc6&redirect_uri=https%3A%2F%2Fmatcha.yoopster.com%2Fapi%2Fauth%2Foauth%2F&response_type=code'>
						Sign in with 42
				</b-button>
				</div>
				<p class="forgot-password text-right mt-2 mb-4">
					<router-link :to="{ name: 'Forgot Password' }">Forgot password ?</router-link>
				</p>
			</form>
		</div>
		<div v-else>
			<div class="form-group">
				Logged In !
			</div>
		</div>
	</div>
</template>

<script>
import { signin } from "../services/auth";

export default {
	data() {
		return {
			username: "",
			password: "",
			status: "",
			visible: false
		};
	},

	computed: {
		wrongPass() {
			return this.status == 'WRONG_PASSWORD'
		},
		wrongUser() {
			return this.status == 'MISSING_USERNAME'
		}
	},

	methods: {
		async submitLoginForm(e) {
			console.log("login in form submit");
			e.preventDefault();
			try {
				let signin_res = await signin({
					username: this.username,
					password: this.password
				})
				console.log("data: ",signin_res.data)
				this.status = signin_res.data.code
				if (signin_res.data.code == 'SUCCESS') {
					console.log("sekes_tokens_cookie set to : ", (({ accessToken, signature }) => ({ accessToken, signature }))(signin_res.data))
					console.log("user cookie set to: ", signin_res.data.user)
					this.$cookies.set("user", {...signin_res.data.user})
					this.$cookies.set("sekes_tokens",  (({ accessToken, signature }) => ({ accessToken, signature }))(signin_res.data))
					this.$emit('setLoggedIn', true)
					this.$router.push('/editprofile')
				}
			}
			catch (e) {
				console.log("error in signin form submit: ", e)
				// throw(e)
			}

		},
		password_visibility() {
			this.visible = !this.visible
		},
	},
};
</script>

<style scoped>
@import url("../assets/login.css");

.password > input {
	width: 80%;
}

.loginBtn {
    box-sizing: border-box;
    position: relative;
    padding: 0 15px 0 46px;
    border: none;
    text-align: left;
    line-height: 34px;
    font-size: 13px;
    color: #FFF;
}

.loginBtn:before {
	content: "";
	box-sizing: border-box;
	position: absolute;
	top: 0;
	left: 0;
	width: 34px;
	height: 100%;
}

.loginBtn:focus {
	outline: none;
}
.loginBtn:active {
	box-shadow: inset 0 0 0 32px rgba(0,0,0,0.1);
}

.loginBtn--42 {
/*font-family: "Roboto", Roboto, arial, sans-serif;*/
	background: #fef8f7;
	color: black;
	width: 55%;
}
.loginBtn--42:before {
	border-right: #c0bcbc 1px solid;
	background : url('https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg?uselang=fr');
	background-size: 70%;
	background-repeat: no-repeat;
	background-position: 50%;
}

.loginBtn--42:hover, .loginBtn--42:focus {
    background-color: #f3eceb;
    background-image: linear-gradient(#e3e5e5, #c7c7c7e4);
}


</style>