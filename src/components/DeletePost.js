import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { deletePost } from '../graphql/mutations'

/**
 * Component to delete a post.
 * @param  props Receives the properties passed from parent component. 
 */
const DeletePost = (props) => {


    const handleDeletePost = async postId => {
        const input = {
            id: postId
        }

        await API.graphql(graphqlOperation(deletePost, { input }))
    }

    const post = props.data
    return (
        <button class="small ui red button" onClick={() => handleDeletePost(post.id)}>Delete</button>
    )

}
export default DeletePost;