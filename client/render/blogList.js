var React = require('react');
var ReactDOM = require('react-dom');
var CommentForm = require('./commentForm');
var BlogHeader = require('./blogHeader')

var BlogList = React.createClass({
  propTypes: {
    data: React.PropTypes.array
  },    
    getInitialState: function(){
        return {
          showing: false,
          fltr: null,
          user: []
      };
    },
    loadUser: function() {
    $.ajax({
      url: '/api/v1/blogPosts/user',
      dataType: 'json',
      cache: false,
      success: function(user) {
        // console.log("USER IN AJAX", user)
        this.setState({user: user});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function(){
    this.loadUser();
  },
    toggleBlog: function (blog) {
        this.setState({
          showing: !this.state.showing,
          fltr: blog
      })
    },

    reToggle: function (category) {
        this.setState({
            fltr: null
        })
    },


	render: function() {

        var blogPostHeader = this.props.data.map(function(blog){
        
            var divImages = {
                      backgroundImage: 'url(' + blog.img + ')',
                }

            return (
                <div className="intro-header"  style={divImages}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="site-heading">

                                    <h1>{blog.title}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                )
        });

        var that = this;

        var blogSort = this.props.data.sort(function(a, b){
           var x = a.date, y = b.date;
           return x < y ? -1 : x > y ? 1 : 0;
           });

        var blogData = blogSort.reverse().map(function(blog){

            var blogId = blog._id;
            var blogDate = new Date(blog.date).toDateString();
            var getExerpt = (blog.body.split(" ", 50).join(' ') + " ...");
            var divImages = {
                  backgroundImage: 'url(' + blog.img + ')',
            }


            var commentSort = blog.comments.sort(function(a, b){
               var x = a.date, y = b.date;
               return x < y ? -1 : x > y ? 1 : 0;
               });


            var comments = commentSort.reverse().map(function(comments){
                
            // Get user avatars from various user routes 

                if (comments.user != null) {
                   if (comments.user.local != null) {

                        var hash = md5(comments.user.local.email);
                        var size = 60;
                        var genericAvatar = 'http://reahard.rocks/images/bit-me.jpg';
                        var url = 'http://gravatar.com/avatar/' + hash + "?s=" + size + "&d=" + genericAvatar;
                        var username = comments.user.local.username

                    } else if (comments.user.github != null) {
                        
                        var url = "https://avatars.githubusercontent.com/u/" + comments.user.github.id;
                        var username = comments.user.github.name

                    } else if (comments.user.facebook != null) {
                        
                        var url = "http://graph.facbook.com/" + comments.user.facebook.id + "/picture?type=square";
                        var username = comments.user.facebook.name

                    } else if (comments.user.twitter != null) {
                    
                        var url = "https://twitter.com/" + comments.user.twitter.username + "/profile_image?size=original";
                        var username = comments.user.twitter.username
                    }
                
                var commentDate = new Date(comments.date).toDateString();
                
                return (
                    <div className="containerBlog">
                        <div className="row">
                            <img className="img-circle-xs" src={url}/>
                            <p><i>{comments.comment}</i></p>
                            <p>{username != null ? "Posted by " + username + " on " : "Posted on "} {commentDate} </p>
                            <hr/>
                        </div>
                    </div>
                    )
                    }
                }.bind(this));

            // Load blog exerpts on page load//

            if (!this.state.fltr) {
                return (
                    <div>
                        <div className="container" id="oneBlog">
                            <div className="row">
                                <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                                	<h1>{blog.title}</h1>
                                	<p>by <strong>{blog.author}</strong> posted on <strong>{blogDate}</strong></p>
                                	<hr/>
                        			<div className = "blog" key="blogBody" dangerouslySetInnerHTML = {{__html: getExerpt}}/> 
                                    <a href="#allBlogs"><h3 className="panel-header" onClick={that.toggleBlog.bind(that, blog._id)} > Read More</h3></a>
                                <hr/>

                                 </div>
                            </div>
                        </div>
                    </div>
            	) 
            //Load full blog post for logged out users // 
            } else if (blog._id === this.state.fltr && this.state.user.user != "anonymous") {

                return (
                    <div>
                        <div className="intro-header" style={divImages}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="site-heading">

                                            <h1>{blog.title}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container" id="oneBlog">
                            <div className="row">
                                <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                                    <p> by <strong>{blog.author}</strong> posted on <strong>{blogDate}</strong></p>
                                    <hr/>
                                    <div className = "blog" key="blogBody" dangerouslySetInnerHTML = {{__html: blog.body}}/>       
                                    <hr/>
                                    <a href="#top"><h3 className="panel-header" onClick={that.reToggle}> Back</h3></a>
                                      <br/>
                                    <div className="well">
  

                                        <h4>Leave a Comment:</h4>
                                        <CommentForm blogId={blog._id} onPost={that.props.newData}/>

                                    </div>
                                    <div>
                                        {comments}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) 
            //Load full blog post with comment form for logged in users //
            } else if (blog._id === this.state.fltr && this.state.user.user === "anonymous") {

                return (
                    <div>
                        <div className="intro-header" style={divImages}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="site-heading">

                                            <h1>{blog.title}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container" id="oneBlog">
                            <div className="row">
                                <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                                    <p> by <strong>{blog.author}</strong> posted on <strong>{blogDate}</strong></p>
                                    <hr/>
                                    <div className = "blog" key="blogBody" dangerouslySetInnerHTML = {{__html: blog.body}}/>       
                                    <hr/>
                                    <a href="#top"><h3 className="panel-header" onClick={that.reToggle}> Back</h3></a>
                                      <br/>
                                    <div className="well comments">

                                        {comments}
                                    </div>

                                    <h3>Join the conversation!</h3><br/>
                                        <button type="button" className="btn btn-social btn-local btn-md" data-toggle="modal" data-target="#logIn">
                                            <i className="fa fa-sign-in"></i>Login 
                                        </button> &nbsp;&nbsp;
                                        <button type="button" className="btn btn-social btn-twitter btn-md" data-toggle="modal" data-target="#signUp">
                                            <i className="fa fa-sign-in"></i>Sign Up
                                        </button>
                                        <br/>
                                        <br/>
                                </div>
                            </div>
                        </div>
                    </div>
                ) 
            }
        }.bind(this));

			return (
			<div> 
             {this.state.fltr ? '' : <BlogHeader/>}
			 {blogData}
			</div>
			);
	}
});

module.exports = BlogList;
// module.exports = BlogHeader;




