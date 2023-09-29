import React from 'react';

export default function Container(props) {
    let classData = "container";
    if (props.fluid) {
        classData = "container-fluid";
    }
    return <div className={classData}>
        <div className="row">
            {props.children}
        </div>
    </div>;
}
