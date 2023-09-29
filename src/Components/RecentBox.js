import React from 'react';
import Container from './Container';

export default function RecentBox(props) {
    let recents;

    recents = props.recentData.map(
        (data, index) => {
            return <li style={{
                cursor: "pointer"
            }} key={index} onClick={() => props.handler(data.lat, data.lon)}>{data.name}</li>
        }
    )

    return <Container>
        <div className='col-6 offset-3 mt-3'>
            <div className="card border-primary">
                <div className="card-body">
                    <h4 className="card-title">Recents</h4>
                    <ul>
                        {recents}
                    </ul>
                </div>
            </div>
        </div>
    </Container>;
}
