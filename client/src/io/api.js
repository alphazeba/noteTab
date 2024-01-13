const BASE_URL = "http://localhost:8000/"

export function loadTab(key) {
    return api("tab/" + key, GET());
}

export function saveTab(key, title, body) {
    return api("tab/" + key, POST({
        title: title, 
        body: body
    }));
}

///// helpers below
// should be able to chain with .then((parsedJsonObj) => {..})
function api(path, payload) {
    return fetch(BASE_URL + path, payload)
        .then((response) => response.json());
}

function POST(obj) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( obj )
    };
}

function GET() {
    return {
        method: 'GET',
    };
}