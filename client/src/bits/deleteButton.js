import React, {useState} from 'react';
import {callDeleteTab} from '../io/api';
import {useNavigate} from 'react-router-dom';

export function DeleteButton({notetabKey, onDelete}) {
    const navigate = useNavigate();
    const [deleteActivated, setDeleteActivated] = useState(false);

    const handleDelete = () => {
        callDeleteTab(notetabKey).then((result) => {
            if (result.key_is_gone == true) {
                if (onDelete) {
                    onDelete(notetabKey);
                } else {
                    navigate('/');
                }
            } else {
                console.log('key was not deleted');
            }
        }).catch(err => console.log(err));
    }

    const handleActivateDeleteButton = () => {
        setDeleteActivated(true);
    }

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