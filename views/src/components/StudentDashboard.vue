<template>
    <div class="container" style="margin-top:5em" >
      <div class="row">
      <div class="col-md-2 col-lg-2 col-xs-0 col-sm-0">
      </div>
      <div class="table-responsive col-md-8 col-lg-8 col-xs-12 col-sm-12" >
        <!-- Button trigger modal -->
      <h2>List of courses registered</h2>
  <table class="table col-md-12 col-lg-12 col-xs-12 col-sm-12 table-striped table-bordered table-hover" >
    <thead class="thead-dark">
      <tr>
        <th>Course Name</th>
        <th>Codeword</th>
        <th>Start Survey</th>
        <th>End Survey</th>
      </tr>
    </thead>
    <tbody v-if="status">
      <tr v-for="(course,index) in userCourses" :key="index">
        <td>{{ course.CourseNameKey}}</td>
        
        <td>
          <input  type="button" v-if=!course.Acknowledged @click="getCodeWord(index)" Value="Get CodeWord">
          <div v-else> {{ course.Codeword }}</div>
        </td>
        <td>  <a> Click Here </a></td>
        <td> <a> Click Here </a></td>
      </tr>
    </tbody>
      <div v-else class='nodata'>
        No Courses Found
      </div>
  </table>
  <div class="col-md-2 col-lg-2 col-xs-0 col-sm-0"></div>
</div></div>
</div>
</template>
<script>

export default {
  name: 'InstructorDashboard',
  data () {
    return {
      courseName: '',
      startSurveyurldata: '',
      endSurveyurldata: '',
      Codeword: '',
      userCourses: '',
      status: true,
      show: true
    }
  },
  /* global axios  */
  created () {
    this.fetchUserData()
  },
  watch: {
    '$route': 'fetchUserData'
  },
  methods: {
    fetchUserData () {
      axios({
        method: 'get',
        url: 'codeword/getstudentcourses',
        headers: {
          token: window.localStorage.getItem('token')
        }
      }).then(response => {
        if (response.data.data === 'No courses found') {
          this.status = false
        } else {
          this.userCourses = response.data.data
        }
      })
    },
    getCodeWord (index) {
      // yet to write an API Call to change status as acknowledged
      this.userCourses[index].Acknowledged = true
      axios({
        method: 'post',
        url: 'codeword/codewordAcknowledged',
        headers: {
          token: window.localStorage.getItem('token')
        },
        data: {
          acknowledgedStatus: this.userCourses[index]
        }
      }).then(response => {
        if (response.data.data === 'No courses found') {
          this.status = false
        } else {
          this.userCourses = response.data.data
        }
      })
    }
  }
}
</script>
<style>
.nodata {
  text-align: right
}
</style>
