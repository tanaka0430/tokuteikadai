import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSetup } from './useSetup';
const apiUrl = process.env.REACT_APP_API_URL;

export const useRegisterLecture = () => {
  const [registeredLectures, setRegisteredLectures] = useState({});
  const { defCalendarInfo, lectureInfo } = useSetup();
  const calendarId = defCalendarInfo?.id;

  useEffect(() => {
    if (lectureInfo && lectureInfo.registered_user_kougi) {
      const newRegisteredLectures = {};
      lectureInfo.registered_user_kougi.forEach((lecture) => {
        if (lecture.calendar_id === calendarId) {
          newRegisteredLectures[lecture.kougi_id] = true;
        }
      });
      setRegisteredLectures(newRegisteredLectures);
      console.log('登録情報:', newRegisteredLectures);
    }
  }, [lectureInfo, calendarId]);

  const registerLecture = async (kougi_id) => {
    try {
      const response = await axios.post(
        `${apiUrl}/kougi/insert`,
        [kougi_id],
        {
          params: { calendar_id: Number(calendarId) },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { failures } = response.data;

      if (failures && failures.length > 0) {
        console.warn("この時限は他の講義が登録されています。", failures);
        return true; // 重複がある場合にtrueを返す
      } else {
        setRegisteredLectures((prev) => ({
          ...prev,
          [kougi_id]: true,
        }));
        console.log('講義を登録しました:', kougi_id);
        return false; // 重複がない場合にfalseを返す
      }
    } catch (error) {
      console.error('講義登録に失敗しました:', error.response?.data || error);
      return false;
    }
  };

  const unregisterLecture = async (kougi_id) => {
    try {
      await axios.delete(`${apiUrl}/kougi/delete`, {
        params: { calendar_id: Number(calendarId) },
        data: [kougi_id],
        headers: { 'Content-Type': 'application/json' },
      });

      setRegisteredLectures((prev) => ({
        ...prev,
        [kougi_id]: false,
      }));
      console.log('講義登録を解除しました:', kougi_id);
    } catch (error) {
      console.error('講義登録解除に失敗しました:', error.response?.data || error);
    }
  };

  const isLectureRegistered = (kougi_id) => {
    return !!registeredLectures[kougi_id];
  };

  return { registerLecture, unregisterLecture, isLectureRegistered };
};
