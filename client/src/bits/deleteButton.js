import React, {useState} from 'react';
import {callDeleteTab} from '../io/api';
import {useNavigate} from 'react-router-dom';

export function DeleteButton({notetabKey, locked, onDelete, onFail}) {
    const navigate = useNavigate();
    const [deleteActivated, setDeleteActivated] = useState(false);

    const handleDeleteClicked = () => {
        if (locked) {
            return;
        }
        if (deleteActivated) {
            actuallyDelete();
        } else {
            activateDeleteButton();
        }
    }

    const activateDeleteButton = () => {
        setDeleteActivated(true);
    }

    const actuallyDelete = () => {
        callDeleteTab(notetabKey).then((result) => {
            if (result.key_is_gone == true) {
                if (onDelete) {
                    onDelete(notetabKey);
                } else {
                    navigate('/');
                }
            } else {
                console.log('key was not deleted');
                if(onFail) {
                    onFail(notetabKey, result.key_is_locked);
                }
                setDeleteActivated(false);
            }
        }).catch(err => console.log(err));
    }

    let className = 'deleteButton';
    if (deleteActivated) {
        className += ' activeDeleteButton';
    }
    if (locked) {
        className += ' deleteButtonLocked';
    }
    return <button className={className} onClick={handleDeleteClicked}>
        x
    </button>
}