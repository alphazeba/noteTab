import React from 'react';
import {useNavigate} from 'react-router-dom';
import './Wrapper.css';

export function Wrapper({children}) {
    const navigate = useNavigate();
    return (
        <div>
            <h1 className='wrapper' onClick={()=>navigate("/")}>Note Tab</h1>
            <div>
                {children}
            </div>
        </div>
    );
}