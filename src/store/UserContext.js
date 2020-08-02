import React, { createContext, useState, useEffect } from 'react'
import { useHistory, useLocation } from "react-router";
import { AmplifySignIn } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify'

export const UserContext = createContext({});

export const UserProvider = props => {

    const [userId, setUserId] = useState(null);
    const history = useHistory();
    const location = useLocation();
    useEffect(() => {
        Auth.currentAuthenticatedUser().then(
            user => {
                setUserId(user.attributes.sub)
            }

        ).catch(() => {
            if (!['/signIn']) {
                history.push('/signIn');
            }

        }

        );
    }, [history]
    )

    return <UserContext.Provider value={[userId, setUserId]}>{props.children}</UserContext.Provider>;
}