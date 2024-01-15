import React from 'react';

export function Wrapper({children}) {
    return (
        <div>
            <h1 className='header'>
                <a href='/'>
                    <img 
                        className='folderIcon hoverLift' 
                        src={process.env.PUBLIC_URL + '/foldericon.svg'} 
                    />
                </a>
                <span className='titleSpot' href="/">Note Tab</span>
                <a className='titleSpot thePlus hoverLift' href="/notetab/new">+</a>
            </h1>
            <div>
                {children}
            </div>
        </div>
    );
}