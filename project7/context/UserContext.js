import React from 'react';



// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
const UserContext = React.createContext({ user: {} });

export default UserContext;