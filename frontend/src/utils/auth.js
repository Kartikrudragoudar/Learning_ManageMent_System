import { userAuthStore } from "../store/auth"
import axios from "axios";
import { API_BASE_URL } from "./constants";
import Cookie from "js-cookie";
import jwt_decode from "jwt-decode";


export  const login = async (email, password) => {
    try{
        const {data, status} = await axios.post(`${API_BASE_URL}user/token/`, {
            email,
            password,
        });

        if (status === 200){
            setAuthUser(data.access, data.refresh);
        }

        return {data, error: null};
    }     catch (error) {
        let errMsg = "Something went wrong";
        if (error.response && error.response.data) {
            // Use detail if present, else stringify the whole error data
            errMsg = error.response.data.detail || JSON.stringify(error.response.data);
        } else if (error.message) {
            errMsg = error.message;
        }
        return {
            data: null,
            error: errMsg,
        };
    }
}

export const register = async (full_name, email, password, password2) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}user/register/`, {
      full_name,
      email,
      password,
      password2,
    });
    const loginResult = await login(email, password);
    if (loginResult.error) {
      return { data: null, error: loginResult.error };
    }
    return { data, error: null };
  } catch (error) {
    console.error(error);
    let errMsg = "Something went wrong";
    if (error.response && error.response.data) {
      errMsg = JSON.stringify(error.response.data);
    } else if (error.message) {
      errMsg = error.message;
    }
    return {
      data: null,
      error: errMsg,
    };
  }
};

export const logout = () => {
    Cookie.remove("access_token");
    Cookie.remove("refresh_token");
    userAuthStore.getState().setUser(null);
}

export const setUser = async () => {
    const access_token = Cookie.get("access_token");
    const refresh_token = Cookie.get("refresh_token");

    if (!access_token || !refresh_token) {
        return;
    }

    if (isAccessTokenExpired(access_token)) {
        const response = getRefreshedToken(refresh_token);
        setAuthUser(response.access, response.refresh);
    }else {
        setAuthUser(access_token, refresh_token);
    }
}

export const setAuthUser = (access_token, refresh_token) => {
    Cookie.set('access_token', access_token,{
        expires: 1,
        secure: true,
    });

    Cookie.set('refresh_token', refresh_token, {
        expires: 1, 
        secure: true,
    });

    const user = jwt_decode(access_token) ?? null;

    if (user) {
        userAuthStore.getState().setUser(user);
    }
    userAuthStore.getState().setLoading(false);
};

export const getRefreshedToken = async () => {
    const refresh_token = Cookie.get("refresh_token");
    try {
        const response = await axios.post(`${API_BASE_URL}user/token/refresh/`, {
        refresh: refresh_token,
    });
    return response.data;
    } catch (error) {
        Cookie.remove("access_token");
        Cookie.remove("refresh_token");
        userAuthStore.getState().setUser(null);

        throw error;
    }
}


export const isAccessTokenExpired = (access_token) => {
    try {
        const decodedToken = jwt_decode(access_token);
        return decodedToken.exp < Date.now() / 1000;
    } catch (error) {
        console.log(error)
        return true; 
    }
}