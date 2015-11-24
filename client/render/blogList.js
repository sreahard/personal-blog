var React = require('react');
var ReactDOM = require('react-dom');
var CommentForm = require('./commentForm')

var BlogList = React.createClass({

	render: function() {
        var that = this;

        var blogSort = this.props.data.sort(function(a, b){
           var x = a.date, y = b.date;
           return x < y ? -1 : x > y ? 1 : 0;
           });

        var blogData = blogSort.reverse().map(function(blog){

            var blogId = blog._id;
            var blogDate = new Date(blog.date).toDateString();
            
            var commentSort = blog.comments.sort(function(a, b){
               var x = a.date, y = b.date;
               return x < y ? -1 : x > y ? 1 : 0;
               });
            var comments = commentSort.reverse().map(function(comments){
                console.log(comments.user)
                if (comments.user != null) {
                var hash = md5(comments.user.local.email);
                var size = 60;
                var genericAvatar = 'https://scontent-ord1-1.xx.fbcdn.net/hphotos-xaf1/t39.1997-6/p118x90/851586_392309744199671_988013196_n.png';

                var url = 'http://gravatar.com/avatar/' + hash + "?s=" + size + "&d=" + genericAvatar;
                
                var commentDate = new Date(comments.date).toDateString();
                return (
                    <div className="containerBlog">
                        <div className="row">
                            <img className="img-circle-xs" src={url}/>
                            <p><strong>{comments.comment}</strong></p>
                            <p><span className="glyphicon glyphicon-time"></span> {commentDate}</p>
                            <hr/>
                        </div>
                    </div>
                    )
                    }
                }.bind(this));

                return (
                	<div>
                        <div>
                        	<h1>{blog.title}</h1>
                        	<p className="lead"> by {blog.author}</p>
                        	<hr/>
                        	<p><span className="glyphicon glyphicon-time"></span> {blogDate}</p>
                        	<hr/>
                            {blog.img === "" ? '' : <img src={blog.img} className="image-responsive img-blog"/>}
                            {blog.img === "" ? '' : <hr/>}
                			<div key="blogBody" dangerouslySetInnerHTML = {{__html: blog.body}}/>   	
                    	</div>
                        <hr/>
                        <div className="well">
                            <h4>Leave a Comment:</h4>
                            <CommentForm blogId={blog._id} onPost={that.props.newData}/>
                        </div>
                        <div>
                            {comments}
                        </div>
                	</div>
            	) 
              }.bind(this));


			return (
			<div>
			{blogData}
			</div>
			);
	}
});

module.exports = BlogList;

