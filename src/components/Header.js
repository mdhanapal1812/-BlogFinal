import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom"
import { AmplifySignOut, AmplifySignIn } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify'
import { UserContext } from "../store/UserContext"
import { SignIn } from "aws-amplify-react";
import signIn from "./signIn";



/**
 * Component to return the header navigation section
 */
const Header = (props) => {
    const [userId, setUserId] = useContext(UserContext)

    const handleLogout = async event => {

        await Auth.signOut();

        setUserId(null)


    }



    return (

        <>
            {console.log(userId)}
            <div style={{ fontFamily: "Lucida Console", textAlign: "center", color: " #4d8080", textShadow: "2px 2px #dfecec" }}>
                <h2>
                    HUSTLER'S BLOG</h2></div>
            <div class="ui five item menu">

                <Link to='/' class="item">Home</Link>
                <Link to='/Blog' class="item"> Feed</Link>
                <Link to='/Blog/CreatePost' class="item"> Create Blog</Link>
                <Link to='/checkEditor' class="item"> Editor</Link>
                {

                    userId ?
                        [<AmplifySignOut />, handleLogout]

                        : <Link to='/Blog/CreatePost' class="item"> Sign In </Link>}



            </div>
        </>
    )
}

export default Header;