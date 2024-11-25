import React, { useState } from 'react';

export const Search = () => {
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [searchTerm3, setSearchTerm3] = useState(''); // 開講キャンパス用
  const [searchTerm4, setSearchTerm4] = useState(''); // 曜日用
  const [searchTerm5, setSearchTerm5] = useState(''); // 時限用
  const [searchTerm6, setSearchTerm6] = useState(''); // 開講学部用
  const [searchTerm7, setSearchTerm7] = useState(''); // 学期用
  const [results, setResults] = useState([]);
  const fontSize = '14px'; // ここでフォントサイズを変更できます

  const handleSearch = () => {
    const data = [
      'JavaScript 入門 - 山田先生',
      'HTMLとCSSの基本 - 田中先生',
      'Reactの使い方 - 鈴木先生',
      'Web開発のベストプラクティス - 佐藤先生',
      'CSSレイアウトのコツ - 伊藤先生'
    ];

    const filteredData = data.filter(item =>
      item.toLowerCase().includes(searchTerm1.toLowerCase()) ||
      item.toLowerCase().includes(searchTerm2.toLowerCase()) ||
      item.toLowerCase().includes(searchTerm3.toLowerCase()) ||
      item.toLowerCase().includes(searchTerm4.toLowerCase()) ||
      item.toLowerCase().includes(searchTerm5.toLowerCase()) || // 時限
      item.toLowerCase().includes(searchTerm6.toLowerCase()) ||
      item.toLowerCase().includes(searchTerm7.toLowerCase()) // 学期
    );

    setResults(filteredData);
  };

  return (
    <div style={{ backgroundColor: '#8fbc8f', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: 'white', textAlign: 'center' }}>時間割・講義内容検索</h1>

      {/* 科目名の検索ボックス */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="subjectSearch" style={{
            display: 'block',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: '#2e8b57',
            padding: '5px',
            marginBottom: '10px',
            width: '100%'
          }}>
          科目名 / Course Title
        </label>
        <input
          id="subjectSearch"
          type="text"
          placeholder="科目名を入力"
          style={{
            color: 'black',
            width: '100%',
            padding: '10px',
            boxSizing: 'border-box'
          }}
          value={searchTerm1}
          onChange={(e) => setSearchTerm1(e.target.value)}
        />
      </div>

      {/* 教員名の検索ボックス */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="teacherSearch" style={{
            display: 'block',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: '#2e8b57',
            padding: '5px',
            marginBottom: '10px',
            width: '100%'
          }}>
          教員名 / Lecturer
        </label>
        <input
          id="teacherSearch"
          type="text"
          placeholder="教員名を入力"
          style={{
            color: 'black',
            width: '100%',
            padding: '10px',
            boxSizing: 'border-box'
          }}
          value={searchTerm2}
          onChange={(e) => setSearchTerm2(e.target.value)}
        />
      </div>

      {/* 開講キャンパスの選択 */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="campusSelect" style={{
            display: 'block',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: '#2e8b57',
            padding: '5px',
            marginBottom: '10px',
            width: '100%'
          }}>
          開講キャンパス / Campus
        </label>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '50%',
            margin: '0 auto',
            border: '2px solid white',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '5px'
          }}>
          <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'gray', fontSize: fontSize }}>
            <input
              type="radio"
              value="青山キャンパス"
              checked={searchTerm3 === "青山キャンパス"}
              onChange={(e) => setSearchTerm3(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            青山キャンパス
          </label>
          <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'gray', fontSize: fontSize }}>
            <input
              type="radio"
              value="相模原キャンパス"
              checked={searchTerm3 === "相模原キャンパス"}
              onChange={(e) => setSearchTerm3(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            相模原キャンパス
          </label>
        </div>
      </div>

      {/* 曜日の選択（ラジオボタン形式） */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="daySelect" style={{
            display: 'block',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: '#2e8b57',
            padding: '5px',
            marginBottom: '10px',
            width: '100%'
          }}>
          曜日 / Day
        </label>
        <div 
          style={{
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between', 
            width: '70%', 
            margin: '0 auto',
            border: '2px solid white',  
            padding: '10px', 
            backgroundColor: 'white',  
            borderRadius: '5px' 
          }}>
          {["月曜日/Monday", "火曜日/Tuesday", "水曜日/Wednesday", "木曜日/Thursday", "金曜日/Friday", "土曜日/Saturday", "不定/No Set Class"].map(day => (
            <label key={day} style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'gray', width: '30%', fontSize: fontSize }}>
              <input
                type="radio"
                value={day}
                checked={searchTerm4 === day}
                onChange={(e) => setSearchTerm4(e.target.value)}
                style={{ marginRight: '10px' }}
              />
              {day}
            </label>
          ))}
        </div>
      </div>

      {/* 時限の選択（ラジオボタン形式） */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="periodSelect" style={{
            display: 'block',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: '#2e8b57',
            padding: '5px',
            marginBottom: '10px',
            width: '100%'
          }}>
          時限 / Period
        </label>
        <div 
          style={{
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between', 
            width: '70%', 
            margin: '0 auto',
            border: '2px solid white',  
            padding: '10px', 
            backgroundColor: 'white',  
            borderRadius: '5px' 
          }}>
          {["1時限/1st period", "2時限/2nd period", "3時限/3rd period", "4時限/4th period", "5時限/5th period", "6時限/6th period", "7時限/7th period", "不定/No Set Class"].map(period => (
            <label key={period} style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'gray', width: '30%', fontSize: fontSize }}>
              <input
                type="radio"
                value={period}
                checked={searchTerm5 === period}
                onChange={(e) => setSearchTerm5(e.target.value)}
                style={{ marginRight: '10px' }}
              />
              {period}
            </label>
          ))}
        </div>
      </div>

      {/* 開講学部の検索ボックス */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="departmentSearch" style={{
            display: 'block',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: '#2e8b57',
            padding: '5px',
            marginBottom: '10px',
            width: '100%'
          }}>
          開講学部 / Department
        </label>
        <input
          id="departmentSearch"
          type="text"
          placeholder="学部名を入力"
          style={{
            color: 'black',
            width: '100%',
            padding: '10px',
            boxSizing: 'border-box'
          }}
          value={searchTerm6}
          onChange={(e) => setSearchTerm6(e.target.value)}
        />
      </div>

      {/* 学期の選択 */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="semesterSelect" style={{
            display: 'block',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: '#2e8b57',
            padding: '5px',
            marginBottom: '10px',
            width: '100%'
          }}>
          学期 / Semester
        </label>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '50%',
            margin: '0 auto',
            border: '2px solid white',
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '5px'
          }}>
          <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'gray', fontSize: fontSize }}>
            <input
              type="radio"
              value="通年"
              checked={searchTerm7 === "通年"}
              onChange={(e) => setSearchTerm7(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            通年
          </label>
          <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'gray', fontSize: fontSize }}>
            <input
              type="radio"
              value="前期"
              checked={searchTerm7 === "前期"}
              onChange={(e) => setSearchTerm7(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            前期
          </label>
          <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'gray', fontSize: fontSize }}>
            <input
              type="radio"
              value="後期"
              checked={searchTerm7 === "後期"}
              onChange={(e) => setSearchTerm7(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            後期
          </label>
        </div>
      </div>

      {/* 検索ボタン */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2e8b57',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        >
          検索 / Search
        </button>
      </div>

      {/* 検索結果 */}
      <div style={{ color: 'white', textAlign: 'center' }}>
        {results.length > 0 ? (
          results.map((result, index) => <p key={index}>{result}</p>)
        ) : (
          <p>該当する結果はありません。</p>
        )}
      </div>
    </div>
  );
};
