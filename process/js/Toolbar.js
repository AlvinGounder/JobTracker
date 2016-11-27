var React = require('react');

var Toolbar = React.createClass({
  addJob: function(){
      this.props.handleToggle();
   }, //addJob

  render: function(){
    return(
        <div className="toolbar">
          <div className="toolbar-logo">
            <img className="img-responsive" src="http://www.clearline.co.nz/wp-content/uploads/2015/11/clearline-logo1.png" />
          </div>
          <div className="toolbar-item" onClick={this.addJob}>
            <span className="toolbar-item-button"></span>
            <span className="toolbar-item-text">Add Job</span>
          </div>
        </div>
    );
  }
});

module.exports = Toolbar;
