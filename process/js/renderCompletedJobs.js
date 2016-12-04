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
var HeaderNav = require('./HeaderNav');

var MainInterface = React.createClass({
  getInitialState: function(){
    return {
      myCompletedJobs: loadCompletedJobs,
      queryText: '',
      orderBy: 'jobNumber',
      direction: 'asc',
    }
  }, //getInitialState

  searchJobs: function(query){
    this.setState({
      queryText: query
    });
  },//searchJobs

  render: function(){
    var filteredJobs = [];
    var queryText = this.state.queryText;
    var myCompletedJobs = this.state.myCompletedJobs;
    var orderBy = this.state.orderBy;
    var orderDirection = this.state.direction;

   myCompletedJobs = _.orderBy(myCompletedJobs, function(item){
     return parseInt(item[orderBy]);
   }, orderDirection);

   for (var i = 0; i < myCompletedJobs.length; i++) {
     if (myCompletedJobs[i].jobName.toLowerCase().indexOf(queryText) != -1){
       filteredJobs.push(myCompletedJobs[i]);
     }
   }

    filteredJobs = filteredJobs.map(function(item, index){
      return (
        <TaskList key = {index}
          singleItem = {item}
          whichItem = {item}
        />
      )
    }.bind(this));

    return (
      <div className="application">
        <HeaderNav
          onSearch = {this.searchJobs}
        />
        <div className="interface">
          <div className="container">
           <div className="row">
             <div className="jobs col-sm-12">
               <h2 className="jobs-headline">Completed Jobs</h2>
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
