import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <div>hello world</div>
            <button onClick={()=>navigate("notetab/new")}>new</button>
        </div>
    )
}