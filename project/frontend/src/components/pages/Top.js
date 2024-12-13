import React from 'react';
import { Header } from '../templates/Header';
import { useSetup } from '../hooks/useSetup';

export const Top = () => {
  const { defCalendarInfo, lectureInfo } = useSetup(); // デフォルトカレンダーと講義情報を取得

  // デバッグ用ログを追加
  console.log('defCalendarInfo:', defCalendarInfo);
  console.log('lectureInfo:', lectureInfo);

  // 時間割テーブルを作成する
  const createTable = () => {
    const days = ['月', '火', '水', '木', '金'];
    if (defCalendarInfo?.sat_flag) days.push('土'); // 土曜日を追加

    const maxPeriods = defCalendarInfo?.sixth_period_flag ? 6 : 5; // 6限までか5限までか

    // 曜日と時限のマッピングを修正
    const lectureMap =
      lectureInfo?.registered_user_kougi.reduce((map, lecture) => {
        const match = lecture.period.match(/^([^\d]+)(\d*)$/); // 正規表現で曜日と時限を分割
        if (match) {
          const [_, day, period] = match;
          if (!map[day]) map[day] = {};
          map[day][period || ''] = lecture.kougi_id; // 空の時限でも格納
        } else {
          console.warn('Unmatched period format:', lecture.period); // 不一致の場合の警告
        }
        return map;
      }, {}) || {};

    console.log('lectureMap:', lectureMap); // デバッグ用

    const lectureDetails = lectureInfo?.results.reduce((map, lecture) => {
      map[lecture.id] = lecture.科目; // 講義IDをキーにして科目名をマッピング
      return map;
    }, {});

    console.log('lectureDetails:', lectureDetails); // デバッグ用

    let table = [];
    for (let i = 0; i <= maxPeriods; i++) {
      let row = [];
      for (let j = 0; j <= days.length; j++) {
        let cellContent = '';
        if (i === 0 && j > 0) {
          cellContent = days[j - 1]; // 曜日ヘッダー
        } else if (j === 0 && i > 0) {
          cellContent = i; // 時限ヘッダー
        } else if (i > 0 && j > 0) {
          const day = days[j - 1];
          const period = i.toString();
          const lectureId = lectureMap[day]?.[period];
          cellContent = lectureDetails?.[lectureId] || ''; // 科目名または空白
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
              backgroundColor: cellContent ? '#006666' : 'transparent', // 科目がある場合背景色を設定
              borderRadius: cellContent ? '8px' : '0',
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
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>{createTable()}</tbody>
        </table>
      </div>
    </div>
  );
};
