/* jshint esversion: 6 */
/* jshint esversion: 11 */
/* jshint ignore:start */

import React, { createContext } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {

    return (
        <>
            <BookingContext.Provider >
                {children}
            </BookingContext.Provider>
        </>
    )
}
/* jshint ignore:end */

