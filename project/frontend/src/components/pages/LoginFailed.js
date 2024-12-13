import React from 'react';

export const LoginFailed = () => {
  return (
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
      ログインに失敗しました。<br />
      名前とパスワードが正しいか確認してください。
    </div>
  );
};
