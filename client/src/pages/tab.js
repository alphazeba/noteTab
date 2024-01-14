import React, {useState, useEffect} from 'react';
import {loadTab, saveTab} from '../io/api';
import {useInputState} from '../bits/useInputState';
import {useLastState} from '../bits/useLastState';
import {useParams, useNavigate} from 'react-router-dom';

export function Tab() {
    const navigate = useNavigate();
    const {urlKey} = useParams();
    const [key, setKey, keyChange] = useInputState(urlKey);
    const [title, setTitle, titleChange, setTitleOnChange] = useInputState("Note Tab", true);
    const [body, setBody, bodyChange, setBodyOnChange] = useInputState("", true);
    const [dynamicDirty, setDynamicDirty] = useState(false);
    const [dirty, lastDirty, setDirty] = useLastState(false);
    const [loadedGame, setLoadedGame] = useState(false);

    useEffect(() => {
        console.log('effect is firing');
        const interval = setInterval(()=>{
            onPeriodicUpdate();
        }, 3 * 1000);
        if(!loadedGame) {
            handleLoad();
            setLoadedGame(true);
        }
        return () => {
            clearInterval(interval);
        }
    });

    const onPeriodicUpdate = () => {
        // i think this ends up working but now how i thought it would
        // the effect is only run when state changes are made.
        // this "periodic" update just runs 3 seconds after the most recent change.
        // so far in testing it appears to work, but maybe there are edge cases becasue
        // i didn't understand how effect worked when i was planning it?
        setDirty(dynamicDirty);
        setDynamicDirty(false);
        if(lastDirty === true && dirty === false) {
            handleSave();
            console.log("saving");
        }
    }

    const dirtyContents = () => {
        setDynamicDirty(true);
    }

    const onTitleChange = (title) => {
        dirtyContents();
        document.title = title;
    }
    const onBodyChange = (body) => {
        dirtyContents();
    }
    setTitleOnChange(onTitleChange);
    setBodyOnChange(onBodyChange);

    const handleLoad = () => {
      loadTab(key).then((result) => {
        setTitle(result.title);
        setBody(result.body);
        setDynamicDirty(false);
      }).catch(err => console.log(err));
    }
  
    const handleSave = () => {
      saveTab(key, title, body).then((result) => {
        if (result.key !== key) {
            navigate('/notetab/' + result.key);
        }
      }).catch(err => console.log(err));
    }

    return (
        <div className="App">
          <header className="App-header">
            <input value={title} onChange={titleChange}/>
            <textarea type="text" value={body} onChange={bodyChange}/>
            <p>{title}</p>
            <p>{body}</p>
          </header>
        </div>
      );
}