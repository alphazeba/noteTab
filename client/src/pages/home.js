import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useInputState} from '../bits/useInputState';

import {callListTabs} from '../io/api';
import {Wrapper} from '../bits/Wrapper';
import {searchFilterFunction} from '../bits/searchFilter';
import {DeleteButton} from '../bits/deleteButton';

export function Home() {
    const [loadedTabs, setLoadedTabs] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
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

    useEffect(() => {
        // key listeners.
        document.addEventListener('keydown', handleKeyDown, true);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    })

    const handleKeyDown = (e) => {
        if (e.key === "ArrowUp") {
            e.preventDefault()
            updateSelectedIndex(-1);
        } else if (e.key === "ArrowDown") {
            e.preventDefault()
            updateSelectedIndex(1);
        }
    }

    const updateSelectedIndex = (delta) => {
        if (selectedIndex === null) {
            return;
        }
        let newSelectedIndex = selectedIndex + delta;
        if (newSelectedIndex < 0 || newSelectedIndex >= getTargetTabs().length) {
            return;
        }
        setSelectedIndex(newSelectedIndex);
    }

    const initTabs = (tabs, searchTerm='') => {
        setTabs(tabs);
        setSearchTerm(searchTerm);
    }

    const handleDelete = (key) => {
        console.log("hanlding delte of " + key);
        let newTabs = tabs.filter((tab) => {
            console.log("tabkey: " + tab.key + "  key: " + key);
            return tab.key !== key;
        });
        console.log("relative newTab size to tabs " + (tabs.length - newTabs.length))
        setTabs(newTabs);
        updateSearch(newTabs, searchTerm);
    }

    const handleDeleteFail = (key, locked) => {
        console.log("handling delete failed for key " + key + ". key was locked?: " + locked);
        if (locked) {
            // update lock status of the given key
            let newTabs = tabs.map((tab) => {
                if (tab.key == key) {
                    tab.locked = locked;
                }
                return tab;
            });
            setTabs(newTabs);
        }
    }

    const handleLoad = () => {
        callListTabs().then((result) => {
            initTabs(result.items);
        }).catch(err => console.log(err));
    }

    const goToTab = (key) => {
        navigate('/notetab/' + key);
    }

    const updateSearch = (tabs, searchTerm) => {
        let newFilteredTabs = searchTerm ? tabs.filter((t)=>searchFilterFunction(t, searchTerm)) : tabs;
        setFilteredTabs(newFilteredTabs);
        setSelectedIndex(0)
    }

    const onSearchTermChange = (searchTerm) => {
        updateSearch(tabs, searchTerm);
    }
    setSearchTermOnChange(onSearchTermChange);

    const handleSubmitSearch = () => {
        console.log('submit pressed');
        let targetTabs = getTargetTabs();
        if (selectedIndex < targetTabs.length) {
            goToTab(targetTabs[selectedIndex].key);
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
        return getTargetTabs().map((tab, index) => {
            let className = 'ntButton';
            if (selectedIndex === index) {
                className += ' ntButtonSelected';
            }
            return <div key={tab.key}>
                <DeleteButton
                    notetabKey={tab.key}
                    onDelete={handleDelete}
                    onFail={handleDeleteFail}
                    locked={tab.locked}
                />
                <a
                    className={className}
                    key={tab.key}
                    href={'/notetab/' + tab.key}
                >
                    {tab.title ? tab.title : "(no title)"}
                </a>
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