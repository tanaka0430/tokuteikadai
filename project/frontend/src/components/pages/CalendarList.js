import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSetup } from '../hooks/useSetup';
import { Header } from '../templates/Header';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
    CircularProgress,
} from '@mui/material';

export const CalendarList = () => {
    const navigate = useNavigate();
    const { userId } = useSetup(); // `userId`を取得
    const [calendarList, setCalendarList] = useState([]); // カレンダー一覧を管理
    const [loading, setLoading] = useState(false); // ローディング状態を管理

    // カレンダー一覧を取得
    useEffect(() => {
        const fetchCalendars = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/users/info", {
                    withCredentials: true,
                });
                setCalendarList(response.data.calendar_info);
            } catch (error) {
                console.error("カレンダー一覧の取得に失敗しました:", error);
            }
        };

        if (userId) fetchCalendars();
    }, [userId]);

    // カレンダーをデフォルトに設定
    const handleSetDefaultCalendar = async (calendarId) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/calendar/r-d/r?user_id=${encodeURIComponent(userId)}&calendar_id=${encodeURIComponent(calendarId)}`,
                null, // ボディを送信しない
                { headers: { "Content-Type": "application/json" } } // 必要に応じてヘッダーを指定
            );
            if (response.data.calendar) {
                alert(`デフォルトカレンダーが "${response.data.calendar.calendar_name}" に設定されました。`);
                setCalendarList((prev) =>
                    prev.map((calendar) =>
                        calendar.id === calendarId
                            ? { ...calendar, isDefault: true }
                            : { ...calendar, isDefault: false }
                    )
                );
                navigate('/'); // 成功後にリダイレクト
            }
        } catch (error) {
            console.error("デフォルトカレンダーの設定に失敗しました:", error.response?.data || error);
            alert("デフォルトカレンダーの設定に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    // カレンダーを削除
    const handleDeleteCalendar = async (calendarId) => {
        const confirmDelete = window.confirm("本当にこのカレンダーを削除しますか？");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/calendar/r-d/d?user_id=${encodeURIComponent(userId)}&calendar_id=${encodeURIComponent(calendarId)}`,
                null, // ボディを送信しない
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.data.calendar === null) {
                alert("カレンダーを削除しました。");
                setCalendarList((prev) => prev.filter((calendar) => calendar.id !== calendarId));
                navigate('/'); // 成功後にリダイレクト
            }
        } catch (error) {
            console.error("カレンダーの削除に失敗しました:", error.response?.data || error);
            alert("カレンダーの削除に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Header />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    カレンダーリスト
                </Typography>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : calendarList.length > 0 ? (
                    <Grid container spacing={3}>
                        {calendarList.map((calendar) => (
                            <Grid item xs={12} sm={6} md={4} key={calendar.id}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {calendar.calendar_name}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSetDefaultCalendar(calendar.id)}
                                            disabled={loading}
                                            fullWidth
                                            sx={{ mb: 1 }}
                                        >
                                            デフォルトに設定
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => navigate('/calendar/create', { state: { calendarData: calendar } })}
                                            fullWidth
                                            sx={{ mb: 1 }}
                                        >
                                            編集
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDeleteCalendar(calendar.id)}
                                            disabled={loading}
                                            fullWidth
                                        >
                                            削除
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body1">カレンダーが見つかりません。</Typography>
                )}
            </Box>
        </Box>
    );
};
