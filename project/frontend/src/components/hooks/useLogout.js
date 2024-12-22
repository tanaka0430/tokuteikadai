import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { UserContext } from '../providers/UserProvider';
const apiUrl = process.env.REACT_APP_API_URL;

export const useLogout = () => {
    const {setLoginUser, setIsLogined } = useContext(UserContext);
    const navigate = useNavigate();

    const Logout = () => {
        const endpoint =`${apiUrl}/users/logout`;
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
