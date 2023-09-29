import React from 'react';

export default function Loading(props) {
    return <div className={props.classData}>
        <div className="spinner-border text-primary" role="status">
        </div>
        <h4>Loading...</h4>
    </div>;
}
