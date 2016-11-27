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
var TaskList = require('./TaskListAllJobs');

var MainInterface = React.createClass({
  getInitialState: function(){
    return {
      myJobs: loadJobs,
      orderBy: 'jobNumber',
      direction: 'asc',
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

  render: function(){
    var myJobs = this.state.myJobs;
    var myCompletedJobs = this.state.myCompletedJobs;
    var orderBy = this.state.orderBy;
    var orderDirection = this.state.direction;

   myJobs = _.orderBy(myJobs, function(item){
     return item[orderBy];
   }, orderDirection);

    myJobs = myJobs.map(function(item, index){
      return (
        <TaskList key = {index}
          singleItem = {item}
        />
      )
    }.bind(this));

    return (
      <div className="application">
        <div className="interface">
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
