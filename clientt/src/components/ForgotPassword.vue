<template>
    <div class="vue-tempalte">
        <div v-if="!requestSent">
            <form @submit="onSubmit">
                <h3>Forgot Password</h3>
                <div class="form-group pb-3">
                    <label>Email address</label>
                    <input type="email" v-model="mail" class="form-control form-control-lg" />
                </div>
                <button type="submit" class="btn btn-dark btn-lg btn-block">Reset password</button>
            </form>
        </div>
        <div v-else>
            <div v-if="error">
                There was an error handling your request,
                please try again shortly.
            </div>
            <div v-else>
                An email was sent to {{mail}}. <br>
                Check your inbox to reset your password, the link is only valid for 15 minutes.
            </div>
        </div>
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