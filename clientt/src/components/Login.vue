<template>
  <div class="vue-tempalte">
    <form @submit="submitLoginForm">
      <h3>Sign In</h3>
      <div class="form-group">
        <label>Username</label>
        <input
          type="text"
          v-model="username"
          class="form-control form-control-lg"
        />
      </div>
      <div class="form-group pb-3">
        <label>Password</label>
        <input
          type="password"
          v-model="password"
          class="form-control form-control-lg"
        />
      </div>
      <button type="submit" class="btn btn-dark btn-lg btn-block">
        Sign In
      </button>
      <p class="forgot-password text-right mt-2 mb-4">
        <router-link to="/forgot-password">Forgot password ?</router-link>
      </p>
    </form>
  </div>
</template>
<script>
import inputValidate  from "../services/formValidate";
import { login }      from "../services/auth.script";
import router         from "@/router";
import Vue            from "vue";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    submitLoginForm(e) {
      console.log("loginin");
      e.preventDefault();
      if (
        !inputValidate.validateUserName(this.username) ||
        !inputValidate.validatePassword(this.password)
      )
        alert("KAPUT HANDLE THIS BETTERS");
      login({ username: this.username, password: this.password })
        .then((data) => {
          console.log(data.data);
          console.log("logged in");
          this.$cookies.set("user", data);
          this.$emit('setLoggedIn', true)

          //   router.push("/login");
        })
        .catch((err) => {
          console.log("error at signin %o", err.response.data);
          alert(err.response.data.message);
        });
    },
  },
  created() {
    console.log("Created");
    if (
      this.$cookies.isKey("user") &&
      this.$cookies.get("user").data.id != null
    ) {
      console.log("already logged in by cookie");
      this.$emit("setLoggedIn", true)
      // router.push("/profile");
    }
  },
};
</script>

