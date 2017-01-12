var $ = jQuery = require('jquery');
var _ = require('lodash');
var bootstrap = require('bootstrap');
var fs = eRequire('fs');
var loadJobs = JSON.parse(fs.readFileSync(jobsLocation));
var loadCompleted = JSON.parse(fs.readFileSync(completedLocation));


var electron = eRequire('electron');
var ipc = electron.ipcRenderer;

var React = require('react');
var ReactDOM = require('react-dom');
var TaskList = require('./TaskList');
var Toolbar = require('./Toolbar');
var AddJob = require('./AddJob');
var HeaderNav = require('./HeaderNav');

var MainInterface = React.createClass({
  getInitialState: function(){
    return {
      myJobs: loadJobs,
      myCompletedJobs: loadCompleted,
      queryText: '',
      orderBy: 'jobNumber',
      direction: 'asc',
      taskBodyVisible: false
    }
  }, //getInitialState

  componentDidUpdate: function(){
    fs.writeFileSync(jobsLocation, JSON.stringify(this.state.myJobs), 'utf8',
      function(err){
        if (err) {
          console.log("Saving Jobs failed with error: " + err);
        }
    });

    // console.log (loadCompleted);
    if (this.state.completedJob != null && this.state.completedJob["jobNumber"] !== null) {
      loadCompleted.push(this.state.completedJob);

      fs.writeFile(completedLocation, JSON.stringify(loadCompleted), 'utf8', (err) => {
         if (err){
           console.log("Saving Completed Jobs failed with error: " + err);
         }
        //  console.log("setting completedJob to Null");
         this.setState({
           completedJob: null
         })
       });
    }
    // console.log("stringified JSON: " + JSON.stringify(loadCompleted, 'utf8'));

  }, //componentDidUpdate

  toggleTaskDisplay: function(){
    var tempVisibilty = !this.state.taskBodyVisible;

    this.setState({
      taskBodyVisible: tempVisibilty
    });
  }, //toggleTaskDisplay

  addJob: function(tempJob){
    var tempJobs = this.state.myJobs;
    tempJobs.push(tempJob);

    //sort jobs list by date, then priority
    var sortedTempJobs = _.sortBy(tempJobs, [function(node) {
        return (new Date(node.jobDueDate).getTime());
    }, "jobPriority"]);

    for (var i = 0; i < sortedTempJobs.length; i++) {
      sortedTempJobs[i].jobNumber = i+1;
    }

    this.setState({
      myJobs: sortedTempJobs,
      taskBodyVisible: false
    })
    ipc.sendSync("updatedJobsData");
  }, //addJob

  searchJobs: function(query){
    this.setState({
      queryText: query
    });
  },//searchJobs

  openAllJobsWindow: function(){
    ipc.sendSync("openAllJobsWindow");
  }, //openAllJobsWindow

  openCompletedJobsWindow: function(){
    ipc.sendSync("openCompletedJobsWindow");
  }, //openAllJobsWindow

  completeMessage: function(item){
    var allJobs = _.sortBy(this.state.myJobs, ["jobNumber"]);
    var itemIndex = _.findIndex(allJobs, item);
    var newJobs = _.without(allJobs, item);

    for (i=itemIndex; i<newJobs.length; i++){
      newJobs[i].jobNumber = Number(newJobs[i].jobNumber) - 1;
    }

    this.setState ({
      myJobs: newJobs,
      completedJob: item
    });
    ipc.sendSync("updatedJobsData");
    ipc.sendSync("updatedCompletedData");
  },//completeMessage

  editJob: function(item){
    var editJob = JSON.parse(fs.readFileSync(editJobLocation));
    editJob.push(item);
    // console.log(editJob);
    fs.writeFileSync(editJobLocation, JSON.stringify(editJob), 'utf8',
      function(err){
        if (err) {
          console.log("Saving Edit Jobs failed with error: " + err);
        }
    });
    item = null;
    ipc.sendSync("editJob");
  }, //Edit Job

  render: function(){
    var filteredJobs = [];
    var queryText = this.state.queryText.toLowerCase();

    var myJobs = this.state.myJobs;
    var myCompletedJobs = this.state.myCompletedJobs;
    // var orderBy = this.state.orderBy;
    // var orderDirection = this.state.direction;

    if (this.state.taskBodyVisible === true) {
      $('#addJob').modal('show');
    } else {
      $('#addJob').modal('hide');
    }

  //  myJobs = _.orderBy(myJobs, function(item){
  //    return parseInt(item[orderBy]);
  //  }, orderDirection);

   for (var i = 0; i < myJobs.length; i++) {
     if (myJobs[i].jobName.toLowerCase().indexOf(queryText) != -1){
       filteredJobs.push(myJobs[i]);
     }
   }

  filteredJobs = filteredJobs.map(function(item, index){
    return (
      <TaskList key = {index}
        singleItem = {item}
        whichItem = {item}
        onComplete = {this.completeMessage}
        onEdit = {this.editJob}
      />
    )
  }.bind(this));

    return (
      <div className="application">
        <HeaderNav
          onSearch = {this.searchJobs}
        />
        <div className="interface">
          <Toolbar handleToggle = {this.toggleTaskDisplay}
            openAllJobsWindow = {this.openAllJobsWindow}
            openCompletedJobsWindow = {this.openCompletedJobsWindow}
          />
          <AddJob
            handleToggle = {this.toggleTaskDisplay}
            addJob = {this.addJob}
            />
          <div className="container">
           <div className="row">
             <div className="jobs col-sm-12">
               <h2 className="jobs-headline">View and Add Jobs</h2>
               <ol className="item-list media-list">{filteredJobs}</ol>
             </div>{/* col-sm-12 */}
           </div>{/* row */}
          </div>{/* container */}
        </div>{/* interface */}
      </div>
    )
  }//render
});//MainInterface

ReactDOM.render(
    <MainInterface />,
    document.getElementById('Tasks')
); //render
