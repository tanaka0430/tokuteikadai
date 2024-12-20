import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSetup } from './useSetup';
const apiUrl = process.env.REACT_APP_API_URL;

export const useRegisterLecture = () => {
  const [registeredLectures, setRegisteredLectures] = useState({}); // { [kougi_id]: true/false }
  const { defCalendarInfo, lectureInfo } = useSetup(); // カレンダー情報と講義情報を取得

  const calendarId = defCalendarInfo?.id; // デフォルトカレンダーID

  // lectureInfo に基づいて登録情報を設定
  useEffect(() => {
    if (lectureInfo && lectureInfo.registered_user_kougi) {
      const newRegisteredLectures = {};
      lectureInfo.registered_user_kougi.forEach((lecture) => {
        if (lecture.calendar_id === calendarId) {
          newRegisteredLectures[lecture.kougi_id] = true;
        }
      });
      setRegisteredLectures(newRegisteredLectures);
      console.log('登録情報:', newRegisteredLectures); // デバッグ用
    }
  }, [lectureInfo, calendarId]);

  // 講義登録
  const registerLecture = async (kougi_id) => {
    try {
      await axios.post(
        `${apiUrl}/kougi/insert`,
        [kougi_id],
        {
          params: { calendar_id: Number(calendarId) },
          headers: { 'Content-Type': 'application/json' },
        }
      );
      // 状態を更新
      setRegisteredLectures((prev) => ({
        ...prev,
        [kougi_id]: true,
      }));
      console.log('講義を登録しました:', kougi_id);
    } catch (error) {
      console.error('講義登録に失敗しました:', error.response?.data || error);
    }
  };

  // 講義登録解除
  const unregisterLecture = async (kougi_id) => {
    try {
      await axios.delete(`${apiUrl}/kougi/delete`, {
        params: { calendar_id: Number(calendarId) },
        data: [kougi_id],
        headers: { 'Content-Type': 'application/json' },
      });

      // 状態を更新
      setRegisteredLectures((prev) => ({
        ...prev,
        [kougi_id]: false,
      }));
      console.log('講義登録を解除しました:', kougi_id);
    } catch (error) {
      console.error('講義登録解除に失敗しました:', error.response?.data || error);
    }
  };

  // 講義が登録済みかどうかを確認
  const isLectureRegistered = (kougi_id) => {
    return !!registeredLectures[kougi_id]; // 存在しない場合は false を返す
  };

  return { registerLecture, unregisterLecture, isLectureRegistered };
};
