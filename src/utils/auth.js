import Cookies from 'js-cookie';

const TokenKey = 'manage_system_token';
const NameKey = 'manage_system_name';

export function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token, expired) {
    return Cookies.set(TokenKey, token, {
        // 提前1天过期cookie
        expires: new Date(new Date(expired).getTime() - 1 * 86400 * 1000)
    });
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}

export function getName(name) {
    return Cookies.get(NameKey);
}

export function setName(name) {
    return Cookies.set(NameKey, name);
}

export function removeName() {
    return Cookies.remove(NameKey);
}
