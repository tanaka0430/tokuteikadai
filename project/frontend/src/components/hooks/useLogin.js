import React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { LoginUserContext } from '../providers/LoginUserProvider';

export const useLogin = () => {
    const {setLoginUser, setIsLogined } = useContext(LoginUserContext);
    const navigate = useNavigate();
    const login = (user) => {
        console.log("ログイン処理開始");
        const endpoint ="http://127.0.0.1:8000/users";
        const queries = { name: user.username, password:user.password };
        axios.get(endpoint, { params: queries }).then((res)=>{
            console.log(res.data[0]);
            if(Object.keys(res.data).length>0) {
                console.log("ログイン成功");
                setLoginUser(user.username);
                setIsLogined(true);
                navigate("/", { state: { username:"ABC" } });
            }else{
                console.log("ログイン失敗");
                navigate("/loginfailed");
            };
        })
        .catch((e)=>{
            console.log(e)
            setLoginUser({username:"",password:""})
            navigate("/loginfailed");
        });
    }
  return {login};
};
