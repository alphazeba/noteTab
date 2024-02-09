import React, {useState, useEffect} from 'react';
import {loadTab, saveTab, deleteTab} from '../io/api';
import {Wrapper} from '../bits/Wrapper';
import {useInputState} from '../bits/useInputState';
import {useLastState} from '../bits/useLastState';
import {useParams, useNavigate} from 'react-router-dom';
import '@mdxeditor/editor/style.css'
import { MDXEditor,
    headingsPlugin,
    listsPlugin,
    linkPlugin,
    linkDialogPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
} from '@mdxeditor/editor'

export function Tab() {
    const navigate = useNavigate();
    const {urlKey} = useParams();
    const [key, setKey, keyChange] = useInputState(urlKey);
    const [title, setTitle, titleChange, setTitleOnChange] = useInputState('New Note', true);
    const [body, setBody, bodyChange, setBodyOnChange] = useInputState('', true);
    const [dynamicDirty, setDynamicDirty] = useState(false);
    const [dirty, lastDirty, setDirty] = useLastState(false);
    const [tabIsLoaded, setTabIsLoaded] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [deleteActivated, setDeleteActivated] = useState(false);
    const runEffectJustOnce = true;

    const ref = React.useRef(null)

    useEffect(() => {
        if(!(tabIsLoaded || waiting)) {
            handleLoad();
        }
    }, [tabIsLoaded, waiting]);


    // right now this effect runs on any change. which overwrites the interval.
    // which "works" however, it is not intuitive and makes the interval time 
    // imprecise.
    // here is an article on why this doesn't work how i want it to
    // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
    // i don't like the idea of setting up a dedicated interval function to force
    // it to work though. But it would solve the problem.  I think there is a 
    // simpler option, that potentially doesn't require an interval. maybe just
    // a singlular delayed function call that is dependent on the contents being updated.
    // I don't want to check the title and body as that would be expensive operation. 
    useEffect(() => {
        console.log("setting up onPeriodicUpdate");
        const interval = setInterval(() => {
            onPeriodicUpdate();
        }, 1 * 1000);

        return () => {
            clearInterval(interval);
        }
    });

    const onPeriodicUpdate = () => {
        let message = "running periodic update\n" + 
        "dynamic dirty: " + dynamicDirty + "\n" +
        "dirty: " + dirty + "\n" +
        "lastDirty: " + lastDirty + "\n";
        console.log(message);
        setDirty(dynamicDirty);
        setDynamicDirty(false);
        if(lastDirty === true && dirty === false) {
            handleSave();
            console.log("saving");
        }
    }

    const dirtyContents = () => {
        console.log("dirtying contents");
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
        setWaiting(true);
        loadTab(key)
            .then((result) => {
                setTitle(result.title);
                setBody(result.body);
                setTabIsLoaded(true);
                ref.current?.setMarkdown(result.body);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setWaiting(false);
            });
    }
  
    const handleSave = () => {
      saveTab(key, title, body).then((result) => {
        if (result.key !== key) {
            navigate('/notetab/' + result.key);
        }
      }).catch(err => console.log(err));
    }

    const handleDelete = () => {
        deleteTab(key).then((result) => {
            if (result.key_is_gone == true) {
                navigate('/');
            } else {
                console.log("key was not deleted");
            }
        }).catch(err => console.log(err));
    }

    const handleActivateDeleteButton = () => {
        setDeleteActivated(true);
    }

    const renderDeleteButton = () => {
        let className = 'deleteButton';
        let handler = handleActivateDeleteButton;
        if (deleteActivated) {
            className += ' activeDeleteButton';
            handler = handleDelete;
        }
        return <button className={className} onClick={handler}>
            x
        </button>
    }

    return (
        <Wrapper rightContents={renderDeleteButton()}>
            <div className='tab'>
                <input className='title' value={title} onChange={titleChange}/>
                <div className='editor'>
                    <MDXEditor
                        ref={ref}
                        className='dark-theme'
                        markdown={body}
                        onChange={setBody}
                        plugins={[
                            headingsPlugin(),
                            listsPlugin(),
                            linkPlugin(),
                            linkDialogPlugin(),
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