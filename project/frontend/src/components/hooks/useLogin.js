import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { LoginUserContext } from '../providers/LoginUserProvider';

export const useLogin = () => {
    const {setLoginUser, setIsLogined } = useContext(LoginUserContext);
    const navigate = useNavigate();
    
    const login = (user) => {
        console.log("ログイン処理開始");
        const endpoint ="http://127.0.0.1:8000/users/login";

        axios.post(endpoint, null, {
            params: { name: user.username, password: user.password }, // クエリパラメータとして送信
            withCredentials: true, // クッキーを含むリクエストを許可
        })
        .then((res)=>{
            console.log("response:", res.data);
            const { name, id, is_active } = res.data;
            if (name && id) { // ユーザー情報が存在する場合
                console.log("ログイン成功");
                setLoginUser({ name, id, is_active }); // サーバーからの情報を保存
                setIsLogined(true);
                navigate("/"); // ログイン後のページ
            } else {
                console.log("ログイン失敗");
                navigate("/loginfailed");
            }
        })
        .catch((e) => {
            console.error("エラー:", e.response?.data || e.message);
            setLoginUser(null); // ユーザー情報をリセット
            setIsLogined(false);
            navigate("/loginfailed");
        });
    };
  return {login};
};
