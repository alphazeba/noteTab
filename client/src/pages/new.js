import React, {useState, useEffect} from 'react';
import {Wrapper} from '../bits/Wrapper';
import {useParams, useNavigate} from 'react-router-dom';
import {generateNotePadKey} from '../util/generateNoteTabKey';
import {validateKey} from '../io/api';

export function New() {
    const navigate = useNavigate();
    const [waiting, setWaiting] = useState(false);

    useEffect(() => {
        if (!waiting) {
            validateNewKey();
        }
    }, [waiting]);

    const validateNewKey = () => {
        setWaiting(true);
        let potentialKey = generateNotePadKey();
        validateKey(potentialKey)
            .then(response => {
                if (response.valid === true) {
                    navigate('/notetab/' + potentialKey);
                } else {
                    throw Error("key not valid");
                }
            })
            .catch(err => {
                console.log(err);
                console.log("potential key: " + potentialKey + " was not valid");
                setWaiting(false);
            });
    }

    return (
        <Wrapper>
            <div>
                loading...
            </div>
        </Wrapper>
    );
}