import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../templates/Header';
import { useSetup } from '../hooks/useSetup';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography } from '@mui/material';

export const Timetable = () => {
  const { defCalendarInfo, lectureInfo } = useSetup(); // デフォルトカレンダーと講義情報を取得
  const navigate = useNavigate(); // ページ遷移用

  console.log('defCalendarInfo:', defCalendarInfo);
  console.log('lectureInfo:', lectureInfo);

  const createCalendar = () => {
    const days = ['月', '火', '水', '木', '金'];
    if (defCalendarInfo?.sat_flag) days.push('土'); // 土曜日を追加

    const maxPeriods = defCalendarInfo?.sixth_period_flag ? 6 : 5; // 6限までか5限までか

    const lectureMap =
      lectureInfo?.registered_user_kougi.reduce((map, lecture) => {
        map[lecture.period] = lecture.kougi_id; // "月４" -> 講義ID
        return map;
      }, {}) || {};

    const lectureDetails = lectureInfo?.results.reduce((map, lecture) => {
      map[lecture.id] = lecture; // 講義ID -> 講義情報全体
      return map;
    }, {});

    let rows = [];
    for (let i = 1; i <= maxPeriods; i++) {
      let cells = [];
      for (let j = 0; j <= days.length; j++) {
        let content = '';
        let buttonId = '';
        let lecture = null; // 講義情報を初期化

        if (j === 0) {
          content = `${i}限`;
        } else {
          const day = days[j - 1];
          const period = i.toString();
          buttonId = `${day}${period}`.replace(/\d/, (d) =>
            String.fromCharCode(d.charCodeAt(0) + 0xfee0)
          ); // 半角数字を全角に変換
          const lectureId = lectureMap[buttonId];
          lecture = lectureDetails?.[lectureId]; // 対応する講義情報を取得
          content = lecture?.科目 || '－';
        }

        cells.push(
          <TableCell
            key={`${i}-${j}`}
            align="center"
            sx={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              maxwidth: '120px',
              maxheight: '80px',
              padding: 0, // パディングを削除
            }}
          >
            {j > 0 ? (
              <Button
                fullWidth
                sx={{
                  height: '100%', // ボタンの高さをセルの高さに合わせる
                  padding: 0, // パディングを削除
                  minWidth: '120px', // 最小幅を固定
                  minHeight: '80px', // 最小高さを固定
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
      console.log(`Checking unmatched: period=${registered.period}, isOtherLecture=${isOtherLecture}`);
      return isOtherLecture;
    })
    .map((unmatched) => {
      const lecture = lectureInfo?.results.find(
        (lecture) => lecture.id === unmatched.kougi_id
      );
      console.log(`Unmatched Lecture:`, lecture);
      return lecture;
    })
    .filter(Boolean);

  console.log('Final Unmatched Lectures:', unmatchedLectures);

  return (
    <Box>
      <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
        <Header />
      </Box>
      <Box sx={{ backgroundColor: '#008080', minHeight: '100vh', padding: 3, paddingTop: '64px' }}>
        <Typography variant="h4" align="center" sx={{ color: 'white', marginBottom: 3 }}>
          {defCalendarInfo?.calendar_name || '時間割'}
        </Typography>
        <TableContainer component={Paper} sx={{ maxWidth: 1200, margin: '0 auto', borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#00695c', color: 'white', width: '120px', height: '80px' }}>
                  時間\曜日
                </TableCell>
                {['月', '火', '水', '木', '金', defCalendarInfo?.sat_flag && '土']
                  .filter(Boolean)
                  .map((day) => (
                    <TableCell
                      key={day}
                      align="center"
                      sx={{ fontWeight: 'bold', backgroundColor: '#00695c', color: 'white', width: '120px', height: '80px' }}
                    >
                      {day}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>{createCalendar()}</TableBody>
          </Table>
        </TableContainer>

        {unmatchedLectures?.length > 0 && (
          <Box sx={{ marginTop: 10, backgroundColor: 'white', padding: 2, borderRadius: 2, maxWidth: 1200, margin: '6vh auto 0 auto' }}>
            <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
              その他の講義
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {unmatchedLectures.map((lecture) => (
                <Box
                  key={lecture.id}
                  sx={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
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
    </Box>
  );
};
