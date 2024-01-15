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
            setLoadedTabs(true);
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

    const noTabsNotice = () => {
        return (<React.Fragment>
            <div>
                <span className='ntButton noTabs'>
                    Tabs would show up here
                </span>
            </div>
            <div>
                <span className='ntButton noTabs'>
                    press the (+) to create a tab
                </span>
            </div>
        </React.Fragment>);
    }

    const renderTabs = () => {
        if (tabs.length === 0) {
            return noTabsNotice();
        }
        return tabs.map((tab) => {
            return <div>
                <button className='ntButton' key={tab.key} onClick={()=>handleTabClick(tab.key)}>
                    {tab.title}
                </button>
            </div>;
        });
    }

    return (
        <Wrapper>
            <div className='ntButtonHolder'>
                {renderTabs()}
            </div>
        </Wrapper>
    );
}