<template>
<div class="container-fluid" style="margin-top:5em" >
   <div class="row" >
 <router-link :to="{ name: 'InstructorDashboard' }"><button type="button" style="float:left;" class="btn btn-primary btn-xs"><i class="fa fa-chevron-left fa-lg"></i> DashBoard</button></router-link>
  </div>
 <div class="card">
   <h5 class="card-header">      <div class="row" >
            <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
                <h3 style="font-weight:bold;text-align:left"> Course Name: {{ courseNameData }} </h3>
            </div>
            <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                <h5 style="font-weight:bold;text-align:right"> Acknowledged Status: {{acknowledged}} / {{totalStudents}} </h5>
                <h5 style="font-weight:bold;text-align:right"> Acknowledged Percentage: {{ ((acknowledged/totalStudents)*100).toFixed(2) }}%</h5>
            </div>
      </div>
</h5>
  <div class="card-body">
    <div class="row" >
    <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6" style="text-align:left;font-weight:bold">
    Start Date: {{ courseData.Startdate }} <br>
    End Date: {{ courseData.Enddate }} <br>
    Start Survey URL: <a v-bind:href="'http://'+courseData.PreSurveyURL" class="card-link" target="_blank">{{ courseData.PreSurveyURL }} </a> <br>
    End Survey URL: <a v-bind:href="'http://'+courseData.PostSurveyURL" class="card-link" target="_blank">{{ courseData.PostSurveyURL }} </a> <br>
    Number of Students: {{ totalStudents }} <br>
    </div>
     <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6" style="text-align:left;font-weight:bold">
          <button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#editCourse" @click="selectCourse(courseData)" style="float:right;"><i class="fa fa-pencil"></i>Edit Course Details</button>
    </div>
    </div>
  </div>
</div>
<br>
      <button type="button" class="btn btn-primary btn-sm" title="Add New Student" data-toggle="modal" data-target="#addStudentModel" style="float:right;"><i class="fa fa-plus"></i> Add New Student</button>
<br>
  <v-client-table :columns="columns" :data="data" :options="options">
      <button type="button" slot="edit" slot-scope="props" class="btn btn-info btn-sm" data-toggle="modal" @click="selectStudentInfo(props.row.studentName,props.row.EmailKey,props.row.id)" data-target="#editStudent" style="marging-left:10px">
        <i class="fas fa-pencil-alt"></i>
      </button>
      <button type="button" slot="delete" slot-scope="props" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deleteStudent" @click="selectStudent(courseNameData,props.row.EmailKey, props.row.studentName)" style="marging-left:10px">
        <i class="fas fa-trash"></i>
      </button>
  </v-client-table>
<!-- Modal Add Student -->
<div class="modal fade" id="addStudentModel" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Add New Student</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form @submit.prevent="addStudent(addStudentName, addStudentEmail)">
      <div class="modal-body">
        <div class="container-fluid">
        <div class="row">
            <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
            Enter Student Name: 
            </div>
             <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
             <input type="text" class="form-control" v-model="addStudentName" pattern="[A-Za-z ]{3,25}" placeholder="Enter Student Name" data-toggle="tooltip" title="Name Should be of 3-25 alphabets" required>
        </div>
        </div>
        <br>
           <div class="row">
            <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
            Enter Student Email: 
            </div>
             <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
              <input type="email" class="form-control" placeholder="Enter Student Email" required title="Please enter proper Email ID" pattern="\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+" v-model="addStudentEmail">
        </div>
      </div>
        <div class="row">
            <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
            Remaining Codewords : 
            </div>
            <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
               {{  courseData.oldCodewords.length }} 
            </div>
      </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="cancel" class="btn btn-danger" data-dismiss="modal">Cancel</button>
        <button type="create" class="btn btn-primary" :disabled="courseData.oldCodewords.length <= 0">Add Student</button>
        
      </div>
      </form>
    </div>
  </div>
</div>

<!-- Modal Delete Student -->
<div class="modal fade" id="deleteStudent" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete Student</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h5> Student Name: {{ selectstudentName}} </h5>
        <h6> Student Email: {{ selectEmailKey}} </h6>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" @click="deleteStudent(selectEmailKey)">Delete Student</button>
        
      </div>
    </div>
  </div>
</div>

<!-- Modal Edit Student -->
<div class="modal fade" id="editStudent" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Edit Student</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
       <form @submit.prevent="editStudent(editStudentId, editStudentEmail, editStudentName)">
      <div class="modal-body">
          <div class="row">
          <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
            <input type="text" v-model="editStudentName" required pattern="[A-Za-z ]{3,25}" placeholder="Enter Student Name" data-toggle="tooltip" title="Name Should be of 3-25 alphabets">
          </div>
          <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
            <input type="email" v-model="editStudentEmail" required placeholder="Enter Student Email" title="Please enter proper Email ID" pattern="\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+">
          </div>
          </div>
      </div>
      <div class="modal-footer">
         <button type="cancel" class="btn btn-danger" data-dismiss="modal">Cancel</button>
        <button type="create" class="btn btn-primary">Update Details</button>
       
      </div>
       </form>
    </div>
  </div>
</div>

<!-- Modal Edit Course -->
<div class="modal fade" id="editCourse" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Edit Course</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form @submit.prevent="editCourse">
      <div class="modal-body">
        <div class="container-fluid">
        <div class="row">
          <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
        Start Date: </div>
          <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
            <div class="form-group">
        <datepicker type="date" id="startDate" title="Atleast 6-15 characters" required :disabledDates="startdisabledDates" v-model="selectstartDate" @click="changeEndDate"></datepicker></div></div>
       </div>
        <div class="row">
          <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
        End Date: </div><div class="col-md-6 col-lg-6 col-xs-6 col-sm-6"><datepicker type="date" :disabledDates="enddisabledDates" required id="endDate" v-model="selectendDate"></datepicker></div>
        </div>
        <br/>
             <div class="row">
          <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
        Start Survey URL: </div> <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6"><div class="form-group"><input type="text" class="form-control" v-model="selectstartSurvey"></div></div></div>
          <div class="row">
          <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6">
        End Survey URL: </div> <div class="col-md-6 col-lg-6 col-xs-6 col-sm-6"><div class="form-group"><input type="text" class="form-control" v-model="selectendSurvey"></div></div></div>
        </div>
                <button type="cancel" class="btn btn-danger" data-dismiss="modal">Cancel</button>
        <button type="create" class="btn btn-primary" >Save Changes</button>
      </div>
      </form>
    </div>
  </div>
</div>
</div>    
</template>
<script>
import swal from 'sweetalert2'
import Datepicker from 'vuejs-datepicker'
/* global axios $ */
export default {
  name: 'CourseStudent',
  data () {
    return {
      columns: ['EmailKey', 'studentName', 'Codeword', 'edit', 'delete'],
      data: [],
      options: {
        headings: {
          EmailKey: 'Student Email',
          studentName: 'Student Name',
          Codeword: 'Codeword',
          id: 'id'
        },
        sortable: ['EmailKey', 'studentName', 'Codeword'],
        filterable: ['EmailKey', 'studentName', 'Codeword'],
        texts: {
          filterPlaceholder: 'Search Student',
          filter: ''
        }
      },
      courseNameData: '',
      courseStudentData: [],
      courseData: '',
      coursesData: '',
      selectCourseName: '',
      selectEmailKey: '',
      selectstudentName: '',
      selectedEmailKey: '',
      selectedStudentName: '',
      acknowledged: 0,
      courseInfo: '',
      studentInfo: '',
      editStudentName: '',
      editStudentEmail: '',
      editStudentId: '',
      currentPage: '',
      endDateChanged: true,
      pages: '',
      prevUrl: '',
      nextUrl: '',
      totalStudents: '',
      selectstartDate: '',
      selectendDate: '',
      selectstartSurvey: '',
      selectendSurvey: '',
      addStudentName: '',
      addStudentEmail: '',
      enddisabledDates: {
        to: '' // Disable all dates up to specific date
      },
      startdisabledDates: {
        from: '' // Disable all dates up to specific date
      }
    }
  },
  components: {
    Datepicker
  },
  created () {
    if (this.$route.params.courseName == null) {
      this.courseNameData = window.localStorage.getItem('courseName')
      this.getCourseStudentData()
      this.getCoursesData(this.courseNameData)
    } else {
      this.courseNameData = this.$route.params.courseName
      window.localStorage.setItem('courseName', this.courseNameData)
      this.getCourseStudentData()
      this.getCoursesData(this.courseNameData)
    }
  },
  watch: {
    selectstartDate (value) {
      this.enddisabledDates.to = new Date(new Date(this.selectstartDate).getFullYear(), new Date(this.selectstartDate).getMonth(), new Date(this.selectstartDate).getDate() + 1)
    },
    selectendDate (value) {
      this.startdisabledDates.from = new Date(new Date(this.selectendDate).getFullYear(), new Date(this.selectendDate).getMonth(), new Date(this.selectendDate).getDate() - 1)
    }
  },
  methods: {
    changeEndDate () {
      let start = new Date(document.getElementById('startDate').value)
      this.courseInfo.Startdate = new Date(start) && new Date(start).toISOString().split('T')[0]
      this.courseInfo.Enddate = new Date(start.setMonth(start.getMonth())) && new Date(start.setMonth(start.getMonth() + 4)).toISOString().split('T')[0]
      document.getElementById('endDate').value = this.courseInfo.Enddate
    },
    getCourseStudentData () {
      axios({
        method: 'post',
        url: 'codeword/getcoursestudent',
        data: {
          CourseNameValue: this.courseNameData
        },
        headers: {
          token: window.localStorage.getItem('token')
        }
      }).then(response => {
        this.courseStudentData = response.data.courseStudents
        console.log(this.courseStudentData)
        this.courseStudentList = response.data.courseStudents
        var courseStudentjson = []
        this.courseStudentList.forEach((value, i) => {
          var student = {}
          student['studentName'] = value.StudentName
          student['EmailKey'] = value.EmailKey
          student['Codeword'] = value.Codeword
          student['id'] = value._id
          student['index'] = i
          courseStudentjson.push(student)
        })
        this.data = JSON.parse(JSON.stringify(courseStudentjson))
        this.currentPage = response.data.currentPage
        this.pages = response.data.pages
        this.nextUrl = response.data.nextUrl
        this.prevUrl = response.data.prevUrl
        this.totalStudents = response.data.totalStudents
        this.acknowledged = response.data.AcknowledgedTrue
      })
    },
    checkPage (url) {
      axios({
        method: 'post',
        url: url,
        data: {
          CourseNameValue: this.courseNameData
        },
        headers: {
          token: window.localStorage.getItem('token')
        }
      }).then(response => {
        this.courseStudentData = response.data.courseStudents
        this.currentPage = response.data.currentPage
        this.pages = response.data.pages
        this.nextUrl = response.data.nextUrl
        this.prevUrl = response.data.prevUrl
      })
    },
    getCoursesData (courseNameData) {
      axios({
        method: 'get',
        url: 'codeword/getCourseList',
        headers: {
          token: window.localStorage.getItem('token')
        }
      }).then(response => {
        this.coursesData = response.data.data
        for (var index = 0; index < this.coursesData.length; index++) {
          if (this.coursesData[index].courseNameKey === courseNameData) {
            this.courseData = this.coursesData[index]
          }
        }
      })
    },
    selectStudent (courseName, emailKey, studentName) {
      this.selectCourseName = this.courseNameData
      this.selectEmailKey = emailKey
      this.selectstudentName = studentName
      this.selectedEmailKey = emailKey
      this.selectedStudentName = studentName
    },
    deleteStudent (emailKey) {
      axios({
        method: 'post',
        url: 'codeword/deletecoursestudent',
        headers: {
          token: window.localStorage.getItem('token')
        },
        data: {
          CourseNameKey: this.courseNameData,
          EmailKey: emailKey
        }
      }).then(response => {
        if (response.data.message === 'Deleted Student Successfully!') {
          swal('Success', response.data.message, 'success')
          $('#deleteStudent').modal('hide')
          this.getCourseStudentData()
          this.getCoursesData(this.courseNameData)
        }
      })
    },
    editStudent (studentId, selectEmailKey, selectStudent) {
      var studentValidate = 0
      var studentData = this.courseStudentData
      studentData.forEach(students => {
        if (students.EmailKey.toUpperCase() === selectEmailKey.toUpperCase()) {
          studentValidate = studentValidate + 1
        }
      })
      if (studentValidate > 1) {
        swal('Student already exists!!')
      } else {
        axios({
          method: 'post',
          url: 'codeword/updatecoursestudent',
          headers: {
            token: window.localStorage.getItem('token')
          },
          data: {
            _id: studentId,
            NewEmailKey: selectEmailKey,
            Newstudentkey: selectStudent
          }
        }).then(response => {
          if (response.data.message === true) {
            $('#editStudent').modal('hide')
            this.getCourseStudentData()
            this.getCoursesData(this.courseNameData)
          }
        })
      }
    },
    addStudent (studentName, studentEmail) {
      var studentValidate = true
      var studentData = this.courseStudentData
      studentData.forEach(students => {
        if (students.EmailKey.toUpperCase() === studentEmail.toUpperCase()) {
          studentValidate = false
        }
      })
      if (studentValidate === false) {
        swal('Student already exists!!')
      } else {
        axios({
          method: 'post',
          url: 'codeword/addstudent',
          headers: {
            token: window.localStorage.getItem('token')
          },
          data: {
            courseName: this.courseNameData,
            courseCreater: this.courseData.emailKey,
            newStudentEmail: studentEmail,
            newStudentName: studentName,
            newCodeword: this.courseData.oldCodewords[0],
            id: this.courseData._id,
            remainingCodewords: this.courseData.oldCodewords
          }
        }).then(response => {
          console.log(response.data.message)
          if (response.data.message === true) {
            $('#addStudentModel').modal('hide')
            swal('Success', 'Added new Student Successfully!!', 'success')
            this.getCourseStudentData()
            this.getCoursesData(this.courseNameData)
          }
        })
      }
    },
    editCourse (courseId) {
      axios({
        method: 'post',
        url: 'codeword/updateCourse',
        headers: {
          token: window.localStorage.getItem('token')
        },
        data: {
          id: this.courseData._id,
          Startdate: this.selectstartDate,
          Enddate: this.selectendDate,
          PreSurveyURL: this.selectstartSurvey,
          PostSurveyURL: this.selectendSurvey
        }
      }).then(response => {
        this.getCourseStudentData()
        this.getCoursesData(this.courseNameData)
        $('#editCourse').modal('hide')
      })
    },
    selectCourse (courseDetails) {
      this.selectstartDate = new Date(new Date(courseDetails.Startdate).getFullYear(), new Date(courseDetails.Startdate).getMonth(), new Date(courseDetails.Startdate).getDate() + 1)
      this.selectendDate = new Date(new Date(courseDetails.Enddate).getFullYear(), new Date(courseDetails.Enddate).getMonth(), new Date(courseDetails.Enddate).getDate() + 1)
      this.selectstartSurvey = courseDetails.PreSurveyURL
      this.selectendSurvey = courseDetails.PostSurveyURL
    },
    selectStudentInfo (studentName, studentEmail, studentid) {
      this.editStudentName = studentName
      this.editStudentEmail = studentEmail
      this.editStudentId = studentid
    }
  }
}
</script>