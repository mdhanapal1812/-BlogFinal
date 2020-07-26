import React from 'react'

/**
 * Component to display the usernames of people who have liked the post
 * @param  props Receives the properties passed from parent component. 
 */

const UsersWhoLikedPost = (props) => {

    const allUsers = props.data
    return allUsers.map((user) => {
        return (

            <div key={user}>
                <span style={{ fontStyle: "bold", color: "#ged" }}>
                    {user}

                </span>

            </div>

        )
    })

}
export default UsersWhoLikedPost