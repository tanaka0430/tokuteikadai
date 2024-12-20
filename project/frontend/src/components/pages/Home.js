import React, { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../providers/UserProvider';
import { Header } from '../templates/Header';
import { Footer } from '../templates/Footer';
import { useSetup } from '../hooks/useSetup';
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

export const Home = () => {
    const { isLogined } = useContext(UserContext);
    const { defCalendarInfo, lectureInfo } = useSetup();
    const navigate = useNavigate();

    if (!isLogined) {
        return <Navigate to="/login" />;
    }

    const createCalendar = () => {
        const days = ['月', '火', '水', '木', '金'];
        if (defCalendarInfo?.sat_flag) days.push('土');

        const maxPeriods = defCalendarInfo?.sixth_period_flag ? 6 : 5;

        const lectureMap =
            lectureInfo?.registered_user_kougi.reduce((map, lecture) => {
                map[lecture.period] = lecture.kougi_id;
                return map;
            }, {}) || {};

        const lectureDetails = lectureInfo?.results.reduce((map, lecture) => {
            map[lecture.id] = lecture;
            return map;
        }, {});

        let rows = [];
        for (let i = 1; i <= maxPeriods; i++) {
            let cells = [];
            for (let j = 0; j <= days.length; j++) {
                let content = '';
                let lecture = null;

                if (j === 0) {
                    content = `${i}限`;
                } else {
                    const day = days[j - 1];
                    const period = i.toString();
                    const buttonId = `${day}${period}`.replace(/\d/, (d) =>
                        String.fromCharCode(d.charCodeAt(0) + 0xfee0)
                    );
                    const lectureId = lectureMap[buttonId];
                    lecture = lectureDetails?.[lectureId];
                    content = lecture?.科目 || '－';
                }

                cells.push(
                    <TableCell
                        key={`${i}-${j}`}
                        align="center"
                        sx={{
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            maxWidth: '120px',
                            maxHeight: '80px',
                            padding: 0,
                        }}
                    >
                        {j > 0 ? (
                            <Button
                                fullWidth
                                sx={{
                                    height: '100%',
                                    padding: 0,
                                    minWidth: '120px',
                                    minHeight: '80px',
                                }}
                                variant="contained"
                                color={lecture ? 'primary' : 'default'}
                                onClick={() =>
                                    lecture &&
                                    navigate('/register-lecture', {
                                        state: { lecture },
                                    })
                                }
                            >
                                {content}
                            </Button>
                        ) : (
                            <Typography>{content}</Typography>
                        )}
                    </TableCell>
                );
            }
            rows.push(<TableRow key={i}>{cells}</TableRow>);
        }
        return rows;
    };

    const unmatchedLectures = lectureInfo?.registered_user_kougi
        .filter((registered) => {
            const isOtherLecture = registered.period.includes('曜') || registered.period.includes('不定');
            return isOtherLecture;
        })
        .map((unmatched) => {
            const lecture = lectureInfo?.results.find(
                (lecture) => lecture.id === unmatched.kougi_id
            );
            return lecture;
        })
        .filter(Boolean);

    return (
    <Box>
      <Box sx={{ top: 0, left: 0, width: '100%', zIndex: 1000 }}>
        <Header />
      </Box>
            <Box sx={{ backgroundColor: '#8fbc8f', minHeight: '100vh', padding: 3, paddingTop: '30px' }}>
                <Typography variant="h4" align="center" sx={{ color: 'white', marginBottom: 3 }}>
                {defCalendarInfo?.calendar_name || 'ホーム画面'}
                </Typography>

                <Box sx={{ margin: 3, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/calendar/create')}
                        sx={{ mr: 2 }}
                    >
                        新規カレンダー作成
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/calendar/list')}
                    >
                        保存済みのカレンダー
                    </Button>
                </Box>

                {defCalendarInfo ? (
                    <Box
                    sx={{
                        mt: 4,
                        maxWidth: '1200px',
                        margin: '0 auto',
                        overflowX: 'auto',
                        borderRadius: 2,
                    }}
                    >
                        <TableContainer component={Paper} sx={{backgroundColor: '#008080'}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            align="center"
                                            sx={{ fontWeight: 'bold', backgroundColor: '#008080', color: 'white', width: '120px', height: '80px' }}
                                        >
                                            時間\曜日
                                        </TableCell>
                                        {['月', '火', '水', '木', '金', defCalendarInfo?.sat_flag && '土']
                                            .filter(Boolean)
                                            .map((day) => (
                                                <TableCell
                                                    key={day}
                                                    align="center"
                                                    sx={{ fontWeight: 'bold', backgroundColor: '#008080', color: 'white', width: '120px', height: '80px' }}
                                                >
                                                    {day}
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>{createCalendar()}</TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) : (
                    <Typography variant="body1" align="center" sx={{ color: 'white', mt: 4 }}>
                        デフォルトカレンダーが設定されていません。
                    </Typography>
                )}

                {unmatchedLectures?.length > 0 && (
                    <Box sx={{ mt: 4, padding: 2 }}>
                        <Typography variant="h6" sx={{ color: 'white', marginBottom: 2 }}>
                            その他の講義
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {unmatchedLectures.map((lecture) => (
                                <Box
                                    key={lecture.id}
                                    sx={{
                                        margin: 0,
                                        padding: 0,
                                        maxWidth: '150px',
                                        height: '80px',
                                    }}
                                >
                                    <Button
                                        fullWidth
                                        sx={{
                                            height: '100%',
                                            padding: 0,
                                            width: '100%',
                                            textAlign: 'center',
                                        }}
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            navigate('/register-lecture', {
                                                state: { lecture },
                                            })
                                        }
                                    >
                                        {lecture.科目}
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
            <Footer />
        </Box>
    );
};
