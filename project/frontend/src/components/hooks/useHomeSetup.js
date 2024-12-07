import { useState, useEffect } from 'react';
import axios from 'axios';

export const useHomeSetup = () => {
    const [userId, setUserId] = useState(null);            // ユーザーID
    const [defCalendarInfo, setDefCalendarInfo] = useState(null); // デフォルトカレンダー情報
    const [lectureDetails, setLectureDetails] = useState(null);   // 講義詳細
    const [loading, setLoading] = useState(true);                 // ローディング状態
    const [error, setError] = useState(null);                     // エラー情報

    useEffect(() => {
        const fetchHomeSetup = async () => {
            try {
                // "/users/info"からデータ取得
                const userInfoResponse = await axios.get(
                  "http://127.0.0.1:8000/users/info",
                  {withCredentials: true }
                  );
                
                const { user_info, calendar_info } = userInfoResponse.data;

                // user_idを保存
                setUserId(user_info.id);
                console.log('ユーザーID:', user_info.id);

                // def_calendarがnullの場合、デフォルトカレンダー情報を設定せず終了
                if (user_info.def_calendar === null) {
                    setLoading(false);
                    return;
                }

                // def_calendar_infoを取得
                const defCalendar = calendar_info.find(
                    (calendar) => calendar.id === user_info.def_calendar
                );
                setDefCalendarInfo(defCalendar);
                console.log('カレンダー:', defCalendar);

                // "/kougi/get/{calendar_id}"で講義情報を取得
                const lectureResponse = await axios.get(
                  `http://127.0.0.1:8000/kougi/get/${user_info.def_calendar}`,
                  { withCredentials: true }
              );
                setLectureDetails(lectureResponse.data);
                console.log('登録講義:', lectureResponse.data);
                console.log('データ取得完了');
            } catch (err) {
                setError(err.response?.data);
                console.error("データの取得に失敗しました:", err.response || err.message || err);
            } finally {
                setLoading(false); // ローディング終了
            }
        };

        fetchHomeSetup();
    }, []);

    return { userId, defCalendarInfo, lectureDetails, loading, error };
};
