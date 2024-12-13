import React, { useState } from 'react';
import { Header } from '../templates/Header';
import { useContext } from 'react';
import { UserContext } from '../providers/UserProvider';
import { useSetup } from '../hooks/useSetup';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

export const Top = () => {
  const { isLogined } = useContext(UserContext); // ログインを確認
  const { defCalendarInfo, lectureInfo } = useSetup(); // デフォルトカレンダーと講義情報を取得
  const navigate = useNavigate();

  const [showYearOptions, setShowYearOptions] = useState(false); // 年度選択肢
  const [showMonthOptions, setShowMonthOptions] = useState(false); // 年選択肢
  const [showTermOptions, setShowTermOptions] = useState(false); // 学期選択肢

  // 時間割テーブルを作成する
  const createTable = (rows, cols) => {
    const days = ["月", "火", "水", "木", "金"];
    const lectureMap = lectureInfo?.registered_user_kougi.reduce((map, lecture) => {
      const [day, period] = lecture.period.split(/(?<=^[^\\d]+)/); // "月1" -> ["月", "1"]
      if (!map[day]) map[day] = {};
      map[day][period] = lecture.kougi_id; // 登録された講義IDを保存
      return map;
    }, {}) || {};

    let table = [];
    for (let i = 0; i < rows; i++) {
      let row = [];

      for (let j = 0; j < cols; j++) {
        let cellContent = '';
        if (i === 0 && j > 0) {
          cellContent = days[j - 1];
        } else if (j === 0 && i > 0) {
          cellContent = i;
        } else if (i > 0 && j > 0) {
          const day = days[j - 1];
          const period = i.toString();
          cellContent = lectureMap[day]?.[period] || ''; // 該当する講義IDまたは空白
        }

        row.push(
          <td
            key={`${i}-${j}`}
            style={{
              width: '120px',
              height: '80px',
              textAlign: 'center',
              border: '1px solid white',
              color: 'white',
            }}
          >
            {cellContent}
          </td>
        );
      }
      table.push(<tr key={i}>{row}</tr>);
    }
    return table;
  };

  const toggleYearOptions = () => {
    setShowYearOptions(!showYearOptions);
    setShowMonthOptions(false);
    setShowTermOptions(false);
  };

  const toggleMonthOptions = () => {
    setShowMonthOptions(!showMonthOptions);
    setShowYearOptions(false);
    setShowTermOptions(false);
  };

  const toggleTermOptions = () => {
    setShowTermOptions(!showTermOptions);
    setShowYearOptions(false);
    setShowMonthOptions(false);
  };

  // 非ログイン状態の処理
  if (!isLogined) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div>
        <Header />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#008080', // 画面全体の背景色
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <button
              onClick={toggleYearOptions}
              style={{
                padding: '10px 30px',
                fontSize: '16px',
                borderRadius: '50px',
                backgroundColor: 'white',
                color: '#008080',
                border: 'none',
                marginRight: '20px',
              }}
            >
              年度
            </button>

            <button
              onClick={toggleMonthOptions}
              style={{
                padding: '10px 30px',
                fontSize: '16px',
                borderRadius: '50px',
                backgroundColor: 'white',
                color: '#008080',
                border: 'none',
                marginRight: '20px',
              }}
            >
              年
            </button>

            <button
              onClick={toggleTermOptions}
              style={{
                padding: '10px 30px',
                fontSize: '16px',
                borderRadius: '50px',
                backgroundColor: 'white',
                color: '#008080',
                border: 'none',
              }}
            >
              学期
            </button>
          </div>

          <table style={{ borderCollapse: 'collapse' }}>
            <tbody>{createTable(7, 6)}</tbody>
          </table>
          {/* カレンダー作成ボタン */}
          <button
            onClick={() => navigate('/calendar/create')}
            style={{
              padding: '10px 30px',
              fontSize: '16px',
              borderRadius: '50px',
              backgroundColor: 'white',
              color: '#008080',
              border: 'none',
              marginRight: '20px',
            }}
          >
            カレンダー作成
          </button>
        </div>
      </div>
    );
  }
};
