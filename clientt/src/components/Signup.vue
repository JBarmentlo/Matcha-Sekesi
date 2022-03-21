<template>
    <div class="vue-tempalte">
        <form @submit="loginFormSubmit">
            <h3>Sign Up</h3>
            <div class="form-group">
                <label>Username</label>
                <input type="text" v-model="username" class="form-control form-control-lg"/>
            </div>
            <div class="form-group">
                <label>Email address</label>
                <input type="email" v-model="mail" class="form-control form-control-lg" />
            </div>
            <div class="form-group pb-2">
                <label>Password</label>
                <input type="password" v-model="password" class="form-control form-control-lg" />
            </div>
            <button type="submit" class="btn btn-dark btn-lg btn-block">Sign Up</button>
            <p class="forgot-password text-right">
                Already registered 
                <router-link :to="{name: 'login'}">sign in?</router-link>
            </p>
        </form>
    </div>
</template>
<script>
import inputValidate from '../services/formValidate'

    export default {
        data() {
            return {
                username: '',
                mail    : '',
                password: '',
            }
        },
        methods: {
            loginFormSubmit(e) {
                e.preventDefault()
                inputValidate.validateAllWithAlerts(this.username, this.mail, this.password)
            }
        }
    }
</script>