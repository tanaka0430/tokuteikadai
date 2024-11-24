import React, { useState } from 'react';

// 月曜日から金曜日、縦に1から6を表示する表
export const Top = () => {
  // それぞれのボタンの表示状態を管理
  const [showYearOptions, setShowYearOptions] = useState(false); // 年度選択肢
  const [showMonthOptions, setShowMonthOptions] = useState(false); // 年選択肢
  const [showTermOptions, setShowTermOptions] = useState(false); // 学期選択肢

  const createTable = (rows, cols) => {
    const days = ["月", "火", "水", "木", "金"];  
    let table = [];

    for (let i = 0; i < rows; i++) {
      let row = [];
      
      for (let j = 0; j < cols; j++) {
        let cellContent = '';

        if (i === 0 && j > 0) {
          cellContent = days[j - 1];
        } else if (j === 0 && i > 0) {
          cellContent = i;
        }

        row.push(
          <td key={`${i}-${j}`} style={{ width: '120px', height: '80px', textAlign: 'center', border: '1px solid white', color: 'white' }}>
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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#008080'  // 画面全体の背景色
    }}>

      {/* 左上に画像とテキストを表示 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <img src="" alt="" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
        <span style={{ color: 'white', fontSize: '18px' }}>青山学院大学</span>
      </div>

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
            marginRight: '20px'
          }}>
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
            marginRight: '20px'
          }}>
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
          }}>
          学期
        </button>
      </div>

      <div 
        style={{
          opacity: showYearOptions ? 1 : 0,
          transform: showYearOptions ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          display: showYearOptions ? 'block' : 'none',
          marginBottom: '10px',
        }}
      >
        <select style={{ padding: '10px', fontSize: '16px', color: '#008080' }}>
          {[2020, 2021, 2022, 2023, 2024, 2025].map(year => (
            <option key={year} value={year}>{year}年</option>
          ))}
        </select>
      </div>

      <div 
        style={{
          opacity: showMonthOptions ? 1 : 0,
          transform: showMonthOptions ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          display: showMonthOptions ? 'block' : 'none',
          marginBottom: '10px',
        }}
      >
        <select style={{ padding: '10px', fontSize: '16px', color: '#008080' }}>
          {[1, 2, 3, 4].map(year => (
            <option key={year} value={year}>{year}年</option>
          ))}
        </select>
      </div>

      <div 
        style={{
          opacity: showTermOptions ? 1 : 0,
          transform: showTermOptions ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          display: showTermOptions ? 'block' : 'none',
        }}
      >
        <select style={{ padding: '10px', fontSize: '16px', color: '#008080' }}>
          {['前期', '後期'].map((term, index) => (
            <option key={index} value={term}>{term}</option>
          ))}
        </select>
      </div>

      <table style={{ borderCollapse: 'collapse' }}>
        <tbody>
          {createTable(7, 6)}
        </tbody>
      </table>
    </div>
  );
};
