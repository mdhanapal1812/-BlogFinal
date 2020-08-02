import React, { useState, useEffect, useContext } from 'react'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { createPost } from '../graphql/mutations'
import { withAuthenticator } from '@aws-amplify/ui-react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UserContext } from "../store/UserContext"

/**
 * Component to create a post.
 */
const CreatePost = (props) => {
    const [userId, setUserId] = useContext(UserContext)
    const [postOwnerUsername, setPostOwnerUsername] = useState("")
    const [postTitle, setPostTitle] = useState("")
    const [postBody, setPostBody] = useState("")
    const [postDescription, setPostDescription] = useState("")


    useEffect(() => {
        Auth.currentAuthenticatedUser().then(
            user => {
                setPostOwnerUsername(user.username);
                console.log(userId);
                setUserId(user.attributes.sub)
                console.log(userId)
            }

        )

    }
    )

    const handleAddPost = async event => {

        event.preventDefault()

        const input = {
            postOwnerId: userId,
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
                    <button className="small ui blue button" type="submit"

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
                    />


                </div>
            </form>
        </div>
    )

}

export default withAuthenticator(CreatePost);