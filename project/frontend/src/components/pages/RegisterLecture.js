import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useRegisterLecture } from '../hooks/useRegisterLecture';
import { useSetup } from '../hooks/useSetup';

export const RegisterLecture = () => {
  const location = useLocation(); // Chat.jsから渡されたデータを取得
  const navigate = useNavigate();
  const { defCalendarInfo } = useSetup(); // デフォルトカレンダー情報を取得
  const { registerLecture, unregisterLecture, isLectureRegistered } =
    useRegisterLecture(defCalendarInfo);

  const lecture = location.state?.lecture; // 遷移元で渡された講義情報
  const registered = isLectureRegistered(lecture?.id); // 登録済みか確認

  const handleRegister = async () => {
    try {
      await registerLecture(lecture.id);
      alert(`「${lecture.科目}」を登録しました。`);
      navigate('/chat'); // 戻る（Chat.jsへ）
    } catch (error) {
      console.error('登録失敗:', error);
      alert('登録に失敗しました。');
    }
  };

  const handleUnregister = async () => {
    try {
      await unregisterLecture(lecture.id);
      alert(`「${lecture.科目}」を解除しました。`);
      navigate('/chat'); // 戻る（Chat.jsへ）
    } catch (error) {
      console.error('解除失敗:', error);
      alert('解除に失敗しました。');
    }
  };

  if (!lecture) {
    return <Typography>講義情報が見つかりません。</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h5">{lecture.科目}</Typography>
        <Typography variant="body1">
          <strong>時限:</strong> {lecture.時限}
        </Typography>
        <Typography variant="body1">
          <strong>学年:</strong> {lecture.学年}
        </Typography>
        <Typography variant="body1">
          <strong>シラバス:</strong>{' '}
          <a href={lecture.url} target="_blank" rel="noopener">
            詳細を見る
          </a>
        </Typography>
      </Paper>
      {registered ? (
        <Button variant="outlined" color="secondary" onClick={handleUnregister}>
          登録解除
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleRegister}>
          登録
        </Button>
      )}
      <Button
        variant="text"
        onClick={() => navigate('/chat')} // 戻るボタン
        sx={{ marginLeft: 2 }}
      >
        キャンセル
      </Button>
    </Box>
  );
};
