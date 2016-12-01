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

var MainInterface = React.createClass({
  getInitialState: function(){
    return {
      myJobs: loadJobs,
      myCompletedJobs: loadCompleted,
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
    if (this.state.completedJob["jobNumber"] !== null) {
      loadCompleted.push(this.state.completedJob);

      fs.writeFile(completedLocation, JSON.stringify(loadCompleted), 'utf8', (err) => {
         if (err){
           console.log("Saving Completed Jobs failed with error: " + err);
         }
         console.log("setting completedJob to Null");
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
    this.setState({
      myJobs: tempJobs,
      taskBodyVisible: false
    })
    ipc.sendSync("updatedJobsData");
  }, //addJob

  openAllJobsWindow: function(){
    ipc.sendSync("openAllJobsWindow");
  }, //openAllJobsWindow

  completeMessage: function(item){
    var allJobs = this.state.myJobs;
    var newJobs = _.without(allJobs, item);
    console.log("In the Jobs Complete");
    this.setState ({
      myJobs: newJobs,
      completedJob: item
    });
    ipc.sendSync("updatedJobsData");
    ipc.sendSync("updatedCompletedData");
  },//completeMessage

  moveItemUp: function(item){
    var allJobs = this.state.myJobs;
    var newItem = item;
    newItem["jobNumber"] = item["jobNumber"]==1?1:Number(item["jobNumber"])-1;

    var newJobs = _.without(allJobs, item);
    newJobs.push(newItem);
    this.setState ({
      myJobs: newJobs
    });
  },//moveItemUp

  moveItemDown: function(item){
    var allJobs = this.state.myJobs;
    var newItem = item;
    newItem["jobNumber"] = Number(item["jobNumber"])+1;

    var newJobs = _.without(allJobs, item);
    newJobs.push(newItem);
    this.setState ({
      myJobs: newJobs
    });
  },//moveItemDown

  render: function(){
    var myJobs = this.state.myJobs;
    var myCompletedJobs = this.state.myCompletedJobs;
    var orderBy = this.state.orderBy;
    var orderDirection = this.state.direction;

    if (this.state.taskBodyVisible === true) {
      $('#addJob').modal('show');
    } else {
      $('#addJob').modal('hide');
    }

   myJobs = _.orderBy(myJobs, function(item){
     return item[orderBy];
   }, orderDirection);

    myJobs = myJobs.map(function(item, index){
      return (
        <TaskList key = {index}
          singleItem = {item}
          whichItem = {item}
          onComplete = {this.completeMessage}
          onMoveUp = {this.moveItemUp}
          onMoveDown = {this.moveItemDown}
        />
      )
    }.bind(this));

    return (
      <div className="application">
        <div className="interface">
          <Toolbar handleToggle = {this.toggleTaskDisplay}   />
          <AddJob
            handleToggle = {this.toggleTaskDisplay}
            addJob = {this.addJob}
            />
          <AddJob
            openAllJobsWindow = {this.openAllJobsWindow}
            />
          <div className="container">
           <div className="row">
             <div className="jobs col-sm-12">
               <h2 className="jobs-headline">View and Add Jobs</h2>
               <ol className="item-list media-list">{myJobs}</ol>
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
