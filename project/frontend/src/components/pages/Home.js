import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginUserContext } from '../providers/LoginUserProvider';
import { Header } from '../templates/Header';
import { Link } from 'react-router-dom';

export const Home = () => {
  const { isLogined, loginUser } = useContext(LoginUserContext);

  if (!isLogined) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header />
      <h2>ホーム画面</h2>
      <p>ようこそ、{loginUser.name}さん！</p>
      <Link to="/chat">チャット画面へ</Link>
    </div>
  );
};
