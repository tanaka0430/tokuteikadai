import React, { useState } from 'react';

export const Top = () => {
  const [showYearOptions, setShowYearOptions] = useState(false);
  const [showMonthOptions, setShowMonthOptions] = useState(false);
  const [showTermOptions, setShowTermOptions] = useState(false);

  const createTable = (rows, cols) => {
    const days = ["月", "火", "水", "木", "金"];
    let table = [];

    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        let cellContent = '';
        if (i === 0 && j > 0) cellContent = days[j - 1];
        if (j === 0 && i > 0) cellContent = i;
        row.push(
          <td key={`${i}-${j}`} style={styles.cell}>
            {cellContent}
          </td>
        );
      }
      table.push(<tr key={i}>{row}</tr>);
    }
    return table;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="" alt="" style={styles.logo} />
        <span style={styles.title}>青山学院大学</span>
      </div>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => setShowYearOptions(!showYearOptions)}>年度</button>
        <button style={styles.button} onClick={() => setShowMonthOptions(!showMonthOptions)}>年</button>
        <button style={styles.button} onClick={() => setShowTermOptions(!showTermOptions)}>学期</button>
      </div>

      <div style={{ ...styles.selectContainer, display: showYearOptions ? 'block' : 'none' }}>
        <select style={styles.select}>
          {[2020, 2021, 2022, 2023, 2024, 2025].map(year => (
            <option key={year} value={year}>{year}年</option>
          ))}
        </select>
      </div>
      
      <div style={{ ...styles.selectContainer, display: showMonthOptions ? 'block' : 'none' }}>
        <select style={styles.select}>
          {[1, 2, 3, 4].map(year => (
            <option key={year} value={year}>{year}年</option>
          ))}
        </select>
      </div>

      <div style={{ ...styles.selectContainer, display: showTermOptions ? 'block' : 'none' }}>
        <select style={styles.select}>
          {['前期', '後期'].map((term, index) => (
            <option key={index} value={term}>{term}</option>
          ))}
        </select>
      </div>

      <table style={styles.table}>
        <tbody>{createTable(7, 6)}</tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '10px',
    backgroundColor: '#008080',
    boxSizing: 'border-box',
  },
  header: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  logo: { width: '40px', height: '40px', marginRight: '10px' },
  title: { color: 'white', fontSize: '18px' },
  buttonContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '25px',
    backgroundColor: 'white',
    color: '#008080',
    border: 'none',
    flex: '1 1 calc(33.333% - 20px)', 
    minWidth: '100px',
  },
  selectContainer: {
    marginBottom: '10px',
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    color: '#008080',
    width: '100%',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    maxWidth: '1000px', // PC画面ではより広いサイズ
    tableLayout: 'fixed', // 列幅を均等に固定
  },
  cell: {
    height: '60px', // PC画面でも視認性を高めるため高さを調整
    textAlign: 'center',
    border: '1px solid white',
    color: 'white',
  },
};
