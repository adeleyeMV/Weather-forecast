import React from 'react';
import Container from './Container';
export default function Login(props) {
    return <>
        <Container>
            <div className="col-5">
                <button className='btn btn-primary' onClick={props.handler}>
                    Continue with Google
                </button>
            </div>
        </Container>
    </>;
}
