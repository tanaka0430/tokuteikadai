import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../providers/UserProvider';
import { Header } from '../templates/Header';
import { useNavigate } from 'react-router-dom';
import { useSetup } from '../hooks/useSetup';
import axios from 'axios';

export const Home = () => {
    const { isLogined } = useContext(UserContext);
    const { userId, defCalendarInfo } = useSetup(); // `userId` と `defCalendarInfo` を取得
    const navigate = useNavigate();
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
            const payload = {
                mode: "r",
                user_id: userId,
                calendar_id: calendarId,
            };
            const response = await axios.post(
                `http://127.0.0.1:8000/calendar/r-d/r`,
                payload,
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.data.calendar) {
                alert(`デフォルトカレンダーが "${response.data.calendar.calendar_name}" に設定されました。`);
                window.location.reload(); // 状態を更新するためリロード
            }
        } catch (error) {
            console.error("デフォルトカレンダーの設定に失敗しました:", error.response?.data || error);
            alert("デフォルトカレンダーの設定に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    if (!isLogined) {
        return <Navigate to="/login" />;
    }

    if (!defCalendarInfo) {
        return (
            <div>
                <Header />
                <h2>ホーム画面</h2>
                <p>デフォルトカレンダーが設定されていません。</p>
                {/* カレンダー作成ボタン */}
                <button onClick={() => navigate('/calendar/create')}>カレンダー作成</button>

                {/* カレンダー一覧表示 */}
                <h3>カレンダー一覧</h3>
                {calendarList.length > 0 ? (
                    <ul>
                        {calendarList.map((calendar) => (
                            <li key={calendar.id}>
                                {calendar.calendar_name}
                                <button
                                    onClick={() => handleSetDefaultCalendar(calendar.id)}
                                    disabled={loading}
                                    style={{
                                        marginLeft: '10px',
                                        padding: '5px 10px',
                                        backgroundColor: '#008080',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    デフォルトに設定
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>カレンダーが見つかりません。</p>
                )}
            </div>
        );
    } else {
        return (
            <div>
                <Header />
                <h2>ホーム画面</h2>

                {/* デフォルトカレンダー情報 */}
                <h3>カレンダー: {defCalendarInfo.calendar_name}</h3>
                <p>学期: {defCalendarInfo.semester.join(', ')}</p>
                <p>学部: {defCalendarInfo.department.join(', ')}</p>

                {/* カレンダー作成ボタン */}
                <button onClick={() => navigate('/calendar/create')}>カレンダー作成</button>

                {/* カレンダー一覧表示 */}
                <h3>カレンダー一覧</h3>
                {calendarList.length > 0 ? (
                    <ul>
                        {calendarList.map((calendar) => (
                            <li key={calendar.id}>
                                {calendar.calendar_name}
                                <button
                                    onClick={() => handleSetDefaultCalendar(calendar.id)}
                                    disabled={loading}
                                    style={{
                                        marginLeft: '10px',
                                        padding: '5px 10px',
                                        backgroundColor: '#008080',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    デフォルトに設定
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>カレンダーが見つかりません。</p>
                )}
            </div>
        );
    }
};