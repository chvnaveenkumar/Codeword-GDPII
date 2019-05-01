<!-- @author Naveen Kumar Chandaluri <S530742@nwmissouri.edu> -->
<!-- This is the change password page -->
<template>
  <div>
    <div class="container ">
        <div class="row">
        <div class="col-md-3 col-lg-3 col-xs-3 col-sm-3"></div>
        <div class="col-md-5 col-lg-5 col-xs-5 col-sm-5" style="margin-top:6em">
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
            <label for="inputPassword" class="col-md-5 col-lg-5 col-xs-5 col-sm-5 col-form-label">New Password:</label>
            <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
            <input type="password" class="form-control" placeholder="New Password" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}" v-on:keyup="validatePattern" title="Password should have (8-10) combination of Small, Large letters and numbers" v-model="newpassword">
    </div>
                  <div class="alert alert-danger" v-if="!validate && validateMsg" role="alert">
                      {{ validateMsg }}
            </div>
  </div>
    <div class="form-group row">
    <label for="inputPassword" class="col-md-5 col-lg-5 col-xs-5 col-sm-5">Confirm Password:</label>
    <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
      <input type="password" class="form-control" placeholder="Confirm Password" v-model="repeatPassword" v-on:keyup="validatePassword">
    </div>
  </div>
      <div class="alert alert-success " v-if="matchPassword" role="alert">
                      Password Matched successfully!!
    </div>
     <div class="alert alert-danger" v-else-if="matchPassword === false" role="alert">
                      Password not Matched!!
    </div>

  <div class="form-group row">
    <label class="col-lg-2 col-form-label"></label>
    <div class="col-lg-8">
    <button type="create" :disabled="!matchPassword" class="btn btn-success">Change Password</button>
    </div>
</div>
</form>
 <form @submit.prevent="changeLater">
    <button type="create" class="btn btn-success">Change Later</button>
 </form>
  </div></div></div></div>
  <div class="col-md-3 col-lg-3 col-xs-3 col-sm-3"></div>
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
      matchPassword: '',
      msg: '',
      validate: '',
      validateMsg: ''
    }
  },
  created () {
    console.log('password page')
  },
  methods: {
    changeLater () {
      var statusCheck = window.localStorage.getItem('status')
      console.log(statusCheck === 'true' || statusCheck === true)
      if (statusCheck === 'true' || statusCheck === true) {
        this.$router.push({ path: '/instructordashboard' })
      } else {
        this.$router.push({ path: '/studentdashboard' })
      }
    },
    changePassword () {
      this.msg = ''
      if (this.newpassword !== this.repeatPassword) {
        this.matchPassword = false
      } else {
        this.matchPassword = true
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
              var statusCheck = window.localStorage.getItem('status')
              console.log(statusCheck === 'true' || statusCheck === true)
              if (statusCheck === 'true' || statusCheck === true) {
                _this.$router.push({ path: '/instructordashboard' })
              } else {
                _this.$router.push({ path: '/studentdashboard' })
              }
            }, 1000)
          }
        })
      }
    },
    // This method will validate the password
    validatePassword: function (e) {
      if (this.newpassword === this.repeatPassword) {
        this.matchPassword = true
      } else {
        this.matchPassword = false
      }
    },
    validatePattern: function (e) {
      var tests = /^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20})$/.test(this.newpassword)
      if (!tests) {
        this.validate = false
        this.validateMsg = 'Password should have (8-20) combination of small, upper case letters and numbers.'
      } else {
        this.validate = true
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
