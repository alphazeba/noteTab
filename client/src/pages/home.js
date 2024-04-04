import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useInputState} from '../bits/useInputState';

import {listTabs} from '../io/api';
import {Wrapper} from '../bits/Wrapper';
import {searchFilterFunction} from '../bits/searchFilter'

export function Home() {
    const [loadedTabs, setLoadedTabs] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [
        searchTerm,
        setSearchTerm,
        searchTermChange,
        setSearchTermOnChange
    ] = useInputState('', true);
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

    const goToTab = (key) => {
        navigate('/notetab/' + key);
    }

    const handleTabClick = (key) => {
        goToTab(key);
    }

    const onSearchTermChange = (searchTerm) => {
        if (searchTerm) {
            setFilteredTabs(
                tabs.filter((t)=>searchFilterFunction(t,searchTerm))
            );
        }
    }
    setSearchTermOnChange(onSearchTermChange);

    const handleSubmitSearch = () => {
        console.log('submit pressed');
        let targetTabs = getTargetTabs();
        if (targetTabs.length > 0) {
            goToTab(targetTabs[0].key);
        }
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

    const nothingMatchesNotice = () => {
        return (<React.Fragment>
            <div>
                <span className='ntButton noTabs'>
                    Nothing matches this search
                </span>
            </div>
        </React.Fragment>);
    }

    const getTargetTabs = () => {
        if (searchTerm) {
            return filteredTabs;
        }
        return tabs;
    }

    const renderTabs = () => {
        if (tabs.length === 0) {
            return noTabsNotice();
        }
        if (searchTerm && filteredTabs.length === 0) {
            return nothingMatchesNotice();
        }
        return getTargetTabs().map((tab) => {
            return <div>
                <button
                    className='ntButton'
                    key={tab.key}
                    onClick={()=>handleTabClick(tab.key)}
                >
                    {tab.title}
                </button>
            </div>;
        });
    }

    return (
        <Wrapper>
            <form onSubmit={handleSubmitSearch}>
                <input
                    className='searchBox'
                    value={searchTerm}
                    onChange={searchTermChange}
                    autoFocus
                />
            </form>
            <div className='ntButtonHolder'>
                {renderTabs()}
            </div>
        </Wrapper>
    );
}