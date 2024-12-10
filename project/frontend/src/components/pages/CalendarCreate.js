import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Header } from '../templates/Header';
import { useSetup } from '../hooks/useSetup';


export const CalendarCreate = () => {
    const navigate = useNavigate();
    const { userId } = useSetup(); // userIdを取得

    // フォームの状態管理
    const [formData, setFormData] = useState({
        calendar_name: '',
        campus: ['相模原'],
        department: ['社会情報学部', '青山スタンダード科目'],
        semester: ['後期'],
        sat_flag: true,
        sixth_period_flag: false,
    });

    // 入力変更時の処理
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // フォーム送信時の処理
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert('ユーザー情報が取得できませんでした。');
            return;
        }

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/calendar/c-u/c',
                {
                    ...formData,
                    id: 0, // 新規作成時はidを無視
                    user_id: userId, // userIdをリクエストに含める
                },
                { withCredentials: true }
            );
            console.log('カレンダー作成成功:', response.data);

            // カレンダー作成後にホーム画面へ戻る
            navigate('/');
        } catch (error) {
            console.error('カレンダー作成失敗:', error.response?.data || error);
            alert('カレンダー作成に失敗しました');
        }
    };

    return (
        <div>
            <Header />
            <h2>カレンダー作成</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        カレンダー名:
                        <input
                            type="text"
                            name="calendar_name"
                            value={formData.calendar_name}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        学期:
                        <input
                            type="text"
                            name="semester"
                            value={formData.semester.join(', ')}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    semester: e.target.value.split(',').map((s) => s.trim()),
                                }))
                            }
                        />
                    </label>
                </div>
                <div>
                    <label>
                        学部:
                        <input
                            type="text"
                            name="department"
                            value={formData.department.join(', ')}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    department: e.target.value.split(',').map((d) => d.trim()),
                                }))
                            }
                        />
                    </label>
                </div>
                <div>
                    <label>
                        土曜授業:
                        <input
                            type="checkbox"
                            name="sat_flag"
                            checked={formData.sat_flag}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        6限目の有無:
                        <input
                            type="checkbox"
                            name="sixth_period_flag"
                            checked={formData.sixth_period_flag}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button type="submit">作成</button>
            </form>
        </div>
    );
};
