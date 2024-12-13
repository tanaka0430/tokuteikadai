import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../providers/UserProvider';
import { Header } from '../templates/Header';
import { useNavigate } from 'react-router-dom';
import { useSetup } from '../hooks/useSetup';
import {
    Box,
    Button,
    Typography,
} from '@mui/material';

export const Home = () => {
    const { isLogined } = useContext(UserContext);
    const { defCalendarInfo } = useSetup();
    const navigate = useNavigate();

    if (!isLogined) {
        return <Navigate to="/login" />;
    }

    if (!defCalendarInfo) {
        return (
            <Box>
                <Header />
                <Box sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        ホーム画面
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        デフォルトカレンダーが設定されていません。
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/calendar/create')}
                            sx={{ mr: 2 }}
                        >
                            カレンダー作成
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate('/calendar/list')}
                        >
                            保存済みのカレンダー
                        </Button>
                    </Box>
                </Box>
            </Box>
        );
    } else {
        return (
            <Box>
                <Header />
                <Box sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        ホーム画面
                    </Typography>
                    <Typography variant="h5">
                        <strong>デフォルトカレンダー:</strong> {defCalendarInfo.calendar_name}
                    </Typography>
                    <Typography variant="body1">
                        <strong>学期:</strong> {defCalendarInfo.semester.join(', ')}
                    </Typography>
                    <Typography variant="body1">
                        <strong>学部:</strong> {defCalendarInfo.department.join(', ')}
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/calendar/create')}
                            sx={{ mr: 2 }}
                        >
                            カレンダー作成
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate('/calendar/list')}
                        >
                            保存済みのカレンダー
                        </Button>
                    </Box>
            </Box>
            </Box>
        );
    }
};
