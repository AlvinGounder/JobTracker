var React = require("react");

var HeaderNav = React.createClass({
  handleSearch: function(e){
    this.props.onSearch(e.target.value);
  },
  render: function(){
    return (
      <nav className="navigation navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-form navbar-right search-jobs">
            <div className="input-group">
              <input id="SearchJobs" placeholder="Search" onChange={this.handleSearch} autoFocus type="text" className="form-control" aria-label="Search Jobs" />
          </div>{/* input-group */}
        </div>{/* navbar-form */}
      </div>{/* container-fluid */}
    </nav>
    )//return
  }//render
});

module.exports = HeaderNav;
