import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {listTabs} from '../io/api';
import {Wrapper} from '../bits/Wrapper';

export function Home() {
    const [loadedTabs, setLoadedTabs] = useState(false);
    const [tabs, setTabs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(!loadedTabs) {
            handleLoad();
        }
    });

    const handleLoad = () => {
        listTabs().then((result) => {
            setTabs(result.items);
        }).catch(err => console.log(err));
    }

    const handleTabClick = (key) => {
        navigate('notetab/' + key);
    }

    const renderItems = () => {
        return tabs.map((tab) => {
            return <button key={tab.key} onClick={()=>handleTabClick(tab.key)}>
                {tab.title}
            </button>;
        });
    }

    return (
        <Wrapper>
            <div>hello world</div>
            <button onClick={()=>navigate("notetab/new")}>new</button>
            {renderItems()}
        </Wrapper>
    );
}