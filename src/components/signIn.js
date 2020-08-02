import React from "react"
import { AmplifySignIn } from "@aws-amplify/ui-react";
import { withAuthenticator } from '@aws-amplify/ui-react';

const signIn = () => {
    return (
        <AmplifySignIn />)
}

export default signIn;