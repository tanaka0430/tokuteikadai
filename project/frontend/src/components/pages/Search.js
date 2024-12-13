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
    const data = [];

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
            justifyContent: 'center', // 中央寄りに配置
            gap: '20px', // 選択肢間の間隔を設定
            width: '95%',
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
              style={{ marginRight: '2px' }}
            />
            青山キャンパス
          </label>
          <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: 'gray', fontSize: fontSize }}>
            <input
              type="radio"
              value="相模原キャンパス"
              checked={searchTerm3 === "相模原キャンパス"}
              onChange={(e) => setSearchTerm3(e.target.value)}
              style={{ marginRight: '2px' }}
            />
            相模原キャンパス
          </label>
        </div>
      </div>

    {/* 曜日の選択（ラジオボタン形式） */}
<div style={{ marginBottom: '10px' }}>
  <label
    htmlFor="daySelect"
    style={{
      display: 'block',
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: '#2e8b57',
      padding: '5px',
      marginBottom: '10px',
      width: '100%',
    }}
  >
    曜日 / Day
  </label>
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center', // 水平方向の中央揃え
      gap: '10px',
      width: '95%',
      margin: '0 auto',
      border: '2px solid white',
      padding: '5px 10px', // 余白を調整（上下のパディングを小さく）
      backgroundColor: 'white',
      borderRadius: '5px',
      alignItems: 'center', // 垂直方向の中央揃え
    }}
  >
    {[
      "月曜日  /Monday",
      "火曜日  /Tuesday",
      "水曜日  /Wednesday",
      "木曜日  /Thursday",
      "金曜日  /Friday",
      "土曜日  /Saturday",
      "不定    /NoSetClass",
      "   ", // 空白のラジオボタン
      "   ", // 空白のラジオボタン
    ].map((day, index) => (
      <label
        key={day}
        style={{
          display: 'flex',
          alignItems: 'center', // ラジオボタンとテキストを垂直方向で中央揃え
          justifyContent: 'flex-start', // 水平方向で中央揃え
          fontWeight: 'bold',
          color: 'gray',
          width: '30%',
          fontSize: fontSize,
          height: '40px', // ラベルの高さを調整
          boxSizing: 'border-box',
          position: 'relative',
          textAlign: 'center', // 文字を中央揃え
        }}
      >
        <input
          type="radio"
          value={day}
          checked={searchTerm4 === day}
          onChange={(e) => setSearchTerm4(e.target.value)}
          style={{
            marginRight: '8px', // ラジオボタンとテキストの間隔を調整
            verticalAlign: 'middle', // ラジオボタンとテキストを中央に揃える
            display: day.trim() === "" ? "none" : "inline-block",
            position: 'relative',
            top: '0px', // ラジオボタンと文字を完全に揃えるために微調整
            height: '20px', // 高さを統一
            width: '20px', // 幅を統一
          }}
        />
        {/* 文字とラジオボタンの間隔を個別に調整 */}
        <span style={{ marginLeft: '5px' }}> {day}</span>
      </label>
    ))}
  </div>
</div>


{/* 時限の選択（ラジオボタン形式） */}
<div style={{ marginBottom: '15px' }}>
  <label
    htmlFor="periodSelect"
    style={{
      display: 'block',
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: '#2e8b57',
      padding: '5px',
      marginBottom: '10px',
      width: '100%',
    }}
  >
    時限 / Period
  </label>
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px',
      width: '95%',
      margin: '0 auto',
      border: '2px solid white',
      padding: '10px',
      backgroundColor: 'white',
      borderRadius: '5px',
      alignItems: 'center', // 垂直方向の中央揃え
    }}
  >
    {[
      "1時限   /1stperiod",
      "2時限   /2ndperiod",
      "3時限   /3rdperiod",
      "4時限   /4thperiod",
      "5時限   /5thperiod",
      "6時限   /6thperiod",
      "7時限   /7thperiod",
      "不 定  /NoSetClass",
      "                 ", // 空白のラジオボタン
    ].map((period) => (
      <label
        key={period}
        style={{
          display: 'flex',
          alignItems: 'center', // ラジオボタンとテキストを垂直方向で中央揃え
          justifyContent: 'center', // ラジオボタンとテキストを水平方向で中央揃え
          fontWeight: 'bold',
          color: 'gray',
          width: '30%',
          fontSize: fontSize,
          height: '50px',
          boxSizing: 'border-box',
          position: 'relative',
          textAlign: 'center', // 文字を中央揃え
        }}
      >
        <input
          type="radio"
          value={period}
          checked={searchTerm5 === period}
          onChange={(e) => setSearchTerm5(e.target.value)}
          style={{
            marginRight: '8px', // ラジオボタンとテキストの間隔を調整
            verticalAlign: 'middle', // ラジオボタンとテキストを中央に揃える
            display: period === "                 " && searchTerm5 !== "7時限   /7thperiod" ? 'none' : 'inline-block',
            position: 'relative',
            top: '0px', // ラジオボタンと文字を完全に揃えるために微調整
            height: '20px', // 高さを統一
            width: '20px', // 幅を統一
          }}
        />
        {/* 文字とラジオボタンの間隔を個別に調整 */}
        <span style={{ marginLeft: '5px' }}> {period}</span>
      </label>
    ))}
  </div>
</div>




     {/* 開講学部のプルダウンメニュー */}
<div style={{ marginBottom: '15px' }}>
  <label htmlFor="departmentSelect" style={{
      display: 'block',
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: '#2e8b57',
      padding: '5px',
      marginBottom: '10px',
      width: '100%'
    }}>
    開講学部・学科 <br />  Faculty / Department / Major
  </label>
  <select
    id="departmentSelect"
    value={searchTerm6}
    onChange={(e) => setSearchTerm6(e.target.value)}
    style={{
      color: searchTerm6 === '' ? 'gray' : 'black',
      width: '100%',
      padding: '10px',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '5px'
    }}
  >
    <option value="" disabled hidden>指定なし/Not specified</option>
    <option value="a" style={{ color: 'gray' }}>青山スタンダード科目/General Education</option>
    <option value="b" style={{ color: 'gray' }}>文学部共通/Common Courses</option>
    <option value="c" style={{ color: 'gray' }}>文学部外国語科目/Foreign Languages</option>
    <option value="c" style={{ color: 'gray' }}>英米文学科/English</option>
    <option value="c" style={{ color: 'gray' }}>フランス文学科/French Language and Literature</option>
    <option value="c" style={{ color: 'gray' }}>日本文学科/Japanese Language and Literature</option>
    <option value="c" style={{ color: 'gray' }}>史学科/History</option>
    <option value="c" style={{ color: 'gray' }}>比較芸術学科/Comparative Arts</option>
    <option value="c" style={{ color: 'gray' }}>経済学部/Economics</option>
    <option value="c" style={{ color: 'gray' }}>法学部/Law</option>
    <option value="c" style={{ color: 'gray' }}>経営学部/Business</option>
    <option value="c" style={{ color: 'gray' }}>理工学部共通/Common Courses</option>
    <option value="c" style={{ color: 'gray' }}>物理・数理/Pysics and Mathematics</option>
    <option value="c" style={{ color: 'gray' }}>科学・生命/Chemistry and Biological Science</option>
    <option value="c" style={{ color: 'gray' }}>電気電子工学科/Electrical Engineering and Electronics, College of Science and Engineering</option>
    <option value="c" style={{ color: 'gray' }}>機械創造/Mechanical Engineering</option>
    <option value="c" style={{ color: 'gray' }}>経営システム/Industrial and Systems Engineering</option>
    <option value="c" style={{ color: 'gray' }}>情報テクノロジー/Integrated Information Technology</option>
    <option value="c" style={{ color: 'gray' }}>物理科学/Physical Sciences</option>
    <option value="c" style={{ color: 'gray' }}>数理サイエンス/Mathematical Sciences</option>
    <option value="c" style={{ color: 'gray' }}>国際政治経済学部/International Politics, Economics and Communication</option>
    <option value="c" style={{ color: 'gray' }}>総合文化政策学部/Cultural and Creative Studies</option>
    <option value="c" style={{ color: 'gray' }}>社会情報学部/Social Informatics</option>
    <option value="c" style={{ color: 'gray' }}>教育人間 外国語科目/Foreign Languages</option>
    <option value="c" style={{ color: 'gray' }}>教育人間 教育学科/Education </option>
    <option value="c" style={{ color: 'gray' }}>教育人間 心理学科/Psychology</option>
    <option value="c" style={{ color: 'gray' }}>地球社会共生学部/Global Studies and Collaboration</option>
    <option value="c" style={{ color: 'gray' }}>コミュニティ人間科学部/Community Studies</option>
    <option value="c" style={{ color: 'gray' }}>教職課程科目/Teacher Training Courses</option>
  </select>
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
            justifyContent: 'center', // 中央寄りに配置
            gap: '20px', // 選択肢間の間隔を設定
            width: '95%',
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
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <button
          onClick={handleSearch}
          style={{
            padding: '5px 15px',
            backgroundColor: '#2e8b57',
            color: 'white',
            border: 'none',
            borderRadius: '100px',
            fontSize: '12px'
          }}
        >
          検索 / Search
        </button>
      </div>


   
      {/* 検索結果 無くてもいいのでは？*/}
      <div style={{ color: 'white', textAlign: 'center' }}>
        {results.length > 0 ? (
          results.map((result, index) => <p key={index}>{result}</p>)
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};  
