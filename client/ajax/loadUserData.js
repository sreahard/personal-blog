var React = require('react');
var ReactDOM = require('react-dom');
var BlogList = require('../render/blogList')

var UserLoad = React.createClass({
	getInitialState: function(){
	return {data: []};
},

	loadUsers: function(blog) {
	// var blogPost = this.state.data;
	$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data){
				console.log("inside success")
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err){
				console.log("Broken url is " + this.props.url)
				console.error(this.props.url, status, err.toString());
      		 }.bind(this)
					});
	},

	componentDidMount: function(){
	this.loadUsers();
},


	render: function() {
		return (
			<div>
				<BlogList user={this.state.data}/>
			</div>
			)
	}
})

module.exports = UserLoad;