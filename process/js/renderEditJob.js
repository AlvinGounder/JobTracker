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

        /* -- Format / Parse variables to pre-populate fields -- */
        var jobDueDate = this.formatFromDisplayDate(loadEditJob[0].jobDueDate);
        var cavityDueDate = this.formatFromDisplayDate(loadEditJob[0].cavityDueDate);

        // console.log("jobDue: " + jobDueDate);
        // console.log("cavityDue: " + cavityDueDate);
        var hardware = !loadEditJob[0].hardware=="YES"?false:true;
        /*  -- End Format -- */


        /* -- Push parsed values into new object -- */
        var updatedJob = loadEditJob[0];
        updatedJob['jobDueDate'] = jobDueDate;
        updatedJob['cavityDueDate'] = cavityDueDate;
        updatedJob['hardware'] = hardware;
        /* --  End Push new values -- */

    return {
      allJobs: loadJobs,
      allEditJobs: loadEditJob,
      editJob: updatedJob
    }
  }, //getInitialState

  handleEdit: function(){
    console.log( "Saving Changes..");

    // Remove the job being edited from the all Jobs list
    var updatedJobs = this.state.allJobs;
    var editJobs = JSON.parse(fs.readFileSync(editJobLocation))[0];

    var itemIndex = _.findIndex(updatedJobs, editJobs);
    var removedItem = updatedJobs.splice(itemIndex, 1);
    console.log ("removedItem is:" + removedItem);

    // console.log("itemIndex: " + itemIndex);
    // console.log ("allJobs: " + JSON.stringify(this.state.allJobs));
    // console.log ("updateJobs: " + JSON.stringify(updatedJobs));
    var editedJob = this.state.editJob;
    /* -- Pre-Save formatting --*/
    console.log(this.state.editJob.jobDueDate);
    console.log(this.state.editJob.cavityDueDate);
    editedJob.jobDueDate    = !this.state.editJob.jobDueDate?"":this.formatToDisplayDate(this.state.editJob.jobDueDate);
    editedJob.cavityDueDate = !this.state.editJob.cavityDueDate?"":this.formatToDisplayDate(this.state.editJob.cavityDueDate);
    if (editedJob.cavityDueDate.indexOf("NaN-NaN-NaN")) editedJob.cavityDueDate="";

    editedJob.hardware      = this.state.editJob.hardware?"YES":"";

    /* -- Finished Pre-Save formatting */

    // Add the updated job to the All Jobs list
    updatedJobs.push(editedJob);

    //Write the Updated Jobs list to the file
    // console.log ("To be written: " + JSON.stringify(updatedJobs));
    fs.writeFileSync(jobsLocation, JSON.stringify(updatedJobs), 'utf8',
      function(err){
        if (err) {
          console.log("Saving Jobs failed with error: " + err);
        }
        // console.log("Saved File");
    });


    // Call the Cancel Function to clean up other Tasks
    this.handleCancel();

  },

  formatFromDisplayDate: function (date){
    var daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var formatDate = new Date(date);
    // console.log(this.state.editJob.cavityDueDate);
    // console.log("formatDate: " + formatDate.toUTCString());
    return formatDate.getFullYear() + "-"
      + (formatDate.getMonth()+1<10? "0"+(formatDate.getMonth()+1): formatDate.getMonth()+1) + "-"
      + (formatDate.getDate()<10? "0"+formatDate.getDate(): formatDate.getDate());
  },

  formatToDisplayDate: function (date){
    var daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var formatDate = new Date(date);
    return daysInWeek[formatDate.getDay()] + " " + formatDate.getDate() + "-" + (monthNames[formatDate.getMonth()]) + "-" + formatDate.getFullYear();
  },

  handleCancel: function(){
    fs.writeFileSync(editJobLocation, "[]", 'utf8',
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
    // console.log(JSON.stringify(EditedJob));

    this.setState({
        editJob: EditedJob
    })
  },

  handleSCSChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['SCS'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleDCSChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['DCS'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleJobDueChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['jobDueDate'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleCavityDueChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['cavityDueDate'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleSSLChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['SSL'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleDSLChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['DSL'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleTSLChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['TSL'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleBF2Change: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['BF2'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleBF4Change: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['BF4'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleOpenTopsChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['openTops'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleNotesChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['Notes'] = event.target.value;
    this.setState({
        editJob: EditedJob
    })
  },

  handleHardwareChange: function(event){
    var EditedJob = this.state.editJob;

    EditedJob['hardware'] = event.target.checked;
    // console.log(EditedJob['hardware']);
    this.setState({
        editJob: EditedJob
    })
  },

  render: function(){


    return(
      <div className="application">
        <div className="interface">
          <form className="edit-job form-horizontal">
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
                <select className="form-control" id="doorType" value={this.state.editJob.doorType} onChange={this.handleDoorTypeChange}>
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
                  id="doorTypeText" value={this.state.editJob.doorTypeText} onChange={this.handleDoorTypeTextChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="jambType">Jamb Type</label>
              <div className="col-sm-5">
                <select className="form-control" id="jambType" value={this.state.editJob.jambType} onChange={this.handleJambTypeChange}>
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
                  id="jambTypeText" value={this.state.editJob.jambTypeText} onChange={this.handleJambTypeTextChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="SCS">SCS</label>
              <div className="col-sm-4">
                <input type="text" className="form-control"
                  id="SCS" value={this.state.editJob.SCS} onChange={this.handleSCSChange} />
              </div>
              <label className="col-sm-2 control-label" htmlFor="DCS">DCS</label>
              <div className="col-sm-4">
                <input type="text" className="form-control"
                  id="DCS" value={this.state.editJob.DCS} onChange={this.handleDCSChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="jobDueDate">Job Due</label>
              <div className="col-sm-4">
                <input type="date" className="form-control"
                  id="jobDueDate" value={this.state.editJob.jobDueDate} onChange={this.handleJobDueChange}/>
              </div>
              <label className="col-sm-2 control-label" htmlFor="cavityDueDate">Cav. Due</label>
              <div className="col-sm-4">
                <input type="date" className="form-control"
                  id="cavityDueDate" value={this.state.editJob.cavityDueDate} onChange={this.handleCavityDueChange}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="HW">HW</label>
              <div className="col-sm-1">
                <input type="checkbox" className="form-control" value="YES"
                  id="HW" checked={this.state.editJob.hardware} onChange={this.handleHardwareChange}/>
              </div>
              <label className="col-sm-1 control-label" htmlFor="SSL">SSL</label>
              <div className="col-sm-2">
                <input type="text" className="form-control"
                  id="SSL" value={this.state.editJob.SSL} onChange={this.handleSSLChange}  />
              </div>
              <label className="col-sm-1 control-label" htmlFor="DSL">DSL</label>
              <div className="col-sm-2">
                <input type="text" className="form-control"
                  id="DSL" value={this.state.editJob.DSL} onChange={this.handleDSLChange} />
              </div>
              <label className="col-sm-1 control-label" htmlFor="TSL">TSL</label>
              <div className="col-sm-2">
                <input type="text" className="form-control"
                  id="TSL" value={this.state.editJob.TSL} onChange={this.handleTSLChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-1 control-label" htmlFor="BF2">BF2</label>
              <div className="col-sm-2">
                <input type="text" className="form-control"
                  id="BF2" value={this.state.editJob.BF2} onChange={this.handleBF2Change} />
              </div>
              <label className="col-sm-1 control-label" htmlFor="BF4">BF4</label>
              <div className="col-sm-2">
                <input type="text" className="form-control"
                  id="BF4" value={this.state.editJob.BF4} onChange={this.handleBF4Change} />
              </div>
              <label className="col-sm-2 control-label" htmlFor="openTops">OpenTops</label>
              <div className="col-sm-3">
                <input type="text" className="form-control" id="openTops" value={this.state.editJob.openTops} onChange={this.handleOpenTopsChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="jobNotes">Notes</label>
              <div className="col-sm-10">
                <textarea className="form-control" rows="2" cols="50"
                  id="jobNotes" value={this.state.editJob.Notes} onChange={this.handleNotesChange}></textarea>
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-3 col-sm-9">
                <div className="pull-right">
                  <button type="button" className="btn btn-default" onClick={this.handleCancel}>Cancel</button>&nbsp;
                  <button type="button" className="btn btn-primary" onClick={this.handleEdit}>Save</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    ) //return
  } //render
});//MainInterface

ReactDOM.render(
    <MainInterface />,
    document.getElementById('Tasks')
); //render
