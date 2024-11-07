import React from 'react'
import { Link, Navigate } from 'react-router-dom'

export const Home = () => {
  const { isLogined } = useContext(LoginUserContext);

  if(!isLogined){
    return <Navigate to="/login" />;
  }else{
  return (
    <Link to ='/chat'>チャット画面へ</Link>
    );
  }
};
