const BASE_URL = '/'

export function callLoadTab(key) {
    return api('tab/' + key, GET());
}

export function callSaveTab(key, title, body) {
    return api('tab/' + key, POST({
        title: title, 
        body: body
    }));
}

export function callListTabs() {
    return api('listtabs', GET());
}

export function callDeleteTab(key) {
    return api('tab/' + key, DELETE());
}

export function callValidateKey(key) {
    return api('valid/' + key, GET());
}

///// helpers below
// should be able to chain with .then((parsedJsonObj) => {..})
function api(path, payload) {
    console.log('querying ' + path + ' with method ' + payload.method);
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

function DELETE() {
    return {
        method: 'DELETE',
    }
}