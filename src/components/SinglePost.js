import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from 'aws-amplify'
import { getPost } from '../graphql/queries';
import DeletePost from './DeletePost'
import EditPost from './EditPost'
import { onCreateComment, onCreateLike } from '../graphql/subscriptions'
import { createLike } from '../graphql/mutations'
import CreateCommentPost from './CreateCommentPost'
import CommentPost from './CommentPost'
import { FaSadTear } from 'react-icons/fa';
import UsersWhoLikedPost from './UsersWhoLikedPost'
import { Auth } from 'aws-amplify'


/**
 * Component to return the component of feed.
 * @param  props Receives the properties passed from parent component. 
 */
const SinglePost = (props) => {
    const [post, setPost] = useState([])
    const [ownerId, setOwnerId] = useState("");
    const [ownerUsername, setOwnerUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [postLikedBy, setPostLikedBy] = useState([]);
    const [isHovering, setIsHovering] = useState(false);
    const [comments, setComment] = useState([]);
    const [likes, setLikes] = useState([])

    useEffect(() => {

        const findPost = async () => {
            const result = await API.graphql(graphqlOperation(getPost, { id: props.match.params.id }))


            setPost(result.data.getPost)
            setComment(result.data.getPost.comments.items)
            setLikes(result.data.getPost.likes.items)

        }

        findPost()

        Auth.currentAuthenticatedUser().then(
            user => {
                setOwnerId(user.attributes.sub);
                setOwnerUsername(user.username);
            }
        )
        /*
       * Subscription query to subscribe to the comments.
       */

        const comment = API.graphql(graphqlOperation(onCreateComment))
            .subscribe({
                next: commentData => {
                    const createdComment = commentData.value.data.onCreateComment


                    setPost(post.comments.items.push(createdComment))
                }
            })


        return () => {

            comment.unsubscribe();
        }
    }, [post, props]);


    /**
       *  Method to check if user is trying to like his/her own post.
       * @param postId  - Represents the postId for which we need to find the likes
       */

    const likedPost = (postId) => {


        if (post.postOwnerId === ownerId) return true;
        for (let like of post.likes.items) {
            if (like.likeOwnerId === ownerId) {
                return true;
            }
        }

        return false;
    }

    /**
     * Method to store the like for a post.
     * @param postId represents the post ID for which the user want to like. 
     */
    const handleLike = async postId => {
        if (likedPost(postId)) { return setErrorMessage("Can't Like Your Own Post.") } else {
            const input = {
                numberLikes: 1,
                likeOwnerId: ownerId,
                likeOwnerUsername: ownerUsername,
                likePostId: postId
            }

            try {
                await API.graphql(graphqlOperation(createLike, { input }))

            } catch (error) {
                console.error(error)

            }
        }

    }
    /**
  * Method to find the user names of people who have liked the post.
  * @param  postId Represents the post for which we want to find the information of likes.
  */
    const handleMouseHover = async postId => {
        setIsHovering(!isHovering)
        let innerLikes = postLikedBy

        for (let like of post.likes.items) {
            innerLikes.push(like.likeOwnerUsername)
        }

        setPostLikedBy(innerLikes)

    }

    /**
     * Method to display nothing when the user isn't hovering on like symbol
     */
    const handleMouseHoverLeave = async () => {
        setIsHovering(!isHovering)
        setPostLikedBy([])
    }

    return (<div className="posts" style={rowStyle} key={post.id}>

        <h1> {post.postTitle}</h1>
        <span style={{ fontStyle: "italic", color: "#0ca5e297", fontWeight: "bold" }}>
            {"Wrote by: "} {post.postOwnerUsername}

            {" on "}
            <time style={{ fontStyle: "italic" }}>
                {" "}
                {new Date(post.createdAt).toDateString()}
            </time>

        </span>

        <p> {post.postBody}</p>
        <br />

        <span>
            {post.postOwnerId === ownerId &&
                <DeletePost data={post} />
            }

            {post.postOwnerId === ownerId &&
                <EditPost {...post} />
            }

            <span>
                <p className="alert">{post.postOwnerId === ownerId && errorMessage}</p>
                <p onMouseEnter={() => handleMouseHover(post.id)}
                    onMouseLeave={() => handleMouseHoverLeave()}
                    onClick={() => handleLike(post.id)}
                    style={{ color: (likes.length > 0) ? "blue" : "g" }}
                    className="like-button">
                    <i class="thumbs up outline icon"></i>
                    {likes.length}
                </p>
                {
                    isHovering &&
                    <div className="users-liked">
                        {postLikedBy.length === 0 ?
                            " Liked by No one " : "Liked by: "}
                        {postLikedBy.length === 0 ? <FaSadTear /> : <UsersWhoLikedPost data={postLikedBy} />}

                    </div>
                }


            </span>
        </span>

        <span>
            <div class="ui minimal comments">
                <CreateCommentPost postId={post.id} />
                {comments.length > 0 && <span style={{ fontSize: "19px", color: "gray" }}>
                    <h3 class="ui dividing header">Comments</h3> </span>}
                {
                    comments.map((comment, index) => <CommentPost key={index} commentData={comment} />)
                }
            </div>
        </span>
    </div>)
}

const rowStyle = {
    background: '#f4f4f4',
    padding: '10px',
    border: '1px #ccc dotted',
    margin: '14px'
}
export default SinglePost;