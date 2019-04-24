<template>
<div class="container-fluid" style="margin-top:5em" >            
  <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
    <div class="alert alert-primary alert-dismissible fade show" role="alert" v-if="welcomealert" id="welcome-alert" >
  <strong>Welcome to Instructor's dashboard. </strong>
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
        <div class="row">
                <div class="col-md-2 col-lg-2 col-xs-2 col-sm-2 tooltip-test"><button type="button" class="btn btn-success" title="Create CodeWord Set" data-toggle="modal" data-target="#addcourse" v-on:click="loadCourseModel">
      <span class="fa fa-plus"></span> Add Course </button>
    </div>
        <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
        </div>
    <div class="col-md-2 col-lg-2 col-xs-2 col-sm-2">
    <input class="form-check-input" type="checkbox" v-model="active" value="Active Courses" id="defaultCheck1">
    <label class="form-check-label" for="defaultCheck1">
       Active Courses
  </label>
    </div>
    <div class="col-md-2 col-lg-2 col-xs-2 col-sm-2">
  <input class="form-check-input" type="checkbox" v-model="inactive" value="" id="defaultCheck2">
    <label class="form-check-label" for="defaultCheck2">
    Inactive Courses
  </label>               
    </div>
      </div>      
  </div>
  <div v-if="courses.length <= 0">
    <br>
   <div class="card text-center" style="text-align=center;">
  <div class="card-body">
    There are no courses.
  </div>
</div> 
  </div>
<div v-else-if="(courses.length >0) && (loading = true)">
  <div class="row" >      
    <div class="col-md-3 col-lg-3 col-xs-3 col-sm-3" v-for="course in courses" :key="course._id" v-if="(!active != (new Date() < new Date(course.Enddate)) || inactive != (new Date() < new Date(course.Enddate))) && (active || inactive)">
      <div class="card border-success mb-3 cardstyle" style="max-width: 20rem;margin-top: 1rem;" >
         <div class="card-header bg-info border-success" id = "boldforcourse"><h4>{{ course.courseNameKey }}</h4>
        <br>
       <div>
         {{ course.Startdate }} &nbsp;&nbsp; {{ course.Enddate }} 
       </div>
         </div>
        <div class="card-body text-info">
          <h5 class="card-title" ></h5>
          <!-- <a v-bind:href="'http://'+course.PreSurveyURL" class="card-link" target="_blank">Start Survey</a>
          <a v-bind:href="'http://'+course.PostSurveyURL" class="card-link" target="_blank">End Survey</a> -->
          
          <router-link :to="{ name: 'CourseStudent', params: { courseName: course.courseNameKey } }">
            <button class="btn btn-info btn-md "><i class="fa fa-eye fa-lg" aria-hidden="true" ></i></button>
          </router-link>
          <button type="button" class="btn btn-danger btn-md" data-toggle="modal" @click="getCourseName(course.courseNameKey)" data-target="#deleteCourse"><i class="fa fa-trash fa-xs">
          </i>
          </button>
          <br>
          <p>Acknowledged status: {{course.acknowledged}}/{{ course.totalStudents }}</p>
        </div>
      </div>
    </div>
  </div>
  </div>
<!-- Modal Delete course -->
<div class="modal fade" id="deleteCourse" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete Course</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h1> {{selectedCourse}} </h1>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" @click="deleteCourseKey">Delete Course</button>
      </div>
    </div>
  </div>
</div>
  <!-- Model to  add Course -->
      <div class="modal fade" id="addcourse" tabindex="-1" role="dialog" aria-labelledby="addcourseLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content" style= "width:fit-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addcourseLabel">New Course Details</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
              <span aria-hidden="true">&times;</span></button>
            </div>
            <form @submit.prevent="CreateCourse">
            <div class="modal-body">
            <div class="form-group">
              <input type="text" class="form-control" pattern="[A-Za-z0-9 ]{6,15}" id="courseName" name="courseName" placeholder="Enter Course Name" data-toggle="tooltip" title="Course Name should be 6-15 characters/numbers only" required>
            </div>
            <div class="row">
                <div class="col tooltip-test" title="Start Date"> Start Date:<datepicker type="date" :disabledDates="startdisabledDates" name="startDate" v-model="startDate" required></datepicker></div>
                <div class="col tooltip-test" title="End Date"> End Date:<datepicker type="date"  :disabledDates="enddisabledDates" value=endDate v-model="endDate"  name="endDate"  required></datepicker></div>
            </div>
            <div class="row">
            <div class="col-md-8 col-lg-8 col-xs-8 col-sm-8 tooltip-test"> <div class="form-group">
                <input type="file" ref="file" name="file" v-on:change="handleFileUpload()" class="form-control-file" id="file" style="margin-top:1em">
            </div></div>
                <div class="col-md-4 col-lg-4 col-xs-4 col-sm-4 tooltip-test">   
                  <b-button id="popover-3" variant="primary">hint</b-button>
        <b-popover target="popover-3" triggers="hover focus">
          <template slot="title">Rules for student excel</template>
           1. The uploaded excelsheet should have 2 columns. </br> 2. First column should contain email address (should be in @ format example:abc@nwmissouri.edu). </br> 3. In this excelsheet email address should be unique. </br>
         4. Second column should contain name of the student. </br> 5. Student name should be of range between 5-25 characters.</br>
        </b-popover></div>
            
            </div>
            Upload Student Details(Excel)
            <div class="text-center my-3">
</div>
            <div v-if="checkFileUpload === true">
                <p v-if="excelstatus.length > 0" class="alert alert-danger">                          
                {{ excelstatus }}</p>
                <p v-else class="alert alert-info">
                    There are {{ count }} Students in the Uploaded set.</p>
            </div>
            <div class="form-group" required>
                <select class="form-control" v-model="selectedCodeWordSet" value ="Select codeword set" data-toggle="tooltip"  title="Please select codeword set" >
                  <option disabled value="">Please select CodeWordSet</option>
                  <option v-for="codewordset in codeWordSetData" :value="codewordset" :key="codewordset._id">{{ codewordset.CodeWordSetName }}</option>
                </select>
                <br/>
                <span>{{ selectedCodeWordSet.CodeWordSetName }} : {{ selectedCodeWordSet ? selectedCodeWordSet.Codewords.length : '' }}</span>
            </div>
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Enter Survey Start URL" name="startSurveyurl" data-toggle="tooltip" data-placement="bottom" title="Enter Survey Start URL" >
            </div>
            <div class="form-group" >
              <input type="text" class="form-control" placeholder="Enter Survey End URL"  name="endSurveyurl" data-toggle="tooltip" data-placement="bottom" title="Enter Survey End URL" >
            </div>
            <div>
              <button type="cancel" class="btn btn-danger" data-dismiss="modal">Cancel</button>
              <button type="create" :disabled="count === false" class="btn btn-primary">Create Course</button>
            </div>
            </div>
            </form></div></div></div>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'InstructorDashboard',
  data () {
    return {
      courseName: '',
      startDate: '',
      endDate: '',
      startSurveyurldata: '',
      endSurveyurldata: '',
      selectedCodeWordSet: '',
      file: '',
      codeWordSetData: '',
      coursesData: '',
      selectedCourse: '',
      codeWordSetCount: '',
      isEnabled: true,
      count: 0,
      checkFileUpload: false,
      active: true,
      inactive: false,
      courses: '',
      tempdate: '',
      endDateChanged: true,
      excelstatus: '',
      welcomealert: true,
      enddisabledDates: {
        to: '' // Disable all dates up to specific date
      },
      startdisabledDates: {
        from: '' // Disable all dates up to specific date
      },
      loading: false
    }
  },
  components: {
    Datepicker
  },
  created () {
    this.startDate = new Date() && new Date().toISOString().split('T')[0]
    this.enddisabledDates.to = new Date(new Date(this.startDate).getFullYear(), new Date(this.startDate).getMonth(), new Date(this.startDate).getDate() + 1)
    this.endDate = new Date(new Date().setMonth(new Date().getMonth())) && new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0]
    this.fetchCourseList()
  },
  mounted () {
    $('#addcourse').on('hidden.bs.modal', function () {
      $('#addcourse form')[0].reset()
    })
    $('#welcome-alert').fadeTo(10000, 500).slideUp(500, function () {
      $('#welcome-alert').slideUp(500)
      this.welcomealert = false
    })
    this.fetchCourseList()
  },
  watch: {
    '$route': 'fetchCourseList',
    startDate (value) {
      if (this.endDateChanged) {
        let start = new Date(value)
        this.startDate = new Date(start) && new Date(start).toISOString().split('T')[0]
        this.endDate = new Date(start.setMonth(start.getMonth())) && new Date(start.setMonth(start.getMonth() + 4)).toISOString().split('T')[0]
        this.tempdate = this.endDate
        this.enddisabledDates.to = new Date(new Date(this.startDate).getFullYear(), new Date(this.startDate).getMonth(), new Date(this.startDate).getDate() + 1)
      } else {
        this.enddisabledDates.to = new Date(new Date(this.startDate).getFullYear(), new Date(this.startDate).getMonth(), new Date(this.startDate).getDate() + 1)
      }
    },
    endDate (value) {
      if (this.tempdate !== value) {
        this.endDateChanged = false
        this.startdisabledDates.from = new Date(new Date(this.endDate).getFullYear(), new Date(this.endDate).getMonth(), new Date(this.endDate).getDate())
      }
    }
  },
  methods: {
    CreateCourse () {
      console.log(this.selectedCodeWordSet.CodeWordSetName)
      if (this.selectedCodeWordSet.CodeWordSetName === '' || this.selectedCodeWordSet.CodeWordSetName === undefined) {
        swal('Please choose codeword set!')
      } else {
        let data = new FormData(document.querySelector('form'))
        this.courseName = data.get('courseName')
        this.startDate = this.startDate
        this.endDate = this.endDate
        this.startSurveyurldata = data.get('startSurveyurl')
        this.endSurveyurldata = data.get('endSurveyurl')
        let formData = new FormData()
        formData.append('CourseNameKey', this.courseName)
        formData.append('CodeWordSetName', this.selectedCodeWordSet.CodeWordSetName)
        if (this.file !== '') {
          formData.append('file', this.file)
        }
        console.log(this.file)
        /* global axios $ */
        axios({
          method: 'post',
          url: 'codeword/addnewCourse',
          data: {
            token: window.localStorage.getItem('token'),
            courseNameKey: this.courseName,
            codfeWordSetName: this.selectedCodeWordSet.CodeWordSetName,
            startDate: this.startDate,
            endDate: this.endDate,
            preSurveyURL: this.startSurveyurldata,
            postSurveyURL: this.endSurveyurldata,
            oldCodewords: []
          }
        })
          .then((response) => {
            if (response) {
              formData.append('id', response.data.data._id)
              axios.post('codeword/addcoursestudent',
                formData, {headers: {
                  'Content-Type': 'multipart/form-data',
                  token: window.localStorage.getItem('token')
                }
                }).then(response => {
                if (response.data.message === 'Course student successfully!') {
                  $('#addcourse').modal('hide')
                  this.fetchCourseList()
                } else {
                  swal('Less Codewords', response.data.message, 'error')
                }
              })
            }
          })
          .catch(error => {
            swal('Error Message', error.response.data.message, 'error')
            console.log('Eoor' + error)
          })
      }
    },
    handleFileUpload () {
      this.checkFileUpload = true
      this.file = this.$refs.file.files[0]
      console.log(this.file)
      let data = new FormData(document.querySelector('form'))
      axios.post('/codeword/getdatastudentxlsx', data).then(response => {
        if (!response.data.status) {
          this.excelstatus = response.data.data
        } else {
          this.count = response.data.count
        }
        console.log(this.count + 'student')
      })
    },
    getStartDate () {
      var today = new Date()
      document.getElementById('startDate').value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
    },
    loadCourseModel () {
      axios({
        method: 'get',
        url: 'codeword/getcodewordset',
        headers: {
          token: window.localStorage.getItem('token')
        }
      }).then(response => {
        this.codeWordSetData = response.data.data
        console.log(this.codeWordSetData)
      })
    },
    status () {
      this.isEnabled = false
    },
    fetchCourseList () {
      axios({
        method: 'get',
        url: 'codeword/getCourseList',
        headers: {
          token: window.localStorage.getItem('token')
        }
      }).then(response => {
        this.coursesData = response.data.data
        this.courses = ''
        for (var i = 0; i < this.coursesData.length; i++) {
          axios({
            method: 'post',
            url: 'codeword/getcoursestudent',
            data: {
              CourseNameValue: this.coursesData[i].courseNameKey
            },
            headers: {
              token: window.localStorage.getItem('token')
            }
          }).then(response => {
            const index = this.coursesData.findIndex(course => course.courseNameKey === response.data.CourseNameValue)
            this.coursesData[index].totalStudents = response.data.totalStudents
            this.coursesData[index].acknowledged = response.data.AcknowledgedTrue
            this.courses = this.coursesData
            this.loading = true
            this.$forceUpdate()
          })
        }
      })
    },
    getCourseName (item) {
      this.selectedCourse = item
    },
    deleteCourseKey () {
      console.log('deletecoursekey')
      axios({
        method: 'post',
        url: 'codeword/deleteCourse',
        headers: {
          token: window.localStorage.getItem('token')
        },
        data: {
          CourseNameKey: this.selectedCourse
        }
      }).then(response => {
        $('#deleteCourse').modal('hide')
        this.fetchCourseList()
      })
    }
  }
}
</script>
<style>
#message{
    margin-top:5em;
}
#sizeofDate {
  font-size:125%;
  font-weight: bold;
}
#leftAlign {
  text-align: left;
}
.cardstyle {
  
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        width: 260px;
    height: 320px;
     margin-top: 100px;
    margin-bottom: 100px;
    margin-right: 160px;
    margin-left: 20px;
}
.bg-info {
    background-color: #3e5c67 !important;
}
#boldforcourse{
  color: aliceblue;
}
.togglealign {
  text-align: right
}
</style>