/**
 * @author Naveen kumar Chandaluri
 */
<template>
    <div id="codeWord" class="container-fluid" style="margin-top:5em">
    <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
      
<h1>Softseventy(70)</h1>
<div class="col-md-4 col-lg-4 col-xs-4 col-sm-4">
   <!-- Button trigger modal -->
<button type="button" class="btn btn-success" title="Create CodeWord" data-toggle="modal" data-target="#createcodeword" style="float:left">
   <span class="fa fa-plus"></span> Add codeword
</button>

<!-- Modal -->
<div class="modal fade" id="createcodeword" tabindex="-1" role="dialog" aria-labelledby="createcodewordLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createcodewordLabel">Add COdeword</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"
          >&times;</span>
        </button>
      </div>
      <div class="modal-body">
<div class="form-group text-left">
                                Upload Cordwords(Excel)
                                <input type="file"  name="file" ref="myFile"  class="form-control-file" id="exampleFormControlFile1" style="margin-top:.2em"
                                    required>
                            </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary">Add</button>
      </div>
    </div>
  </div>
</div>
</div>
<table class="table">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Codewords</th>
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(codeword,index) in codewords" :key="codeword._id">
                        <td scope="row">{{ index+1 }}</td>
                        <td > {{ codeword }}</td>
                        <td><a href="#" class="btn btn-warning"> <i class="fas fa-pencil-alt"></i> </a> 
                        <button type="button" class="btn btn-danger" title="Create CodeWord" data-toggle="modal" data-target="#" style="marging-left:10px">
                             <i class="fas fa-trash"></i>
                             </button> 
                        </td>
                    </tr>
                </tbody>
            </table>
    </div>
    </div>  
</template>
<script>
/* global axios */

export default {
  name: 'CodeWordSet',
  data () {
    return {
      CodeWordSetName: '',
      codewords: []
    }
  },
  created () {
    if (this.$route.params.CodeWordSetName == null) {
      this.CodeWordSetName = window.localStorage.getItem('setId')
      console.log('setid' + this.CodeWordSetName)
      this.getCodeWords()
    } else {
      window.localStorage.setItem('setId', this.$route.params.CodeWordSetName)
      this.CodeWordSetName = this.$route.params.CodeWordSetName
      this.getCodeWords()
    }
  },
  methods: {
    getCodeWords () {
      console.log(this.CodeWordSetName + 'checking')
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
        console.log(response.data.data)
        this.codewords = response.data.data
        console.log(this.codewords)
      })
    }
  }
}
</script>
