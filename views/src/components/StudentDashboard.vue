<template>
    <div class="container" style="margin-top:5em" >
      <div class="row">
      <div class="col-md-2 col-lg-2 col-xs-0 col-sm-0">
      </div>
      <div class="table-responsive col-md-8 col-lg-8 col-xs-12 col-sm-12" >
        <!-- Button trigger modal -->
      <h2>CodWords</h2>
              
  <table class="table col-md-12 col-lg-12 col-xs-12 col-sm-12 table-striped table-bordered table-hover" >
    <thead>
      <tr>
        <th>Course Name</th>
        <th>Codeword</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="course in userCourses" :key="course">
        <td>{{ course.CourseNameKey}}</td>
        <td>{{ course.Codeword }}</td>
      </tr>
      
    </tbody>
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
      userCourses: ''
    }
  },
  /* global axios */
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
        console.log(response.data.data)
        this.userCourses = response.data.data
      })
    }
  }
}
</script>