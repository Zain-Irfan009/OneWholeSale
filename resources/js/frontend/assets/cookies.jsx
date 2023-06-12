export const setAccessToken = (value) => {
    let name = "_UserSession";
    let days = 1;
    let expires = "";
    let path = "/";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()};`;
    }
    document.cookie = `${name}=${value}${expires}; path=${path}`;
};
export const getAccessToken = () => {
    let cookieName = "_UserSession";
    if (document.cookie.length > 0) {
        let cookieStart = document.cookie.indexOf(cookieName + "=");
        if (cookieStart !== -1) {
            cookieStart = cookieStart + cookieName.length + 1;
            let cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length;
            }
            return window.unescape(
                document.cookie.substring(cookieStart, cookieEnd)
            );
        }
    }
    return "";
};
export const setUserAuth = (value) => {
    let name = "_UserAuth";
    let days = 1;
    let expires = "";
    let path = "/";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()};`;
    }
    document.cookie = `${name}=${value}${expires}; path=${path}`;
};
export const getUserAuth = () => {
    let cookieName = "_UserAuth";
    if (document.cookie.length > 0) {
        let cookieStart = document.cookie.indexOf(cookieName + "=");
        if (cookieStart !== -1) {
            cookieStart = cookieStart + cookieName.length + 1;
            let cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length;
            }
            return window.unescape(
                document.cookie.substring(cookieStart, cookieEnd)
            );
        }
    }
    return "";
};

export const setIsLoggedIn = (value) => {
    let name = "_IsLoggedIn";
    let days = 1;
    let expires = "";
    let path = "/";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()};`;
    }
    document.cookie = `${name}=${value}${expires}; path=${path}`;
};
export const getIsLoggedIn = () => {
    let cookieName = "_IsLoggedIn";
    if (document.cookie.length > 0) {
        let cookieStart = document.cookie.indexOf(cookieName + "=");
        if (cookieStart !== -1) {
            cookieStart = cookieStart + cookieName.length + 1;
            let cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length;
            }
            return window.unescape(
                document.cookie.substring(cookieStart, cookieEnd)
            );
        }
    }
    return "";
};

export const setUser = (value) => {
    let name = "_User";
    let days = 1;
    let expires = "";
    let path = "/";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()};`;
    }
    document.cookie = `${name}=${value}${expires}; path=${path}`;
};
export const getUser = () => {
    let cookieName = "_User";
    if (document.cookie.length > 0) {
        let cookieStart = document.cookie.indexOf(cookieName + "=");
        if (cookieStart !== -1) {
            cookieStart = cookieStart + cookieName.length + 1;
            let cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length;
            }
            return window.unescape(
                document.cookie.substring(cookieStart, cookieEnd)
            );
        }
    }
    return "";
};

export const setEmail = (value) => {
    let name = "_Email";
    let days = 1;
    let expires = "";
    let path = "/";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()};`;
    }
    document.cookie = `${name}=${value}${expires}; path=${path}`;
};
export const getEmail = () => {
    let cookieName = "_Email";
    if (document.cookie.length > 0) {
        let cookieStart = document.cookie.indexOf(cookieName + "=");
        if (cookieStart !== -1) {
            cookieStart = cookieStart + cookieName.length + 1;
            let cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length;
            }
            return window.unescape(
                document.cookie.substring(cookieStart, cookieEnd)
            );
        }
    }
    return "";
};
export const setRole = (value) => {
    let name = "_Role";
    let days = 1;
    let expires = "";
    let path = "/";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()};`;
    }
    document.cookie = `${name}=${value}${expires}; path=${path}`;
};
export const getRole = () => {
    let cookieName = "_Role";
    if (document.cookie.length > 0) {
        let cookieStart = document.cookie.indexOf(cookieName + "=");
        if (cookieStart !== -1) {
            cookieStart = cookieStart + cookieName.length + 1;
            let cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length;
            }
            return window.unescape(
                document.cookie.substring(cookieStart, cookieEnd)
            );
        }
    }
    return "";
};
export const setFirstName = (value) => {
    let name = "_FirstName";
    let days = 1;
    let expires = "";
    let path = "/";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()};`;
    }
    document.cookie = `${name}=${value}${expires}; path=${path}`;
};
export const getFirstName = () => {
    let cookieName = "_FirstName";
    if (document.cookie.length > 0) {
        let cookieStart = document.cookie.indexOf(cookieName + "=");
        if (cookieStart !== -1) {
            cookieStart = cookieStart + cookieName.length + 1;
            let cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length;
            }
            return window.unescape(
                document.cookie.substring(cookieStart, cookieEnd)
            );
        }
    }
    return "";
};
