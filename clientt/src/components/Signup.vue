<template>
    <div class="vue-tempalte">
        <form @submit="signupFormSubmit">
            <h3>Sign Up</h3>
            <div class="form-group">
                <label>Username</label>
                <input  autocomplete="username" type="username" v-model="username" class="form-control form-control-lg"/>
            </div>

            <div class="form-group">
                <label>First Name</label>
                <input type="text" v-model="firstName" class="form-control form-control-lg"/>
            </div>

            <div class="form-group">
                <label>Last Name</label>
                <input type="text" v-model="lastName" class="form-control form-control-lg"/>
            </div>

            <div class="form-group">
                <label>Email address</label>
                <input type="email" v-model="mail" class="form-control form-control-lg" />
            </div>

            <div class="form-group pb-2">
                <label>Password</label>
                <input autocomplete="current-password" type="password" v-model="password" class="form-control form-control-lg" />
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
import inputValidate    from '../services/formValidate'
import {signup}         from '../services/auth.script'
import router           from '@/router'

    export default {
        data() {
            return {
                username    : 'jhonny',
                mail        : 'joepbarmentlo@gmail.com',
                password    : 'qwertasd',
                firstName   : 'useless',
                lastName    : 'useless'
            }
        },
        methods: {
            signupFormSubmit(e) {
                e.preventDefault()
                inputValidate.validateAllWithAlerts(this.username, this.mail, this.password)
                signup({username: this.username, mail: this.mail, password: this.password})
                .then(data => {
                    if (data.data.message == 'User was registered successfully!')
                    {
                        console.log("signed up")
                        router.push("/login")
                    }
                    else
                        console.log("wtf signup")
                        console.log(data.data.message)
                })
                .catch(err => {
                    console.log("error at signup %o", err.response.data)
                    alert(err.response.data.message)
                })
            }
        }
    }
</script>