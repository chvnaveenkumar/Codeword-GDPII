<template>
    <div class="container" style="margin-top:5em" >
      <div class="row">
      <div class="col-md-2 col-lg-2 col-xs-0 col-sm-0">
      </div>
      <div class="table-responsive col-md-8 col-lg-8 col-xs-12 col-sm-12" >
       <h2>List of courses registered</h2>
  <table class="table col-md-12 col-lg-12 col-xs-12 col-sm-12 table-striped table-bordered table-hover" >
    <thead class="thead-dark">
      <tr>
        <th>Course Name</th>
        <th>Codeword</th>
        <th>Start Survey</th>
        <th>End Survey</th>
        <th>End Date</th>
      </tr>
    </thead>
    <tbody v-if="status">
      <tr v-for="(course,index) in userCourses" :key="index">
        <td>{{ course.CourseNameKey }}</td>
        <td>
          <input  type="button" v-if=!course.Acknowledged @click="getCodeWord(index)" Value="Get CodeWord">
          <div v-else> {{ course.PostSurveyURL }}</div>
        </td>
         
        <td v-if="course.PreSurveyURL != null"> 
          <a v-bind:href="'http://'+course.PreSurveyURL" class="card-link" target="_blank">Start Survey</a>
        </td>
        <td else-if> 
          <a>No Start Survey Url</a>
        </td> 
        <td v-if="course.PostSurveyURL != null">
          <a v-bind:href="'http://'+course.PostSurveyURL" class="card-link" target="_blank">End Survey</a>
         </td>
        <td v-else>
            <a>No End Survey Url</a>
         </td>
         <td> 
          <a>{{ course.enddate}}</a>
        </td> 
        
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
      startSurveyurldata: '',
      endSurveyurldata: '',
      Codeword: '',
      userCourses: '',
      status: true,
      show: true,
      listCourses: []
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
          for (var i = 0; i < this.userCourses.length; i++) {
            axios({
              method: 'post',
              url: 'codeword/getcoursedetails',
              headers: {
                token: window.localStorage.getItem('token')
              },
              data: {
                courseName: this.userCourses[i].CourseNameKey,
                courseCreater: this.userCourses[i].courseCreater
              }
            }).then(response => {
              var survey = {startSurvey: response.data.data[0].PostSurveyURL, endSurvey: response.data.data[0].PostSurveyURL, enddate: response.data.data[0].enddate}
              this.listCourses.push(survey)
              console.log(this.listCourses[0].startSurvey)
            })
          }
        }
      })
    },
    getCodeWord (index) {
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
        if (response.data.message === true) {
          this.userCourses[index].Acknowledged = true
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
