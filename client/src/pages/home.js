import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useInputState} from '../bits/useInputState';

import {listTabs} from '../io/api';
import {Wrapper} from '../bits/Wrapper';

export function Home() {
    const [loadedTabs, setLoadedTabs] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [searchTerm, setSearchTerm, searchTermChange, setSearchTermOnChange] = useInputState('', true);
    const [filteredTabs, setFilteredTabs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(!loadedTabs) {
            handleLoad();
            setLoadedTabs(true);
        }
    });

    const initTabs = (tabs) => {
        setTabs(tabs);
        setFilteredTabs(tabs);
        setSearchTerm('');
    }

    const handleLoad = () => {
        listTabs().then((result) => {
            initTabs(result.items);
        }).catch(err => console.log(err));
    }

    const handleTabClick = (key) => {
        navigate('/notetab/' + key);
    }

    const filterFunction = (tab, searchTerm) => {
        return tab.title.includes(searchTerm);
    }

    const onSearchTermChange = (searchTerm) => {
        if (searchTerm) {
            setFilteredTabs(
                tabs.filter((t)=>filterFunction(t,searchTerm))
            );
        }
    }
    setSearchTermOnChange(onSearchTermChange);

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

    const nothingMatchesNotice = () => {
        return (<React.Fragment>
            <div>
                <span className='ntButton noTabs'>
                    Nothing matches this search
                </span>
            </div>
        </React.Fragment>);
    }

    const renderTabs = () => {
        if (tabs.length === 0) {
            return noTabsNotice();
        }
        let targetTabs = tabs;
        if (searchTerm) {
            if (filteredTabs.length === 0) {
                return nothingMatchesNotice();
            }
            targetTabs = filteredTabs;
        }
        return targetTabs.map((tab) => {
            return <div>
                <button className='ntButton' key={tab.key} onClick={()=>handleTabClick(tab.key)}>
                    {tab.title}
                </button>
            </div>;
        });
    }

    return (
        <Wrapper>
            <input className='searchBox' value={searchTerm} onChange={searchTermChange}/>
            <div className='ntButtonHolder'>
                {renderTabs()}
            </div>
        </Wrapper>
    );
}