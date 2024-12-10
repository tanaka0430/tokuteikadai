import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../providers/UserProvider';
import { Header } from '../templates/Header';
import { useNavigate } from 'react-router-dom';
import { useSetup } from '../hooks/useSetup';


export const Home = () => {
    const { isLogined } = useContext(UserContext);
    const { defCalendarInfo } = useSetup();
    const navigate = useNavigate();

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
          </div>
      );
    }else{
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
            </div>
        );
    };
};
