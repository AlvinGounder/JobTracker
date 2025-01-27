var $ = jQuery = require('jquery');
var _ = require('lodash');
var bootstrap = require('bootstrap');
var fs = eRequire('fs');
var loadJobs = JSON.parse(fs.readFileSync(jobsLocation));

var electron = eRequire('electron');
var ipc = electron.ipcRenderer;

var React = require('react');
var ReactDOM = require('react-dom');
var TaskList = require('./TaskListAllJobs');

var MainInterface = React.createClass({
  getInitialState: function(){
    return {
      myJobs: loadJobs,
      direction: 'asc',
    }
  }, //getInitialState

  render: function(){
    var myJobs = this.state.myJobs;
    var orderDirection = this.state.direction;

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
