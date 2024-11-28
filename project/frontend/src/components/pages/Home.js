import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginUserContext } from '../providers/LoginUserProvider';
import { Header } from '../templates/Header';
import { useHomeSetup } from '../hooks/useHomeSetup';
import { useNavigate } from 'react-router-dom';


export const Home = () => {
    const { isLogined } = useContext(LoginUserContext);
    const { defCalendarInfo, lectureDetails } = useHomeSetup();
    const navigate = useNavigate();

    if (!isLogined) {
        return <Navigate to="/login" />;
    }

    // def_calendarがnullの場合
    if (!defCalendarInfo) {
      return (
          <div>
              <Header />
              <h2>ホーム画面</h2>
              <p>デフォルトカレンダーが設定されていません。</p>
              {/* カレンダー作成ボタン */}
              <button onClick={() => navigate('/calendar/create')}>カレンダー作成</button>
          </div>
      );
    }

    return (
        <div>
            <Header />
            <h2>ホーム画面</h2>

            {/* デフォルトカレンダー情報 */}
            <h3>カレンダー: {defCalendarInfo.calendar_name}</h3>
            <p>学期: {defCalendarInfo.semester.join(', ')}</p>
            <p>学部: {defCalendarInfo.department.join(', ')}</p>

            {/* 講義情報 */}
            <h3>登録された講義</h3>
            {lectureDetails?.registered_user_kougi?.length > 0 ? (
                <ul>
                    {lectureDetails.registered_user_kougi.map((kougi) => (
                        <li key={kougi.id}>
                            <strong>講義名:</strong> {kougi.results.name}
                            <br />
                            <strong>時間帯:</strong> {kougi.period}
                            <br />
                            <strong>詳細:</strong> {kougi.results.detail}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>講義が登録されていません。</p>
            )}
            {/* カレンダー作成ボタン */}
            <button onClick={() => navigate('/calendar/create')}>カレンダー作成</button>
        </div>
    );
};
