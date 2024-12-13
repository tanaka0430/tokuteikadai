import React from 'react';
import { Button } from '@mui/material';

const RegisterButton = ({ isRegistered, isDisabled, onRegister, onUnregister }) => {
  return (
    <Button
      variant="outlined"
      color={isRegistered ? 'error' : 'primary'}
      onClick={isRegistered ? onUnregister : onRegister}
      disabled={isDisabled} // ボタンを非活性にする
      sx={{ marginTop: 1 }}
    >
      {isRegistered ? '登録解除' : '登録'}
    </Button>
  );
};

export default RegisterButton;
