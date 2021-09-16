import { useState, createContext, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = createContext({
    token: '',
    isLoggedIn: false,
    login: token => { },
    logout: () => { }
});


const calculatedRemainingTime = expirationTime => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingTime = adjExpirationTime - currentTime;

    return remainingTime;
}

const restoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');
    const remainingTime = calculatedRemainingTime(expirationTime);

    if (remainingTime <= 3600) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime
    }
}

export const AuthenticationProvider = (props) => {
    const tokenData = restoredToken();
    let initialToken;

    if (tokenData) {
        initialToken = tokenData.token;
    }

    const [token, setToken] = useState(initialToken);

    const userLoggenIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculatedRemainingTime(expirationTime);

        logoutTimer = setTimeout(logoutHandler, remainingTime);
    }

    useEffect(() => {
        if (tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);

    const contextValue = {
        token,
        isLoggedIn: userLoggenIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>


}

export default AuthContext;