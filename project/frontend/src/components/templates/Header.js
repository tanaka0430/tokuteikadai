import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { LoginUserContext } from '../providers/LoginUserProvider';
import BasicMenu from '../elements/BasicMenu';

export const Header = () => {
  const { loginUser } = useContext(LoginUserContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container alignItems="center">
          {/* 左端にアイコンボタン (MENU) */}
          <Grid item xs={2}>
            <BasicMenu />
          </Grid>

          {/* 中央にログインユーザー名を表示 */}
          <Grid item xs={8} textAlign="center">
            <Typography variant="h6" component="div">
              ログインユーザ：{loginUser.name}
            </Typography>
          </Grid>

          {/* 右端の空白 (必要に応じて調整) */}
          <Grid item xs={2} />
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
