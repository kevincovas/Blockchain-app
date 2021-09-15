import React from 'react';

const Context = React.createContext({
    saleProducts: [],
    setSaleProducts: () => {}
});

export default Context