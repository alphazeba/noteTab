import React, {useState, useEffect} from 'react';
import {loadTab, saveTab} from '../io/api';
import {Wrapper} from '../bits/Wrapper';
import {useInputState} from '../bits/useInputState';
import {useLastState} from '../bits/useLastState';
import {useParams, useNavigate} from 'react-router-dom';
import '@mdxeditor/editor/style.css'
import { MDXEditor,
    headingsPlugin,
    listsPlugin,
    linkPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
} from '@mdxeditor/editor'

export function Tab() {
    const navigate = useNavigate();
    const {urlKey} = useParams();
    const [key, setKey, keyChange] = useInputState(urlKey);
    const [title, setTitle, titleChange, setTitleOnChange] = useInputState("New Note", true);
    const [body, setBody, bodyChange, setBodyOnChange] = useInputState("", true);
    const [dynamicDirty, setDynamicDirty] = useState(false);
    const [dirty, lastDirty, setDirty] = useLastState(false);
    const [loadedGame, setLoadedGame] = useState(false);

    const ref = React.useRef(null)

    useEffect(() => {
        const interval = setInterval(()=>{
            onPeriodicUpdate();
        }, 2 * 1000);
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
        ref.current?.setMarkdown(result.body);
        // setDynamicDirty(false);
        // this no longer solves the problem.
        // setting marking down in the editor triggeres an onchange event that redirties things.
        // need to figure out how to prevent that first onchange from redirtying things.
        // i could maybe make the dirty flag numb for a single call?
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
        <Wrapper>
            <div className='tab'>
                <input className='title simpleOutline' value={title} onChange={titleChange}/>
                <div className='editor simpleOutline'>
                    <MDXEditor
                        ref={ref}
                        className='dark-theme'
                        markdown={body}
                        onChange={setBody}
                        plugins={[
                            headingsPlugin(),
                            listsPlugin(),
                            linkPlugin(),
                            quotePlugin(),
                            thematicBreakPlugin(),
                            markdownShortcutPlugin()
                        ]}
                    />
                </div>
            </div>
        </Wrapper>
      );
}