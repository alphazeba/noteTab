const ALPHANUMERIC = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randAlphanumeric() {
    return ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
}

export function generateNotePadKey() {
    let output = '';
    for (let i=0; i<15; i++) {
        output += randAlphanumeric();
    }
    return 'nt' + output;
}