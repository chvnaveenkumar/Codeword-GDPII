<template>
    <div class="container" style="margin-top:5em" >
      <div class="row">
      <div class="col-md-2 col-lg-2 col-xs-0 col-sm-0">
      </div>
      <div class="table-responsive col-md-8 col-lg-8 col-xs-12 col-sm-12">
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
      <tr v-for="(course,index) in listCourses" :key="index" v-if="new Date(course.courseInfo.Enddate) >= new Date()">
        <td>{{ course.courseInfo.courseNameKey }}</td>
        <td>
          <input  type="button" v-if=!course.Acknowledged @click="getCodeWord(index)" Value="Get CodeWord">
          <div v-else> {{ course.codeword }}</div>
        </td>
         
        <td v-if="course.courseInfo.PreSurveyURL != null && course.courseInfo.PreSurveyURL.length > 5"> 
          <a v-bind:href="'http://'+course.courseInfo.PreSurveyURL" target="_blank">Start Survey</a>
        </td>
        <td v-else> 
          <a>No Start Survey Url</a>
        </td> 
        <td v-if="course.courseInfo.PostSurveyURL != null && course.courseInfo.PostSurveyURL.length > 5">
          <a v-bind:href="'http://'+course.courseInfo.PostSurveyURL" target="_blank">End Survey</a>
         </td>
        <td v-else>
            <a>No End Survey Url</a>
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
            console.log(this.userCourses[i].Acknowledged)
            axios({
              method: 'post',
              url: 'codeword/getcoursedetails',
              headers: {
                token: window.localStorage.getItem('token')
              },
              data: {
                courseName: this.userCourses[i].CourseNameKey,
                courseCreater: this.userCourses[i].courseCreater,
                codeword: this.userCourses[i].Codeword,
                ack: this.userCourses[i].Acknowledged
              }
            }).then(response => {
              var course = {codeword: response.data.codeword, Acknowledged: response.data.Acknowledged, courseInfo: response.data.data[0]}
              this.listCourses.push(course)
              console.log(this.listCourses)
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
          acknowledgedStatus: this.listCourses[index]
        }
      }).then(response => {
        if (response.data.message === true) {
          this.listCourses[index].Acknowledged = true
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
