<!-- @author Naveen Kumar Chandaluri <S530742@nwmissouri.edu> -->
<template>
  <div>
    <div class="container ">
        <div class="row">
        <div class="col-md-4 col-lg-4 col-xs-4 col-sm-4"></div>
        <div class="col-md-4 col-lg-4 col-xs-4 col-sm-4" style="margin-top:5em">
            <div class="card">
                <div class="card-body">
                    <form @submit.prevent="OnRegister">
                       <div class="alert alert-success" v-if="signed && msg" role="alert">
                      {{ msg }}
                       </div>
                      <div class="alert alert-danger" v-else-if="!signed && msg" role="alert">
                      {{ msg }}
                      </div>
                          <h2> Register</h2>
                              <div class="form-group">
                                  <input type="email" class="form-control" placeholder="Enter email" required="required" title="Please enter proper Email ID" pattern="\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+" v-model="email">
                              </div>
                              <div class="form-group">
                                    <input type="password" class="form-control" placeholder="Password" required
                                        v-model.lazy="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter">
                              </div>
                              <div class="form-group">
                                    <input type="password" class="form-control" placeholder="Confirm Password" @input="validate" required>
                                    <p></p>
                                    <p v-if="passwordstatus == false && status == true" class="alert alert-danger"> Password not matched </p>
                                    <p v-if="passwordstatus == true && status == true" class="alert alert-info"> Password matched </p>
                              </div>
                              <div class="form-group">
                                    <input type="checkbox" id="instructor" v-model="instructor">
                                    <label for="terms">Instructor</label>
                              </div>
                              <div class="form-group">
                                    <button type="submit" class="btn btn-success btn-sm btn-block">Register Now</button>
                              </div>
                              <div class="text-center">Already have an account?<router-link to="/">Sign in</router-link></div>                        
                    </form>
                </div>
            </div>
        </div>
        <div class="col-md-4 col-lg-4 col-xs-4 col-sm-4"></div>
    </div>
    </div>
  </div>
</template>
<script>
/* global axios */
export default {
  data () {
    return {
      email: '',
      password: '',
      repeatPassword: '',
      instructor: false,
      msg: '',
      signed: false,
      passwordmsg: '',
      passwordstatus: '',
      status: false
    }
  },
  methods: {
    validate (e) {
      this.repeatPassword = e.target.value
      this.status = true
      if (this.password === this.repeatPassword) {
        this.passwordstatus = true
      } else {
        this.passwordstatus = false
      }
    },
    OnRegister () {
      this.msg = ''
      let emailid = this.email
      this.status = true
      axios({
        method: 'post',
        url: 'codeword/validateEmail',
        data: {
          email: emailid
        }
      }).then(res => {
        let _this = this
        if (res.data.message === false) {
          axios.post('codeword/signup',
            {
              email: this.email.toLowerCase(),
              password: this.password,
              instructor: this.instructor
            }).then(res => {
            this.msg = 'Successfully Registered and Redirecting to SignIn Page.'
            this.signed = true
            if (res.data.message) {
              setTimeout(function () {
                _this.$router.push({ path: '/' })
              }, 1000)
            }
          })
        } else {
          this.msg = 'This user registerd already!!'
          this.signed = false
        }
      })
    }
  }
}
</script>
