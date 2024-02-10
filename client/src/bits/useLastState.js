import {useState} from 'react';

export function useLastState(initialValue, provideSetOnChange=false) {
    let [currentState, setCurrentState] = useState(initialValue);
    let [lastState, setLastState] = useState(initialValue);

    const setState = (value) => {
        setLastState(currentState);
        setCurrentState(value);
    }

    return [currentState, lastState, setState];
}