/**
 * @author Ujjawal Kumar
 */
 
<template>
<div id="codeWordSet" class="container-fluid" style="margin-top:5em">
    <div class="col-md-4 col-lg-4 col-xs-0 col-sm-0">
        <button type="button" class="btn btn-success" title="Create CodeWord Set" data-toggle="modal" data-target="#addcourse">
                    <span class="fa fa-plus"></span> Create Codeword Set
                </button>

        <!-- Modal -->        
        <div class="modal fade" id="addcourse" tabindex="-1" role="dialog" aria-labelledby="addcourseLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content" style="width:fit-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addcourseLabel">Create Codeword Set</h5>
                      <button id="exPopover3" class="btn btn-outline-primary"><i class="fa fa-eye"></i> Hint</button>          
                      <b-popover target="exPopover3" triggers="click" placement="auto">
                        <template slot="title">Rules for Creating Codewords</template>
                        <strong>1.</strong> Every codeword should be unique in the set.<br>
                        <strong>2.</strong> The codewords with substring should differ by at least 3 letters.<br>
                        <strong>3.</strong> There should not be any codewords like Ex: daa , baa.<br>
                        <strong>4.</strong> Scan the codewords as soon as the upload is done and give the feedback.<br>
                        <strong>5.</strong> Every codeword should be compared with every other codeword in the set.
                      </b-popover>
                    </div>
                    
                    <!-- Modal Body -->
                    <div class="modal-body">
                        <form @submit.prevent="CreateCodewordSet">
                            <div class="form-group">
                                <input name="dataSetName" type="text" class="form-control" placeholder="Enter Cordword Set Name" data-toggle="tooltip" data-placement="top" title="Enter Cordword Set Name" required>
                            </div>
                            <div class="form-group text-left">
                                Upload Cordword Set(Excel)
                                <input type="file"  name="file" ref="myFile" @change="previewFiles" class="form-control-file" id="exampleFormControlFile1" style="margin-top:.2em" required>
                            </div>
                            <div class="alert alert-info">
                                 <p v-if="count === 0">                          
                                 No File is uploaded. Waiting for user to upload the CodeWord Set.</p>
                                <p v-else-if="count === false">
                                    Codeword is not 5 letter Please upload another excel.</p>
                                <p v-else>
                                    There are {{ count }} codewords in the Uploaded set.</p>
                            </div>
                        </form>
                    </div>
                   <!-- Modal Footer -->	
                      <div class="modal-footer">	
                                <button type="cancel" class="btn btn-danger" data-dismiss="modal">Cancel</button>	
                                <button type="create" :disabled="count === false || count === 0" class="btn btn-success" data-dismiss="modal" @click.prevent="saveCodeWordData">Create</button>	
                      </div>                  
                </div>
            </div>
        </div>
    </div>
    <!-- class="table table-striped" -->
    <div class="table-responsive-sm"> 
    <table class="table" id="codewordsetTable">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">Codeword Set Name</th>
                        <th scope="col">Count</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
            <tr v-for="code in codeWordTempSetData" :key="code._id">
                <td> {{ code.CodeWordSetName }} </td>
                <td id="count">{{ code.Codewords.length }}</td>
                <td> <router-link :to="{ name: 'CodeWord', params: { CodeWordSetName: code.CodeWordSetName } }"><button type="button" class="btn btn-info btn-sm"><i class="fa fa-pencil fa-xs"></i></button></router-link></td>
                <td> <button type="button" data-toggle="modal" v-if='code.isPermanent !== true' class="btn btn-info btn-sm" data-target="#deleteCodwordsetmodel" @click="selectCodewordSet(code.CodeWordSetName)"><i class="fa fa-trash fa-xs"></i></button></td>
            </tr>
        </tbody>
            </table>
<!-- Modal Delete codewordset -->
<div class="modal fade" id="deleteCodwordsetmodel" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete Codeword</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h1> {{CodewordSetName}} </h1>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" @click="deleteCodewordSet">Delete Codeword Set</button>
      </div>
    </div>
  </div>
</div>
    </div>
</div>
</template>

<script>
/* global axios $ */
export default {
  name: 'CodeWordSet',
  data () {
    return {
      files: '',
      codeWordSetCount: [],
      codeWordTempSetData: [],
      codeWordSetData: [],
      count: 0,
      CodewordSetName: ''
    }
  },
  /* global axios */
  methods: {
    // Getting the data from uploaded xls file
    previewFiles () {
      this.files = this.$refs.myFile
      let data = new FormData(document.querySelector('form'))
      axios.post('/codeword/getdataxlsx', data).then(response => {
        this.codeWordSetData = response.data.data
        this.count = response.data.count
        console.log(this.count)
      })
    },

    // Calling API of codeWordSet controller and sending xls data in form of json
    saveCodeWordData () {
      let data = new FormData(document.querySelector('form'))
      let sendData = {
        CodeWordSetName: data.get('dataSetName'),
        Codewords: this.codeWordSetData
      }
      axios({
        method: 'post',
        url: '/codeword/addcodewordset',
        data: sendData,
        headers: {
          token: window.localStorage.getItem('token')
        }
      }).then(response => {
        this.getCodeWordData()
      })
    },
    getCodeWordData () {
      axios({
        method: 'get',
        url: '/codeword/getcodewordset',
        headers: {
          token: window.localStorage.getItem('token')
        }
      }).then(response => {
        this.codeWordTempSetData = response.data.data
      })
    },
    deleteCodewordSet () {
      axios({
        method: 'delete',
        url: '/codeword/deletecodewordset',
        headers: {
          token: window.localStorage.getItem('token')
        },
        data: {
          CodeWordSetName: this.CodewordSetName
        }
      }).then(response => {
        $('#deleteCodwordsetmodel').modal('hide')
        this.getCodeWordData()
      })
    },
    selectCodewordSet (setName) {
      this.CodewordSetName = setName
    }
  },
  mounted () {
    this.getCodeWordData()
  }
}
</script>

<style>
#message {
  margin-top: 5em;
}

  #codewordsetTable {
    /* font-family: "Trebuchet MS", Arial, Helvetica, sans-serif; */
    border-collapse: collapse;
    width: 90%;
    margin-left: 3%;
    margin-top: 3%;
    margin-bottom: 10%;
    border: 1px solid#969494;
}

#codewordsetTable td, #codewordsetTable th {
    /* border: 1px solid #ddd; */
    padding: 8px;
}


#codewordsetTable tr:nth-child(even){background-color: #f2f2f2;}

#codewordsetTable tr:hover {background-color: #ddd;}

#codewordsetTable th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color:#212121;
    color: white;
    width: 60%;
}

#codewordsetTable td {
    text-align: center;
    color:black;
    width: 60%;
}
#btn{
  width: 80%;
  align: right;
  /* margin-left: 50%; */
}
</style>

