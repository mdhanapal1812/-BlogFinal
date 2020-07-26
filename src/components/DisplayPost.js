import React, { useState, useEffect } from 'react'
import { listPosts } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'
import DeletePost from './DeletePost'
import EditPost from './EditPost'
import { onCreatePost, onDeletePost, onUpdatePost, onCreateComment, onCreateLike } from '../graphql/subscriptions'
import { createLike } from '../graphql/mutations'
import CreateCommentPost from './CreateCommentPost'
import CommentPost from './CommentPost'
import { FaSadTear } from 'react-icons/fa';
import { Auth } from 'aws-amplify'
import UsersWhoLikedPost from './UsersWhoLikedPost'

/**
 * Component to display the posts
 */
const DisplayPost = () => {

    const [ownerId, setOwnerId] = useState("");
    const [ownerUsername, setOwnerUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [postLikedBy, setPostLikedBy] = useState([]);
    const [isHovering, setIsHovering] = useState(false);
    const [posts, setPosts] = useState([])

    useEffect(() => {
        /**
         * Retreiving the posts.
         */
        getPosts()

        Auth.currentAuthenticatedUser().then(
            user => {
                setOwnerId(user.attributes.sub);
                setOwnerUsername(user.username);
            }
        )


        /**
         * Subscription query , to subscribe to the messages whenever a new post is created.
         */
        API.graphql(graphqlOperation(onCreatePost))
            .subscribe({
                next: postData => {
                    const newPost = postData.value.data.onCreatePost
                    const prevPosts = posts.filter(post => post.id !== newPost.id)

                    const updatedPosts = [newPost, ...prevPosts]
                    setPosts(updatedPosts)
                }
            })

        /**
         * Subscription query , to subscribe to the messages whenever a post is deleted.
         */
        API.graphql(graphqlOperation(onDeletePost))
            .subscribe({
                next: postData => {

                    const deletedPost = postData.value.data.onDeletePost
                    const updatedPosts = posts.filter(post => post.id !== deletedPost.id)
                    setPosts(updatedPosts)
                }
            })

        /**
         * Subscription query , to subscribe to the messages whenever a post is updated.
         */
        API.graphql(graphqlOperation(onUpdatePost))
            .subscribe({
                next: postData => {
                    const postsOp = posts
                    const updatePost = postData.value.data.onUpdatePost
                    const index = postsOp.findIndex(post => post.id === updatePost.id) //had forgotten to say updatePost.id!
                    const updatePosts = [
                        ...postsOp.slice(0, index),
                        updatePost,
                        ...postsOp.slice(index + 1)
                    ]
                    setPosts(updatePosts)
                }
            })

        /**
         * Subscription query to subscribe to the comments.
         */

        API.graphql(graphqlOperation(onCreateComment))
            .subscribe({
                next: commentData => {
                    const createdComment = commentData.value.data.onCreateComment
                    let postsNew = [...posts]

                    for (let post of postsNew) {
                        if (createdComment.post.id === post.id) {
                            post.comments.items.push(createdComment)
                        }
                    }
                    setPosts(postsNew)
                }
            })

        /** 
         * Subscription query to subscribe to likes on posts.
         */
        API.graphql(graphqlOperation(onCreateLike))
            .subscribe({
                next: postData => {
                    const createdLike = postData.value.data.onCreateLike

                    let postsLike = [...posts]
                    for (let post of postsLike) {
                        if (createdLike.post.id === post.id) {
                            post.likes.items.push(createdLike)
                        }
                    }
                    setPosts(postsLike)
                }
            })
    }
    );

    /**
     *  Retreive the posts and store it in state.
     */
    const getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts))

        setPosts(result.data.listPosts.items)
    }

    /**
     *  Method to check if user is trying to like his/her own post.
     * @param postId  - Represents the postId for which we need to find the likes
     */

    const likedPost = (postId) => {

        for (let post of posts) {
            if (post.id === postId) {
                if (post.postOwnerId === ownerId) return true;
                for (let like of post.likes.items) {
                    if (like.likeOwnerId === ownerId) {
                        return true;
                    }
                }
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
        for (let post of posts) {
            if (post.id === postId) {
                for (let like of post.likes.items) {
                    innerLikes.push(like.likeOwnerUsername)
                }
            }
            setPostLikedBy(innerLikes)
        }
    }

    /**
     * Method to display nothing when the user isn't hovering on like symbol
     */
    const handleMouseHoverLeave = async () => {
        setIsHovering(!isHovering)
        setPostLikedBy([])
    }

    return (

        /**
         * For each post , Display the required content.
         */
        posts.map((post) => {
            return (
                <div className="posts" style={rowStyle} key={post.id}>
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
                                style={{ color: (post.likes.items.length > 0) ? "blue" : "g" }}
                                className="like-button">
                                <i class="thumbs up outline icon"></i>
                                {post.likes.items.length}
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
                            {post.comments.items.length > 0 && <span style={{ fontSize: "19px", color: "gray" }}>
                                <h3 class="ui dividing header">Comments</h3> </span>}
                            {
                                post.comments.items.map((comment, index) => <CommentPost key={index} commentData={comment} />)
                            }
                        </div>
                    </span>
                </div>

            )

        })


    )

}

const rowStyle = {
    background: '#f4f4f4',
    padding: '10px',
    border: '1px #ccc dotted',
    margin: '14px'
}
export default DisplayPost;