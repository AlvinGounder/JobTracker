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
    fs.writeFile(jobsLocation, JSON.stringify(this.state.myJobs), 'utf8',
      function(err){
        if (err) {
          console.log("Saving Jobs failed with error: " + err);
        }
    });

    // console.log (loadCompleted);
    //The file is empty
    if (!loadCompleted){
        loadCompleted = this.state.completedJob;
        // console.log("the file was empty");
    }
    //The file is NOT empty so add new JSON data
    else {
        loadCompleted.push(this.state.completedJob);
    }
    // console.log("stringified JSON: " + JSON.stringify(loadCompleted, 'utf8'));

    fs.writeFile(completedLocation, JSON.stringify(loadCompleted), 'utf8',
     function(err){
       if (err){
         console.log("Saving Completed Jobs failed with error: " + err);
       }
     });
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
  }, //addJob


  completeMessage: function(item){
    var allJobs = this.state.myJobs;
    var newJobs = _.without(allJobs, item);
    this.setState ({
      myJobs: newJobs,
      completedJob: item
    });
  },//completeMessage

  moveItemUp: function(item){
    var allJobs = this.state.myJobs;
    var newItem = item;
    newItem["jobNumber"] = item["jobNumber"]==1?1:item["jobNumber"]-1;

    var newJobs = _.without(allJobs, item);
    newJobs.push(newItem);
    this.setState ({
      myJobs: newJobs
    });
  },//moveItemUp

  moveItemDown: function(item){
    var allJobs = this.state.myJobs;
    var newItem = item;
    newItem["jobNumber"] = item["jobNumber"]+1;

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
          <div className="container">
           <div className="row">
             <div className="jobs col-sm-12">
               <h2 className="jobs-headline">Current Jobs</h2>
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
