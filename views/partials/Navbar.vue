<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
        <div class="container">
            <a class="navbar-brand" href="/">Codeword</a>
            <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarResponsive"
                aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
             <div class="navbar-collapse collapse" id="navbarResponsive">
                <ul class="navbar-nav ml-auto" v-if="!auth">
                    <li class="nav-item">
                        <router-link to="/signup">Sign Up</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/">Sign In</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav ml-auto" v-if="auth">
                    <li class="nav-item" v-if='this.$route.name != "StudentDashboard" && this.$route.name !== "ChangePassword"'>
                        <router-link class="nav-link" to="/instructordashboard">Instructor Dashboard</router-link>
                    </li> 
                    <li class="nav-item" v-if='this.$route.name != "StudentDashboard" && this.$route.name !== "ChangePassword"'>
                        <router-link class="nav-link" to="/codewordset">CodeWord Sets</router-link>
                    </li>
                    <li class="nav-item" v-if='this.$route.name == "StudentDashboard" && this.$route.name !== "ChangePassword"'>
                        <h6><a class="navbar-brand" href="/">Student Dashboard</a></h6>
                    </li>
                    <li class="nav-item" >
                    <a class="nav-link" >{{email}}</a>
                    </li>
                    <li class="nav-item">
                          <a class="nav-link" @click.prevent="onLogout" >Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
import User from "@/services/auth";
export default {
  data() {
    return {
      auth: false,
      email: ""
    };
  },
  mounted () {
    this.auth = User.check();
    if (this.auth) {
      axios({
        method: "post",
        url: "codeword/details",
        headers: {
          token: window.localStorage.getItem("token")
        }
      }).then(result => {
        this.email = result.data.emailKey;
      });
    }
  },
  methods: {
    onLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('status')
      this.auth = User.check();
      this.$router.push({ path: "/" });
    },
    changePassword() {
      this.$router.push({ path: "/changePassword" });
    },
    createCodeWordSet() {
      this.$router.push({ path: "/createcodewordset" });
    },
     deleteCodeWordSet() {
      this.$router.push({ path: "/deletecodewordset" });
    }
  },
  watch: {
    $route(to, from, next) {
      this.auth = User.check();
    }
  }
};
</script>
<style>
li a {
  color: white;
  padding-left: 1em;
}
#dropdownMenuButton{
  color: white
}
.active {
  color:white
}
</style>
