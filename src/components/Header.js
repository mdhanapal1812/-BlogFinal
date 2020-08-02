import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify'



/**
 * Component to return the header navigation section
 */
const Header = (props) => {



    return (
        <div class="ui five item menu">

            <Link to='/' class="item">Home</Link>
            <Link to='/Blog' class="item"> Feed</Link>
            <Link to='/Blog/CreatePost' class="item"> Create Blog</Link>
            <AmplifySignOut />



        </div>
    )
}

export default Header;