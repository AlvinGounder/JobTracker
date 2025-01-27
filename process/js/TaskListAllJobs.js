var React = require('react');

var TaskListAllJobs = React.createClass({
  handleComplete: function(){
    this.props.onComplete(this.props.whichItem);
  },
  render: function(){
    return (
      <li className="task-item media">
        <div className="task-info media-body">
          <div className="task-head">
            <span className="task-name"></span>
            <span className="task-name">{this.props.singleItem.jobNumber}. {this.props.singleItem.jobName}</span>
            <span className="task-date-item"><span className="task-date-label">Cavity Due: </span> {this.props.singleItem.cavityDueDate}</span>
            <span className="task-date-item"><span className="task-date-label">Job Due: </span> {this.props.singleItem.jobDueDate}</span>
          </div>
          <div className="taskType-item">
           <span className="taskType-label">Door Type: </span> {this.props.singleItem.doorType} {this.props.singleItem.doorTypeText}
           <span className="taskType-spacer">   </span>
           <span className="taskType-label">Jamb Type: </span> {this.props.singleItem.jambType} {this.props.singleItem.jambTypeText}
           <span className="taskType-spacer">   </span>
           <span className="taskType-spacer">   </span>
           <span className="taskType-label">Open Tops: </span> {this.props.singleItem.openTops}
           <span className="taskType-spacer">   </span>
           <span className="taskType-label">Hardware: </span> {this.props.singleItem.hardware}
          </div>
          <div className="taskType-item">
            <span className="taskType-label">SCS: </span> {this.props.singleItem.SCS}
            <span className="taskType-spacer">   </span>
            <span className="taskType-label">DCS: </span> {this.props.singleItem.DCS}
            <span className="taskType-spacer">   </span>
            <span className="taskType-label">SSL: </span> {this.props.singleItem.SSL}
            <span className="taskType-smallSpacer">   </span>
            <span className="taskType-label">DSL: </span> {this.props.singleItem.DSL}
            <span className="taskType-smallSpacer">   </span>
            <span className="taskType-label">TSL: </span> {this.props.singleItem.TSL}
            <span className="taskType-smallSpacer">   </span>
            <span className="taskType-label">BF2: </span> {this.props.singleItem.BF2}
            <span className="taskType-smallSpacer">   </span>
            <span className="taskType-label">BF4: </span> {this.props.singleItem.BF4}
          </div>
          <div className="task-notes">Note: {this.props.singleItem.Notes}</div>
        </div>
      </li>
    ) //return
  }
});


module.exports = TaskListAllJobs;
