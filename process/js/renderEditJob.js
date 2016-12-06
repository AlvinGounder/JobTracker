var $ = jQuery = require('jquery');
var _ = require('lodash');
var bootstrap = require('bootstrap');
var fs = eRequire('fs');
var loadEditJob = JSON.parse(fs.readFileSync(editJobLocation));
var loadJobs = JSON.parse(fs.readFileSync(jobsLocation));

var electron = eRequire('electron');
var ipc = electron.ipcRenderer;

var React = require('react');
var ReactDOM = require('react-dom');

var MainInterface = React.createClass({
  getInitialState: function(){
    return {
      allJobs: loadJobs,
      allEditJobs: loadEditJob,
      origEditJob: loadEditJob[1],
      editJob: loadEditJob[1]
    }
  }, //getInitialState

  handleEdit: function(){

  },

  handleCancel: function(){
    var origEditJob = this.state.origEditJob;
    var allEditJobs = this.state.allEditJobs;
    var clearEditJob = _.without(allEditJobs, origEditJob);
    // console.log("Cancelled - " + JSON.stringify(clearEditJob));
    fs.writeFileSync(editJobLocation, JSON.stringify(clearEditJob), 'utf8',
      function(err){
        if (err) {
          console.log("Saving Edit Jobs failed with error: " + err);
        }
    });
    ipc.sendSync("exitEditWindow");
  },

  handleJobNumberChange: function(event){
    var EditedJob = this.state.editJob;
    EditedJob['jobNumber'] = event.target.value;

    this.setState({
        editJob: EditedJob
    })
  },

  handleJobNameChange: function(event){
    var EditedJob = this.state.editJob;
    EditedJob['jobName'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleDoorTypeChange: function(event){
    var EditedJob = this.state.editJob;
    EditedJob['doorType'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleDoorTypeTextChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['doorTypeText'] = event.target.value;
    console.log(JSON.stringify(EditedJob));

    this.setState({
        editJob: EditedJob
    })
  },

  handleJambTypeChange: function(event){
    var EditedJob = this.state.editJob;
    EditedJob['jambType'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleJambTypeTextChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['jambTypeText'] = event.target.value;
    console.log(JSON.stringify(EditedJob));

    this.setState({
        editJob: EditedJob
    })
  },

  render: function(){
    var unparsedDoorType = this.state.editJob.doorType;
    var doorType = unparsedDoorType.split(" *")[0];
    var doorTypeText = unparsedDoorType.split(" *")[1];

    var unparsedJambType = this.state.editJob.jambType;
    var jambType = unparsedJambType.split(" *")[0];
    var jambTypeText = unparsedJambType.split(" *")[1];

    // console.log(doorType);

    return(
      <div className="application">
        <form className="edit-job form-horizontal" onSubmit={this.handleEdit}>
          <div className="form-group">
            <label className="col-sm-3 control-label" htmlFor="jobNumber">Job Number</label>
            <div className="col-sm-2">
              <input type="text" className="form-control"
                id="jobNumber" value={this.state.editJob.jobNumber} onChange={this.handleJobNumberChange} />
            </div>
            <label className="col-sm-3 control-label" htmlFor="jobName">Job Name</label>
            <div className="col-sm-4">
              <input type="text" className="form-control"
                id="jobName" value={this.state.editJob.jobName} onChange={this.handleJobNameChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-3 control-label" htmlFor="doorType">Door Type</label>
            <div className="col-sm-5">
              <select className="form-control" id="doorType" value={doorType} onChange={this.handleDoorTypeChange}>
                <option value="Flush Panel">Flush Panel</option>
                <option value="Flush Panel  4.75">Flush Panel  4.75</option>
                <option value=" ">-----------------------</option>
                <option value="Avon  U/Groove">Avon  U/Groove</option>
                <option value="Headland  U/Groove">Headland  U/Groove</option>
                <option value=" ">-----------------------</option>
                <option value="4 Panel Woodgrain">4 Panel Woodgrain</option>
                <option value=" ">-----------------------</option>
                <option value="Atoll  U/Groove">Atoll  U/Groove</option>
                <option value="Brook  U/Groove">Brook  U/Groove</option>
                <option value="Coastland  U/Groove">Coastland  U/Groove</option>
                <option value="Estuary  U/Groove">Estuary  U/Groove</option>
                <option value="Horizon  U/Groove">Horizon  U/Groove</option>
                <option value="Isle  U/Groove">Isle  U/Groove</option>
                <option value="Kent  U/Groove">Kent  U/Groove</option>
                <option value="Lagoon  U/Groove">Lagoon  U/Groove</option>
                <option value="Lakefront  U/Groove">Lakefront  U/Groove</option>
                <option value="Lakeside  U/Groove">Lakeside  U/Groove</option>
                <option value=" ">-----------------------</option>
                <option value="Cornwall  U/Groove">Cornwall  U/Groove</option>
                <option value="Cove  U/Groove">Cove  U/Groove</option>
                <option value="Devon  U/Groove">Devon  U/Groove</option>
                <option value="Norfolk  U/Groove">Norfolk  U/Groove</option>
                <option value="Oxford  U/Groove">Oxford  U/Groove</option>
                <option value="Peninsula  U/Groove">Peninsula  U/Groove</option>
                <option value="Riverbank  U/Groove">Riverbank  U/Groove</option>
                <option value="Somerset  U/Groove">Somerset  U/Groove</option>
                <option value="Stafford  U/Groove">Stafford  U/Groove</option>
                <option value="Surrey  U/Groove">Surrey  U/Groove</option>
                <option value="Thames  U/Groove">Thames  U/Groove</option>
                <option value="Waterfront  U/Groove">Waterfront  U/Groove</option>
                <option value=" ">-----------------------</option>
                <option value="Avon  V/Groove">Avon  U/Groove</option>
                <option value="Headland  V/Groove">Headland  U/Groove</option>
                <option value=" ">-----------------------</option>
                <option value="Atoll  V/Groove">Atoll  V/Groove</option>
                <option value="Brook  V/Groove">Brook  V/Groove</option>
                <option value="Coastland  V/Groove">Coastland  V/Groove</option>
                <option value="Estuary  V/Groove">Estuary  V/Groove</option>
                <option value="Horizon  V/Groove">Horizon  V/Groove</option>
                <option value="Isle  V/Groove">Isle  V/Groove</option>
                <option value="Kent  V/Groove">Kent  V/Groove</option>
                <option value="Lagoon  V/Groove">Lagoon  V/Groove</option>
                <option value="Lakefront  V/Groove">Lakefront  V/Groove</option>
                <option value="Lakeside  V/Groove">Lakeside  V/Groove</option>
                <option value=" ">-----------------------</option>
                <option value="Cornwall  V/Groove">Cornwall  V/Groove</option>
                <option value="Cove  U/Groove">Cove  V/Groove</option>
                <option value="Devon  V/Groove">Devon  V/Groove</option>
                <option value="Norfolk  V/Groove">Norfolk  V/Groove</option>
                <option value="Oxford  V/Groove">Oxford  V/Groove</option>
                <option value="Peninsula  V/Groove">Peninsula  V/Groove</option>
                <option value="Riverbank  V/Groove">Riverbank  V/Groove</option>
                <option value="Somerset  V/Groove">Somerset  V/Groove</option>
                <option value="Stafford  V/Groove">Stafford  V/Groove</option>
                <option value="Surrey  V/Groove">Surrey  V/Groove</option>
                <option value="Thames  V/Groove">Thames  V/Groove</option>
                <option value="Waterfront  V/Groove">Waterfront  V/Groove</option>
                <option value=" ">-----------------------</option>
              </select>
            </div>
            <div className="col-sm-3">
              <input type="text" className="form-control"
                id="doorTypeText" value={doorTypeText} onChange={this.handleDoorTypeTextChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-3 control-label" htmlFor="jambType">Jamb Type</label>
            <div className="col-sm-5">
              <select className="form-control" id="jambType" value={jambType} onChange={this.handleJambTypeChange}>
                <option value="Flat for Architrave 18">Flat for Architrave 18</option>
                <option value="Flat double groove 18">Flat double groove 18</option>
                <option value="Flat double groove 25">Flat double groove 25</option>
                <option value="Flat double groove 30">Flat double groove 30</option>
                <option value="Slimline Architrave 30">Slimline Architrave 30</option>
                <option value="Slimline DBL groove 30">Slimline DBL groove 30</option>
                <option value="Slimline DBL groove 40">Slimline DBL groove 40</option>
                <option value="Archfast 40mm Bev">Archfast 40mm Bev</option>
                <option value="Archfast 60mm Bev">Archfast 60mm Bev</option>
                <option value="Archfast 40mm B/Nose">Archfast 40mm B/Nose</option>
                <option value="Archfast 60mm B/Nose">Archfast 60mm B/Nose</option>
                <option value="Archfast 40mm Col">Archfast 40mm Col</option>
                <option value="Archfast 60mm Col">Archfast 60mm Col</option>
                <option value="Archfast 65mm Gov">Archfast 65mm Gov</option>
              </select>
            </div>
            <div className="col-sm-3">
              <input type="text" className="form-control"
                id="jambTypeText" value={jambTypeText} onChange={this.handleJambTypeTextChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="SCS">SCS</label>
            <div className="col-sm-4">
              <input type="text" className="form-control"
                id="SCS" ref={(ref) => this.inputSCS = ref} />
            </div>
            <label className="col-sm-2 control-label" htmlFor="DCS">DCS</label>
            <div className="col-sm-4">
              <input type="text" className="form-control"
                id="DCS" ref={(ref) => this.inputDCS = ref} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="jobDueDate">Job Due</label>
            <div className="col-sm-4">
              <input type="date" className="form-control"
                id="jobDueDate" ref={(ref) => this.inputJobDueDate = ref}/>
            </div>
            <label className="col-sm-2 control-label" htmlFor="cavityDueDate">Cav. Due</label>
            <div className="col-sm-4">
              <input type="date" className="form-control"
                id="cavityDueDate" ref={(ref) => this.inputCavityDueDate = ref}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="HW">HW</label>
            <div className="col-sm-1">
              <input type="checkbox" className="form-control" value="YES"
                id="HW" ref={(ref) => this.inputHW = ref}/>
            </div>
            <label className="col-sm-1 control-label" htmlFor="SSL">SSL</label>
            <div className="col-sm-2">
              <input type="text" className="form-control"
                id="SSL" ref={(ref) => this.inputSSL = ref} />
            </div>
            <label className="col-sm-1 control-label" htmlFor="DSL">DSL</label>
            <div className="col-sm-2">
              <input type="text" className="form-control"
                id="DSL" ref={(ref) => this.inputDSL = ref} />
            </div>
            <label className="col-sm-1 control-label" htmlFor="TSL">TSL</label>
            <div className="col-sm-2">
              <input type="text" className="form-control"
                id="TSL" ref={(ref) => this.inputTSL = ref} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-1 control-label" htmlFor="BF2">BF2</label>
            <div className="col-sm-2">
              <input type="text" className="form-control"
                id="BF2" ref={(ref) => this.inputBF2 = ref} />
            </div>
            <label className="col-sm-1 control-label" htmlFor="BF4">BF4</label>
            <div className="col-sm-2">
              <input type="text" className="form-control"
                id="BF4" ref={(ref) => this.inputBF4 = ref} />
            </div>
            <label className="col-sm-2 control-label" htmlFor="openTops">OpenTops</label>
            <div className="col-sm-3">
              <input type="text" className="form-control" id="openTops" ref={(ref) => this.inputOpenTops = ref}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="jobNotes">Notes</label>
            <div className="col-sm-10">
              <textarea className="form-control" rows="2" cols="50"
                id="jobNotes" ref={(ref) => this.inputJobNotes = ref}></textarea>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-3 col-sm-9">
              <div className="pull-right">
                <button type="button" className="btn btn-default" onClick={this.handleCancel}>Cancel</button>&nbsp;
                <button type="submit" className="btn btn-primary">Edit Job</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    ) //return
  } //render
});//MainInterface

ReactDOM.render(
    <MainInterface />,
    document.getElementById('Tasks')
); //render
