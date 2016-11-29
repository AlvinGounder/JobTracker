var $ = jQuery = require('jquery');
var _ = require('lodash');
var bootstrap = require('bootstrap');
var fs = eRequire('fs');
var loadCompletedJobs = JSON.parse(fs.readFileSync(completedJobsLocation));

var electron = eRequire('electron');
var ipc = electron.ipcRenderer;

var React = require('react');
var ReactDOM = require('react-dom');
var TaskList = require('./TaskListCompletedJobs');

var MainInterface = React.createClass({
  getInitialState: function(){
    return {
      myJobs: loadCompletedJobs,
      orderBy: 'jobNumber',
      direction: 'asc',
    }
  }, //getInitialState

  render: function(){
    var myJobs = this.state.myJobs;
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
               <h2 className="jobs-headline">Completed Jobs</h2>
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
