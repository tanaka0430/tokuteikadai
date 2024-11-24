import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Container, Box, Typography } from '@mui/material';

export const RegisterFailed = () => {
  const { state } = useLocation();
  return (
    <div>
        <Container maxWidth="xs">
        <Box
        sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
        >
            <Typography variant="h5">登録に失敗しました。</Typography>
            <Typography variant="h5">管理者へご連絡ください。</Typography>
            <Typography variant="h5">名前：{state.username}</Typography>
            <Typography variant="h5">パスワード：{state.password}</Typography>
            <Link to="/login">ログイン画面へ</Link>
        </Box>
        </Container>
    </div>
  );
};
