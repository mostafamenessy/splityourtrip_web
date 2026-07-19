/* jshint esversion: 6 */
/* jshint ignore:start */

import React from 'react';

function Rating({totalRating,OurRating,RatingText}) {
    return (
        <>
            <div className="reviews-wrap mt-0 mb-40">
                <ul>
                    <li className='d-flex flex-column'>
                        <div className="ratings">
                            <i className="flaticon-star-1"></i>
                            <i className="flaticon-star-1"></i>
                            <i className="flaticon-star-1"></i>
                            <i className="flaticon-star-1"></i>
                            <i className="flaticon-star-1"></i>
                            <p>{`(${OurRating} Out Of ${totalRating})`} </p>
                        </div>
                        <div className="content ">
                            <p>{RatingText}</p>
                        </div>
                    </li>

                </ul>
            </div>
        </>
    )
}

export default Rating
/* jshint ignore:end */
