<template>
    <div class="vue-tempalte">
        <form @submit="onSubmit">
            <h3>Forgot Password</h3>
            <div class="form-group pb-3">
                <label>Email address</label>
                <input type="email" v-model="mail" class="form-control form-control-lg" />
            </div>
            <button type="submit" class="btn btn-dark btn-lg btn-block">Reset password</button>
        </form>
    </div>
</template>
<script>
import {requestReset} 		from '../services/auth.script'
import inputValidate  from "../services/formValidate";

    export default {
        data()  {
            return {
                requestSent : false,
                error       : false,
                mail        : "joepbarmentlo@gmail.com"
            }
        },

        props   : {

        },
        
        methods : {
            onSubmit(e) {
                console.log("requestin reset")
                e.preventDefault();
                if (!inputValidate.validateMail(this.mail))
                {
                    alert("enter a valid email pls")
                    return
                }
                requestReset(this.mail)
                .then(res => {
                    this.requestSent = true
                })
                .catch(ett => {
                    this.error = true
                })
            }
        }
    }
</script>