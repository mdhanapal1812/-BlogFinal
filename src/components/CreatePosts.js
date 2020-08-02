import React, { useState, useEffect } from 'react'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { createPost } from '../graphql/mutations'



/**
 * Component to create a post.
 */
const CreatePost = (props) => {

    const [postOwnerId, setPostOwnerId] = useState("")
    const [postOwnerUsername, setPostOwnerUsername] = useState("")
    const [postTitle, setPostTitle] = useState("")
    const [postBody, setPostBody] = useState("")
    const [postDescription, setPostDescription] = useState("")


    useEffect(() => {
        Auth.currentAuthenticatedUser().then(
            user => {
                setPostOwnerId(user.attributes.sub);
                setPostOwnerUsername(user.username);

            }

        )

    }
    )

    const handleAddPost = async event => {

        event.preventDefault()

        const input = {
            postOwnerId: postOwnerId,
            postOwnerUsername: postOwnerUsername,
            postTitle: postTitle,
            postBody: postBody,
            postDescription: postDescription,
            createdAt: new Date().toISOString()
        }

        await API.graphql(graphqlOperation(createPost, { input }))
        setPostTitle("")
        setPostBody("")
        setPostDescription("")
    }



    return (
        <div style={{ position: "relative" }}>
            <form className="ui form"
                onSubmit={handleAddPost} >
                <div style={{ float: "right" }}>
                    <button className="ui button" type="submit"

                        style={{ fontSize: '19px' }}>Create</button>
                </div>
                <div class="field">
                    <label>Title</label>
                    <input style={{ font: '19px' }}
                        type="text" placeholder="Title"
                        name="postTitle"
                        required
                        value={postTitle}
                        onChange={(event) => {
                            setPostTitle(event.target.value)
                        }}
                    /></div>

                <div class="field">
                    <label>Description</label>
                    <textarea
                        type="text"
                        name="postDescription"
                        rows="3"
                        cols="20"
                        required
                        placeholder="Provide a Description"
                        value={postDescription}
                        onChange={(event) => {
                            setPostDescription(event.target.value)
                        }}
                    /></div>

                <div class="field">
                    <label>Content</label>
                    <textarea
                        type="text"
                        name="postBody"
                        rows="50"
                        cols="5"
                        required
                        placeholder="Create your Post"
                        value={postBody}
                        onChange={(event) => {
                            setPostBody(event.target.value)
                        }}
                        style={{ border: "none" }}
                    /></div>
            </form>
        </div>
    )

}
export default CreatePost;