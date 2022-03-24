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
                lastName    : 'useless',
                ip          : null
            }
        },
        methods: {
            signupFormSubmit(e) {
                // console.log("lol")
                // console.log(this.locate())
                // console.log("lol")
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
            },

            locate() {
                return {
                    geoplugin_city                  : geoplugin_city(),

                    geoplugin_region                : geoplugin_region(),

                    geoplugin_areaCode              : geoplugin_areaCode(),

                    geoplugin_dmaCode               : geoplugin_dmaCode(),

                    geoplugin_countryCode           : geoplugin_countryCode(),

                    geoplugin_countryName           : geoplugin_countryName(),

                    geoplugin_continentCode         : geoplugin_continentCode(),

                    geoplugin_latitude              : geoplugin_latitude(),

                    geoplugin_longitude             : geoplugin_longitude(),

                    geoplugin_currencyCode          : geoplugin_currencyCode(),

                    geoplugin_currencySymbol        : geoplugin_currencySymbol(),

                    geoplugin_currencyConverter     : geoplugin_currencyConverter()
                }
            }
        },
        created() {
            fetch('https://api.ipify.org?format=json')
            .then(x => x.json())
            .then(({ ip }) => {
                this.ip = ip;
                console.log(this.ip)
            });

            var scripts = ["http://www.geoplugin.net/javascript.gp"];
            scripts.forEach(script => {
                let tag = document.createElement("script");
                tag.setAttribute("src", script);
                document.head.appendChild(tag);
            });
        }
    }
</script>

  created() {

  }

  <style scoped>
* {
  box-sizing: border-box;
}
body {
  background: #2554FF !important;
  min-height: 100vh;
  display: flex;
  font-weight: 400;
}
body,
html,
.App,
.vue-tempalte,
.vertical-center {
  width: 100%;
  height: 100%;
}
.navbar-light {
  background-color: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
}
.vertical-center {
  display: flex;
  text-align: left;
  justify-content: center;
  flex-direction: column;    
}
.inner-block {
  width: 450px;
  margin: auto;
  background: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  padding: 40px 55px 45px 55px;
  border-radius: 15px;
  transition: all .3s;
}
.vertical-center .form-control:focus {
  border-color: #2554FF;
  box-shadow: none;
}
.vertical-center h3 {
  text-align: center;
  margin: 0;
  line-height: 1;
  padding-bottom: 20px;
}
label {
  font-weight: 500;
}
.forgot-password,
.forgot-password a {
  text-align: right;
  font-size: 13px;
  padding-top: 10px;
  color: #7a7a7a;
  margin: 0;
}
.forgot-password a {
  color: #2554FF;
}
.social-icons {
  text-align: center;
  font-family: "Open Sans";
  font-weight: 300;
  font-size: 1.5em;
  color: #222222;
}
.social-icons ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.social-icons ul li {
  display: inline-block;
  zoom: 1;
  width: 65px;
  vertical-align: middle;
  border: 1px solid #e3e8f9;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
  margin-right: 5px;
  background: #f4f6ff;
}
.social-icons ul li a {
  display: block;
  font-size: 1.4em;
  margin: 0 5px;
  text-decoration: none;
}
.social-icons ul li a i {
  -webkit-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  -o-transition: all 0.2s ease-in;
  -ms-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
}
.social-icons ul li a:focus i,
.social-icons ul li a:active i {
  transition: none;
  color: #222222;
}
</style>