export function jwtSet() {
    return window.localStorage.getItem('jwt') != null;
}
