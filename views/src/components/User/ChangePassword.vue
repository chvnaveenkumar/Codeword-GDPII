<!-- @author Naveen Kumar Chandaluri <S530742@nwmissouri.edu> -->
<template>
  <div>
    <div class="container ">
        <div class="row">
        <div class="col-md-4 col-xs-0 col-sm-0"></div>
        <div class="col-md-5 col-xs-8 col-sm-8" style="margin-top:6em">
            <div class="card">
            <div class="card-body">
            <h2> Change Password</h2>  
            <div class="alert alert-success" v-if="changed && msg" role="alert">
                      {{ msg }}
                  </div>
                  <div class="alert alert-danger" v-else-if="!changed && msg" role="alert">
                      {{ msg }}
            </div>
            </div>
        <form @submit.prevent="changePassword">
            <div class="form-group row">
            <label for="inputPassword" class="col-lg-5 col-form-label">New Password:</label>
            <div class="col-lg-7">
            <input type="password" class="form-control" placeholder="New Password" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Password should have atleast 8 Small, Large character and numbers" v-model="newpassword">
    </div>
  </div>
    <div class="form-group row">
    <label for="inputPassword" class="col-lg-5 col-form-label">Confirm Password:</label>
    <div class="col-lg-7">
      <input type="password" class="form-control" placeholder="Confirm Password" v-model="repeatPassword" v-on:keyup="validatePassword">
    </div>
    <div class="alert alert-success" v-if="matchPassword" role="alert">
                      Password Matched successfully!!
    </div>
     <div class="alert alert-danger" v-if="matchPassword" role="alert">
                      Password not Matched!!
    </div>
  </div>
  <div class="form-group row">
    <label class="col-lg-5 col-form-label"></label>
    <button type="create" :disabled="matchPassword == true" class="btn btn-primary">Change Password</button>
</div>
</form>
  </div></div></div></div>
  <div class="col-md-3 col-lg-3 col-xs-1 col-sm-1"></div>
  </div>
</template>

<script>
export default {
  name: 'ChangePassword',
  data () {
    return {
      newpassword: '',
      repeatPassword: '',
      changed: '',
      loginrole: this.$route.params.loginrole,
      matchPassword: false
    }
  },
  created () {
    console.log('password page')
  },
  methods: {
    changePassword () {
      this.msg = ''
      /* global axios */
      axios({
        method: 'post',
        url: 'codeword/changepassword',
        data: {
          token: window.localStorage.getItem('token'),
          password: this.newpassword
        }
      }).then(res => {
        var _this = this
        if (res.data.message === true) {
          setTimeout(function () {
            this.msg = 'Changed Password Successfully!!'
            if (_this.loginrole === true) {
              _this.$router.push({ path: '/instructordashboard' })
            } else {
              _this.$router.push({ path: '/studentdashboard' })
            }
          }, 1000)
        }
      })
    },
    validatePassword: function (e) {
      if (this.newpassword === e) {
        this.matchPassword = true
      } else {
        this.matchPassword = false
      }
    }
  }
}
</script>

<style>
.settings-page {
  width: 600px;
  margin: 0 auto;
  padding: 30px 0;
}
</style>
