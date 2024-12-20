import { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const useSetup = () => {
    const [userId, setUserId] = useState(null);            // ユーザーID
    const [defCalendarInfo, setDefCalendarInfo] = useState(null); // デフォルトカレンダー情報
    const [lectureInfo, setLectureInfo] = useState(null);   // 講義情報

    useEffect(() => {
        const fetchData = async () => {
            try {
                // "/users/info"からデータ取得
                const userResponse = await axios.get(
                  `${apiUrl}/users/info`,
                  {withCredentials: true }
                  );
                
                const { user_info, calendar_info } = userResponse.data;

                // user_idを保存
                setUserId(user_info.id);
                console.log('ユーザーID:', user_info.id);

                // def_calendarがnullの場合、デフォルトカレンダー情報を設定せず終了
                if (user_info.def_calendar === null) {
                    return;
                };

                // def_calendar_infoを取得
                const defCalendar = calendar_info.find(
                    (calendar) => calendar.id === user_info.def_calendar
                );
                setDefCalendarInfo(defCalendar);
                console.log('カレンダー:', defCalendar);

                // "/kougi/get/{calendar_id}"で講義情報を取得
                const lectureResponse = await axios.post(
                  `${apiUrl}/kougi/get/${user_info.def_calendar}`,
                  { withCredentials: true }
              );
                setLectureInfo(lectureResponse.data);
                console.log('登録講義:', lectureResponse.data);

                console.log('データ取得完了');
            } catch (err) {
                console.error("データの取得に失敗しました:", err.response);
            }
        };

        fetchData();
    }, []);

    return { userId, defCalendarInfo, lectureInfo };
};
