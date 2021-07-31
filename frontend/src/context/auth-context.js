import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    login: (token, userId, tokenExpiration) => {}, //for now, just for IDE support
    logout: () => {}
});