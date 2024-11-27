import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { LoginUserContext } from '../providers/LoginUserProvider';

export const useLogout = () => {
    const {setLoginUser, setIsLogined } = useContext(LoginUserContext);
    const navigate = useNavigate();

    const Logout =() => {
        const endpoint ="http://127.0.0.1:8000/users/logout";
        axios.post(endpoint, null, { withCredentials: true })
        .then(() => {
            setLoginUser(null);
            setIsLogined(false);
            navigate("/login");
        })
        .catch((e) => {
            console.error("ログアウト失敗:", e);
        });
    }
  return (Logout);
};
