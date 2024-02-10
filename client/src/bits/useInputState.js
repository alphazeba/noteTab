import {useState} from 'react';

export function useInputState(initialValue, provideSetOnChange=false) {
    let [state, setStateInner] = useState(initialValue);

    let onChange = (x) => {}

    const handleChange = (e) => {
        setState(e.target.value);
    }

    const setState = (value) => {
        setStateInner(value);
        onChange(value);
    }

    const setOnChange = (fn) => {
        onChange = fn;
    }

    let result = [state, setState, handleChange]
    if (provideSetOnChange) {
        result.push(setOnChange);
    }
    return result;
}