<template>
<div class="container-fluid" style="margin-top:5em" >
   <div class="row" >
 <router-link :to="{ name: 'InstructorDashboard' }"><button type="button" style="float:left;" class="btn btn-primary btn-xs"><i class="fa fa-chevron-left fa-lg"></i> DashBoard</button></router-link>
  </div>
 <div class="card">
   <h5 class="card-header">      <div class="row" >
            <div class="col-md-6 col-lg-6 col-xs-0 col-sm-0">
                <h3 style="font-weight:bold;text-align:left"> Course Name: {{ courseNameData }} </h3>
            </div>
            <div class="col-md-6 col-lg-6 col-xs-0 col-sm-0">
                <h3 style="font-weight:bold;text-align:right"> Acknowledged Status: {{ acknowledged.toFixed(2) }}% </h3>
            </div>
      </div>
</h5>
  <div class="card-body">
    <div class="row" >
    <div class="col-md-6 col-lg-6 col-xs-0 col-sm-0" style="text-align:left;font-weight:bold">
    Start Date: {{ courseData.Startdate }} <br>
    End Date: {{ courseData.Enddate }} <br>
    Start Survey URL: <a v-bind:href="'http://'+courseData.PreSurveyURL" class="card-link" target="_blank">{{ courseData.PreSurveyURL }} </a> <br>
    End Survey URL: <a v-bind:href="'http://'+courseData.PostSurveyURL" class="card-link" target="_blank">{{ courseData.PostSurveyURL }} </a> <br>
    Number of Students: {{ totalStudents }} <br>
    </div>
     <div class="col-md-6 col-lg-6 col-xs-0 col-sm-0" style="text-align:left;font-weight:bold">
          <button class="btn" data-toggle="modal" data-target="#editCourse" @click="selectCourse(courseData)" style="float:right;">Edit <i class="fa fa-pencil fa-xs"></i></button>
          <button class="btn" title="Add New Student" data-toggle="modal" data-target="#addStudentModel" style="float:right;"><i class="fa fa-plus"></i> Add New Student</button>
    </div>
    </div>
  </div>
</div>
<br>
<br>
 <table class="table table-striped table-sm" >
 <thead class="thead-dark">
            <tr>
                <th>
                    <h4>
                        <u>Email</u>
                    </h4>
                </th>
                <th>
                    <h4>
                        <u>Name</u>
                    </h4>
                </th>
				<th>
                    <h4>
                        <u>CodeWord</u>
                    </h4>
                </th>
                	<th>
                    <h4>
                        <u></u>
                    </h4>
                </th>
                	<th>
                    <h4>
                        <u></u>
                    </h4>
                </th>
            </tr>
        </thead>

  <tbody>    
    <tr v-for="courseStudent in courseStudentData" :key="courseStudent._id">
      <td scope="row">{{ courseStudent.EmailKey }}</td>
      <td>{{ courseStudent.StudentName }}</td>
       <td>{{ courseStudent.Codeword }}</td>
      <td><a><button class="btn" data-toggle="modal" @click="selectStudentInfo(courseStudent)" data-target="#editStudent"><i class="fa fa-pencil fa-xs"></i></button></a></td>
      <td><a><button class="btn" data-toggle="modal" @click="selectStudent(courseNameData, courseStudent.EmailKey, courseStudent.StudentName)" data-target="#deleteStudent"><i class="fa fa-trash fa-xs"></i></button></a></td>
    </tr>
  </tbody>
</table>
  <div>
        <p class="text-center mb-0">{{ currentPage+1 }} / {{ pages }}</p>
        <ul class="pagination justify-content-center">
            <li class="page-item" :class="{disabled: prevUrl === ''}">
                <button class="page-link" @click="checkPage(prevUrl)">Previous</button>
            </li>
            <li class="page-item" :class="{disabled: nextUrl === ''}">
                <button class="page-link" @click="checkPage(nextUrl)">Next</button>
            </li>
        </ul>
  </div>
<!-- Modal Add Student -->
<div class="modal fade" id="addStudentModel" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Edit Student</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form @submit.prevent="addStudent(addStudentName, addStudentEmail)">
      <div class="modal-body">
        <div class="container-fluid">
        <div class="row">
            <div class=" col-md-6">
            Enter Student Name: 
            </div>
             <div class=" col-md-6">
             <input type="text" class="form-control" pattern=".{3,16}" v-model="addStudentName" placeholder="Enter Student Name" data-toggle="tooltip" title="Atleast 3-16 characters" required>
        </div>
        </div>
        <br>
           <div class="row">
            <div class=" col-md-6">
            Enter Student Email: 
            </div>
             <div class=" col-md-6">
              <input type="email" class="form-control" placeholder="Enter Student Email" required title="Please enter proper Email ID" pattern="\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+" v-model="addStudentEmail">
        </div>
      </div>
        <div class="row">
            <div class=" col-md-6">
            Remaining Codewords : 
            </div>
            <div class=" col-md-6">
               {{  courseData.oldCodewords.length }} 
            </div>
      </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="create" class="btn btn-primary" :disabled="courseData.oldCodewords.length <= 0">Add Student</button>
        <button type="cancel" class="btn btn-danger" data-dismiss="modal">Cancel</button>
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
        <button type="button" class="btn btn-danger" @click="deleteStudent(selectCourseName, selectEmailKey)">Delete Student</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
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
          <div class=" col-md-6">
            <input type="text" v-model="editStudentName" required>
          </div>
          <div class="col-md-6">
            <input type="text" v-model="editStudentEmail" required>
          </div>
          </div>
      </div>
      <div class="modal-footer">
        <button type="create" class="btn btn-primary">Update Details</button>
        <button type="cancel" class="btn btn-danger" data-dismiss="modal">Cancel</button>
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
          <div class=" col-md-6">
        Start Date: </div>
          <div class="col-md-6">
            <div class="form-group">
        <input type="date" id="startDate" class="form-control" title="Atleast 6-15 characters" required v-model="selectstartDate" @click="changeEndDate"></div></div>
       </div>
        <div class="row">
          <div class=" col-md-6">
        End Date: </div><div class="col-md-6"><div class="form-group"><input type="date" required id="endDate" class="form-control" v-model="selectendDate"></div></div>
        </div>
             <div class="row">
          <div class=" col-md-6">
        Start Survey URL: </div> <div class="col-md-6"><div class="form-group"><input type="text" class="form-control" v-model="selectstartSurvey"></div></div></div>
          <div class="row">
          <div class=" col-md-6">
        End Survey URL: </div> <div class="col-md-6"><div class="form-group"><input type="text" class="form-control" v-model="selectendSurvey"></div></div></div>
        </div>
                <button type="cancel" class="btn btn-primart" data-dismiss="modal">Cancel</button>
        <button type="create" class="btn btn-danger" >Save Changes</button>
      </div>
      </form>
    </div>
  </div>
</div>
</div>    
</template>
<script>
import swal from 'sweetalert2'
/* global axios $ */
export default {
  name: 'CourseStudent',
  data () {
    return {
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
      pages: '',
      prevUrl: '',
      nextUrl: '',
      totalStudents: '',
      selectstartDate: '',
      selectendDate: '',
      selectstartSurvey: '',
      selectendSurvey: '',
      addStudentName: '',
      addStudentEmail: ''
    }
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
        this.currentPage = response.data.currentPage
        this.pages = response.data.pages
        this.nextUrl = response.data.nextUrl
        this.prevUrl = response.data.prevUrl
        this.totalStudents = response.data.totalStudents
        this.acknowledged = response.data.Acknowledged
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
      this.selectCourseName = courseName
      this.selectEmailKey = emailKey
      this.selectstudentName = studentName
      this.selectedEmailKey = emailKey
      this.selectedStudentName = studentName
    },
    deleteStudent (courseName, emailKey) {
      axios({
        method: 'post',
        url: 'codeword/deletecoursestudent',
        headers: {
          token: window.localStorage.getItem('token')
        },
        data: {
          CourseNameKey: courseName,
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
    },
    addStudent (studentName, studentEmail) {
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
          newCodeword: this.courseData.oldCodewords[0]
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
      this.selectstartDate = courseDetails.Startdate
      this.selectendDate = courseDetails.Enddate
      this.selectstartSurvey = courseDetails.PreSurveyURL
      this.selectendSurvey = courseDetails.PostSurveyURL
    },
    selectStudentInfo (studentDetails) {
      this.editStudentName = studentDetails.StudentName
      this.editStudentEmail = studentDetails.EmailKey
      this.editStudentId = studentDetails._id
    }
  }
}
</script>

<style>
.btn {
    background-color: DodgerBlue;
    border: none;
    color: white;
    padding: 12px 16px;
    font-size: 16px;
    cursor: pointer;
}
.btn:hover {
    background-color: RoyalBlue;
}
</style>
