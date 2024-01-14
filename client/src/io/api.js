const BASE_URL = "http://127.0.0.1:8000/"

export function loadTab(key) {
    return api("tab/" + key, GET());
}

export function saveTab(key, title, body) {
    return api("tab/" + key, POST({
        title: title, 
        body: body
    }));
}

export function listTabs() {
    return api("listtabs", GET());
}

///// helpers below
// should be able to chain with .then((parsedJsonObj) => {..})
function api(path, payload) {
    console.log("querying " + path + " with method " + payload.method);
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