const BASE_URL = "http://127.0.0.1:8000/"

export function loadTab(key) {
    console.log('loading tab' + key);
    return api("tab/" + key, GET());
}

export function saveTab(key, title, body) {
    console.log('saving tab' + key);
    return api("tab/" + key, POST({
        title: title, 
        body: body
    }));
}

///// helpers below
// should be able to chain with .then((parsedJsonObj) => {..})
function api(path, payload) {
    return fetch(BASE_URL + path, payload)
        .then((response) => {
            console.log(response);
            return response.json();
        });
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