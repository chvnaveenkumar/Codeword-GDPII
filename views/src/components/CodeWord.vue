/**
 * @author Naveen kumar Chandaluri
 */
<template>
    
    <div id="codeWord" class="container-fluid" style="margin-top:5em">
 
    
    <div class="col-md-12 col-lg-12 col-xs-6 col-sm-6">
      <div class="row">
                <div class="col tooltip-test"> <h3>Codeword set Name: <strong>{{ CodeWordSetName }}</strong></h3></div>
                <div class="col tooltip-test"> <h3>No of Codewords: <strong>{{ codewords.length }}</strong></h3></div>
      </div>      
     <div class="codewordset"> <button type="button" class="btn btn-success" v-if='isPermanent !== true' data-toggle="modal" data-target="#addcodeword" style="marging-left:10px">
   <span class="fa fa-plus"></span> Add Codeword
</button></div>

<div class="modal fade" id="addcodeword" tabindex="-1"  le="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add Codeword</h5>  
        <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form @submit.prevent="addCodeword()">
            
      <div class="modal-body">
         <div class="form-group">
        Enter new codeword: <input type="text" class="form-control" v-model="newCodeword" pattern="[A-Za-z]{5,15}" placeholder="Enter Codeword" data-toggle="tooltip" title="Codeword should be 5-15 alphabets only (Example:FANCY)" required>
      </div>
      <div>
              <button type="cancel" class="btn btn-danger" data-dismiss="modal">Cancel</button>
              <button type="create" class="btn btn-primary">Add Codeword</button>
            </div>
          </div>
      </form>
  </div>
</div>
</div>

<div class="col-md-4 col-lg-4 col-xs-4 col-sm-4">
<!-- Modal -->
<div class="modal fade" id="createcodeword" tabindex="-1" role="dialog" aria-labelledby="createcodewordLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createcodewordLabel">Add Codeword</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
<div class="form-group text-left">
      Upload Cordwords(Excel)
      <input type="file"  name="file" ref="myFile"  class="form-control-file" id="exampleFormControlFile1" style="margin-top:.2em" required>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary">Add</button>
      </div>
    </div>
  </div>
</div>
</div>
  <v-client-table :columns="columns" :data="data" :options="options">
      <button type="button" slot="edit" slot-scope="props" class="btn btn-info btn-sm" data-toggle="modal" @click="selectCodeword(props.row.index)" data-target="#editcodeword" style="marging-left:10px">
        <i class="fas fa-pencil-alt"></i>
      </button>
      <button type="button" slot="delete" slot-scope="props" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#deletecodeword" @click="selectCodeword(props.row.index)" style="marging-left:10px">
        <i class="fas fa-trash"></i>
      </button>
  </v-client-table>


      <!-- Modal Edit Course -->
      
<div class="modal fade" id="editcodeword" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Update Codeword</h5>  
        <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
            <form @submit.prevent="editCodeword(selectedCodeword.toUpperCase(), codewordIndex)">
            <div class="modal-body">
            <div class="form-group">
                          <div class="row">
                <div class="col tooltip-test"> 
               Codeword:
                </div>
                <div class="col tooltip-test"> 
                <input type="text" class="form-control" v-model="selectedCodeword" pattern="[A-Za-z]{5,15}" placeholder="Enter Course Name" data-toggle="tooltip" title="Atleast 5-15 characters" required>
                </div>
                          </div>
            </div>
            <div>
              <button type="cancel" class="btn btn-danger" data-dismiss="modal">Cancel</button>
              <button type="create" class="btn btn-primary">Update Codeword</button>
            </div>
            </div>
            </form>
    </div>
  </div>
</div>
      <!-- Modal Delete codeword -->
<div class="modal fade" id="deletecodeword" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete Codeword</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h1> {{selectedCodeword}} </h1>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal" @click="deleteCodeword">Delete Codeword</button>
      </div>
    </div>
  </div>
</div>
    </div>
    </div>
</template>
<script>
import swal from 'sweetalert2'
/* global axios $ */

export default {
  name: 'CodeWord',
  data () {
    return {
      columns: ['CodewordName', 'edit', 'delete'],
      data: [],
      options: {
        headings: {
          CodewordName: 'Codeword'
        },
        sortable: ['CodewordName'],
        filterable: ['CodewordName'],
        texts: {
          filterPlaceholder: 'Search Codeword',
          filter: '',
          limit: '',
          noResults: 'No Codewords'
        },
        sortIcon: { base: 'fas', up: 'fa-chevron-up', down: 'fa-chevron-down', is: 'fa-sort' }
      },
      CodeWordSetName: '',
      codewords: [],
      selectedCodeword: '',
      codewordIndex: '',
      newCodeword: '',
      isPermanent: Boolean,
      status: false
    }
  },
  mounted () {
    if (this.$route.params.CodeWordSetName == null) {
      this.CodeWordSetName = window.localStorage.getItem('setId')
      console.log(window.localStorage.getItem('setId'))
      this.getCodeWords()
    } else {
      window.localStorage.setItem('setId', this.$route.params.CodeWordSetName)
      this.CodeWordSetName = this.$route.params.CodeWordSetName
      this.getCodeWords()
    }
  },
  watch: {
    isPermanent () {
      if (this.isPermanent) {
        this.columns = ['CodewordName']
      }
    }
  },
  methods: {
    /**
     *
     *Get the codeword from JSON Object
     *@ return the codewords
     */
    async getCodeWords () {
      axios({
        method: 'post',
        url: '/codeword/getCodewords',
        data: {
          CodeWordSetKey: this.CodeWordSetName
        },
        headers: {
          token: window.localStorage.getItem('token')
        }
      }).then(response => {
        this.codewordlist = response.data.codewords
        this.isPermanent = response.data.isPermanent
        this.codewords = response.data.codewords
        var codewordsjson = []
        this.codewordlist.forEach((value, i) => {
          var codeword = {}
          codeword['CodewordName'] = value
          codeword['index'] = i
          codewordsjson.push(codeword)
        })
        this.data = JSON.parse(JSON.stringify(codewordsjson))
      })
    },
    // Gets the selected codeword
    selectCodeword (index) {
      this.codewordIndex = index
      this.selectedCodeword = this.data[index].CodewordName
    },
    // Edits the codeword
    editCodeword (selectedCodeword, index) {
      if (this.codewords.includes(this.selectedCodeword.toUpperCase())) {
        swal('Codeword already exists! Please add different Codeword!!')
      } else {
        this.codewords[this.codewordIndex] = selectedCodeword
        this.updateCodeword()
        $('#editcodeword').modal('hide')
      }
    },
    // Deletes the codeword
    deleteCodeword () {
      this.codewords.splice(this.codewordIndex, 1)
      this.updateCodeword()
    },
    addCodeword () {
      var seqcodewords = []
      var similarcodewords = []
      for (var i = 0; i < this.codewords.length; i++) {
        seqcodewords = []
        for (var j = 0; j < this.codewords[i].length; j++) {
          for (var k = 0; k <= this.codewords[i].length - 3; k++) {
            seqcodewords.push(this.codewords[i].substring(k, k + 3).toUpperCase())
            for (var l = 0; l <= this.newCodeword.length; l++) {
              for (var m = 0; m <= this.newCodeword.length - 3; m++) {
                if (seqcodewords.includes(this.newCodeword.substring(m, m + 3).toUpperCase())) {
                  if (!similarcodewords.includes(this.codewords[i])) {
                    similarcodewords.push(this.codewords[i])
                    break
                  }
                }
              }
              if (seqcodewords.includes(this.newCodeword.substring(m, m + 3).toUpperCase())) {
                break
              }
            }
          }
        }
      }
      if (similarcodewords.length > 0) {
        swal('New codeword is similar to existing codewords: ' + similarcodewords)
      } else if (this.codewords.includes(this.newCodeword.toUpperCase())) {
        swal('Codeword already exists! Please add different Codeword!!')
      } else {
        this.codewords.push(this.newCodeword.toUpperCase())
        this.updateCodeword()
        $('#addcodeword').modal('hide')
      }
    },
    updateCodeword () {
      axios({
        method: 'post',
        url: '/codeword/updatecodeword',
        data: {
          CodeWordSetKey: this.CodeWordSetName,
          updatedCodewords: this.codewords
        },
        headers: {
          token: window.localStorage.getItem('token')
        }
      }).then(response => {
        this.getCodeWords()
      })
    },
    // Adds the codeword
    selectCodewordSet (setName) {
      this.CodewordSetName = setName
    }
  }
}
</script>
<style>
.headingstyle {
  font-weight: bold;
}
.codewordset {
  text-align: right;
}
.countstyle {
  float: right;
}
</style>
