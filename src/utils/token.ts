


export const setToken=(name: string, token: string)=>{
    sessionStorage.setItem(name, token);
}

export const getToken=(name: string)=>{
    return sessionStorage.getItem(name);
}

export const removeToken=(name: string)=>{
    sessionStorage.removeItem(name);
}