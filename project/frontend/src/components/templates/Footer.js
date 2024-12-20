import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#00695c',
        color: 'white',
        py: 2,
        mt: 'auto',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} 情報システム開発班. All rights reserved.
      </Typography>
      <Typography variant="body2">
        <Link href="/terms" color="inherit" underline="hover">
          利用規約
        </Link>{' '}
        |{' '}
        <Link href="/privacy" color="inherit" underline="hover">
          プライバシーポリシー
        </Link>
      </Typography>
    </Box>
  );
};
