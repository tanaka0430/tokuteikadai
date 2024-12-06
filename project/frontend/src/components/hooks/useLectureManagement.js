import { useState } from 'react';
import axios from 'axios';

export const useLectureManagement = (defCalendarInfo) => {
  const [registeredLectures, setRegisteredLectures] = useState({}); // { [kougi_id]: true/false }

  // デフォルトカレンダーID
  const calendarId = defCalendarInfo?.id;

  // 講義登録
const registerLecture = async (kougi_id) => {
  try {
    await axios.post(
      'http://localhost:8000/kougi/insert',
      [kougi_id],
      {
        params: { calendar_id: Number(calendarId) }, // クエリパラメータ
        headers: { 'Content-Type': 'application/json' },
      }
    );
    // 状態を更新
    setRegisteredLectures((prev) => {
      const newState = { ...prev, [kougi_id]: true };
      console.log('Updated registeredLectures:', newState); // デバッグ用
      return newState;
    });
  } catch (error) {
    console.error('講義登録に失敗しました:', error.response?.data || error);

    if (error.response?.data?.detail) {
      console.error('エラー詳細:', JSON.stringify(error.response.data.detail));
    }
  }
};


const unregisterLecture = async (kougi_id) => {
  try {
    await axios.delete('http://localhost:8000/kougi/delete', {
      params: { calendar_id: Number(calendarId) }, // クエリパラメータ
      data: [kougi_id], // リスト形式で送信
      headers: { 'Content-Type': 'application/json' },
    });

    // 状態を更新
    setRegisteredLectures((prev) => {
      const newState = { ...prev, [kougi_id]: false };
      console.log('Updated registeredLectures (unregister):', newState); // デバッグ用
      return newState;
    });
  } catch (error) {
    console.error('講義登録解除に失敗しました:', error.response?.data || error);

    if (error.response?.data?.detail) {
      console.error('エラー詳細:', JSON.stringify(error.response.data.detail));
    }
  }
};

  // 講義が登録済みかどうかを確認
  const isLectureRegistered = (kougi_id) => {
    return registeredLectures[kougi_id] || false;
  };

  return { registerLecture, unregisterLecture, isLectureRegistered };
};
