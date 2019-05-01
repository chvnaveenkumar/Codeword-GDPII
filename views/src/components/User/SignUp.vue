<!-- @author Naveen Kumar Chandaluri <S530742@nwmissouri.edu> -->
<!-- This is the sign up page -->
<template>
<div class="container">
        <div class="row" style="margin-top: 7em">
            <div class="col-md-3 col-lg-3 col-xs-1 col-sm-1"></div>
            <div class="card col-md-4 col-lg-4 col-xs-12 col-sm-12">
            <div class="card-body">
            <h3> Signup </h3>
            <div style="text-align: center">       
            </div>
            <div>
            <div class="alert alert-success" v-if="signed && msg" role="alert"> {{ msg }} <router-link to="/forgetpassword">Click here</router-link> </div>
            <div class="alert alert-danger" v-else-if="!signed && msg" role="alert"> {{ msg }} </div>
            <form>
                <div class="form-group">
                  <input type="email" class="form-control" placeholder="Enter email" required="required" pattern="\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+" v-model="email" >
                </div>
                <div class="form-group">
                  <input type="checkbox" id="instructor" v-model="instructor">
                  <label for="terms">Instructor</label>
                </div>
                <button type="button" class="btn btn-success btn-sm btn-block" @click="forget">Sent Temporary Password</button>
            </form>
            </div>
            </div>
            </div>
            <div class="col-md-3 col-lg-3 col-xs-1 col-sm-1"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ForgetPage',
  data () {
    return {
      msg: '',
      signed: false,
      email: '',
      instructor: false
    }
  },
  // This method is used when an user or admin forget the password
  methods: {
    forget () {
      this.msg = ''
      let emailid = this.email.toLowerCase()
      /* global axios */
      axios({
        method: 'post',
        url: 'codeword/validateEmail',
        data: {
          email: emailid
        }
      }).then(res => {
        if (res.data.message === false) {
          axios.post('codeword/signupuser', {
            email: emailid,
            instructor: this.instructor
          }).then(response => {
            this.msg = 'Sent temporary password to your email'
            this.signed = true
            let _this = this
            setTimeout(function () {
              _this.$router.push({ path: '/' })
            }, 2000)
          })
        } else {
          this.msg = 'User already registered!! If you forget password then '
          this.signed = true
        }
      })
    }
  }
}
</script>
