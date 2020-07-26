import React from 'react'

/**
 * Component to return the comment section
 * @param  props Receives the properties passed from parent component. 
 */
const CommentPost = (props) => {

    const { content, commentOwnerUsername, createdAt } = props.commentData
    return (
        <div className="comment">

            <i class="comment alternate icon"></i>

            <div class="content">

                {commentOwnerUsername}

                <div class="metadata">
                    <span class="date">   {new Date(createdAt).toDateString()}</span>
                </div>
                <div class="text">
                    {content}
                </div>
            </div>

        </div>
    )

}
export default CommentPost

