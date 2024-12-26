import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export const RegisterFailed = () => {
  const { state } = useLocation();
  return (
    <div>
      <div style={{ 
        backgroundColor: 'red', 
        color: 'white', 
        padding: '10px', 
        textAlign: 'center', 
        width: '100%', 
        height: '10vh', 
        boxSizing: 'border-box', 
        lineHeight: '1.5' 
      }}>
        登録に失敗しました。<br />
        名前 "{state.username}" は既に使用されています。<br />
        <Link to="/register" textAlign='center'>ユーザー登録画面へ</Link>
      </div>
    </div>
  );
};
