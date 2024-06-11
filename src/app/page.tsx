'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Card {
  number: string;
  name: string;
  分類: string;
  カードタイプ: string;
  プラン: string;
  消費対象: string;
  消費: string;
  メモリー: string;
  制限: string;
  レアリティ: string;
  PLv: string;
  備考: string;
}

interface FilterOption {
  key: string;
  label: string;
  options: string[];
}

const CardList: React.FC = () => {
  const [cardsData, setCardsData] = useState<Card[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('name');
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});

  const filterOptions: FilterOption[] = [
    {
      key: 'カードタイプ',
      label: 'カードタイプ',
      options: ['アクティブ', 'メンタル'],
    },
    {
      key: 'プラン',
      label: 'プラン',
      options: ['共通', 'ロジック', 'センス'],
    },
    {
      key: '消費対象',
      label: '消費対象',
      options: [
        '元気/体力',
        '体力',
        '好印象',
        '集中',
        'やる気',
        '好調',
      ],
    },
    {
      key: 'レアリティ',
      label: 'レアリティ',
      options: ['白札', '青札', '金札', '虹札'],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/cards.csv');
      const data = await response.text();
      const cards = data.split('\n').slice(1).map(line => {
        const [number, name, 分類, カードタイプ, プラン, 消費対象, 消費, メモリー, 制限, レアリティ, PLv, 備考] = line.split(',');
        return { number, name, 分類, カードタイプ, プラン, 消費対象, 消費, メモリー, 制限, レアリティ, PLv, 備考 } as Card;
      });
      setCardsData(cards);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // カードの表示列数を計算
  // 画面幅の半分だけ表示
  const cardColumns = Math.floor(windowWidth / 192); // カード幅96の2倍
  const cardListWidth = cardColumns * 96;

  const filteredCards = cardsData.filter(card => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      selectedTab === 'name'
        ? card.name.toLowerCase().includes(searchTermLower)
        : card[selectedTab as keyof Card].toLowerCase().includes(searchTermLower);

    const matchesFilters = Object.entries(selectedFilters).every(
      ([key, values]) => {
        if (values.length === 0) {
          return true;
        }
        return values.includes(card[key as keyof Card]);
      }
    );

    return matchesSearch && matchesFilters;
  });

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [key]: prevFilters[key]
        ? prevFilters[key].includes(value)
          ? prevFilters[key].filter(v => v !== value)
          : [...prevFilters[key], value]
        : [value],
    }));
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ color: '#000080' }} // 濃い青色
          />
        </div>
        <div className="tab-buttons">
          <button onClick={() => setSelectedTab('name')} style={{ color: '#000080' }}>名前</button>
          <button onClick={() => setSelectedTab('分類')} style={{ color: '#000080' }}>分類</button>
          <button onClick={() => setSelectedTab('カードタイプ')} style={{ color: '#000080' }}>カードタイプ</button>
          <button onClick={() => setSelectedTab('プラン')} style={{ color: '#000080' }}>プラン</button>
          <button onClick={() => setSelectedTab('消費対象')} style={{ color: '#000080' }}>消費対象</button>
          <button onClick={() => setSelectedTab('消費')} style={{ color: '#000080' }}>消費</button>
          <button onClick={() => setSelectedTab('メモリー')} style={{ color: '#000080' }}>メモリー</button>
          <button onClick={() => setSelectedTab('制限')} style={{ color: '#000080' }}>制限</button>
          <button onClick={() => setSelectedTab('レアリティ')} style={{ color: '#000080' }}>レアリティ</button>
          <button onClick={() => setSelectedTab('PLv')} style={{ color: '#000080' }}>PLv</button>
        </div>
        <div className="filter-container">
          {filterOptions.map(option => (
            <div key={option.key} className="filter-group">
              <div className="filter-label">{option.label}</div>
              <div className="filter-options">
                {option.options.map(filterValue => (
                  <button
                    key={filterValue}
                    onClick={() => handleFilterChange(option.key, filterValue)}
                    className={
                      selectedFilters[option.key] &&
                      selectedFilters[option.key].includes(filterValue)
                        ? 'active'
                        : ''
                    }
                  >
                    {filterValue}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="card-list-container">
          <div className="card-list" style={{ width: cardListWidth }}>
            {filteredCards.map((card, index) => (
              <div key={index} className="card-container">
                <Image
                  src={`/images/${card.number}.jpg`}
                  alt={card.name}
                  width={96}
                  height={96}
                  layout="fixed"
                  className="card-image"
                />
                <div className="card-tooltip">
                  <div className="card-name">{card.name}</div>
                  <div className="card-type">{card.分類} - {card.カードタイプ}</div>
                  <div className="card-details">
                    <div>プラン: {card.プラン}</div>
                    <div>消費対象: {card.消費対象}</div>
                    <div>消費: {card.消費}</div>
                    <div>メモリー: {card.メモリー}</div>
                    <div>制限: {card.制限}</div>
                    <div>レアリティ: {card.レアリティ}</div>
                    <div>PLv: {card.PLv}</div>
                    <div>備考: {card.備考}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .page-container {
          background: linear-gradient(to bottom, #ff7f50, #ffbf00); /* 赤みの強いオレンジ */
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }
        .content-container {
          background-color: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 80%;
          max-width: 1000px;
        }
        .search-bar {
          margin-bottom: 20px;
        }
        .search-bar input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          color: #000080; // 濃い青色
        }
        .tab-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .tab-buttons button {
          padding: 8px 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: white;
          cursor: pointer;
          color: #000080; // 濃い青色
        }
        .tab-buttons button.active {
          background-color: #ffbf00;
          color: white;
        }
        .filter-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 20px;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
        }
        .filter-label {
          font-weight: bold;
        }
        .filter-options {
          display: flex;
          gap: 5px;
        }
        .filter-options button {
          padding: 8px 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: white;
          cursor: pointer;
          color: #000080; // 濃い青色
        }
        .filter-options button.active {
          background-color: #ffbf00;
          color: white;
        }
        .card-list-container {
          display: flex;
          justify-content: center;
        }
        .card-list {
          display: grid;
          grid-template-columns: repeat(${cardColumns}, 1fr);
          gap: 10px;
          padding: 20px;
        }
        .card-container {
          position: relative;
          width: 96px;
          height: 96px;
        }
        .card-image {
          cursor: pointer;
        }
        .card-tooltip {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          background-color: white;
          border-radius: 5px;
          padding: 10px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
          z-index: 1;
          background: linear-gradient(to bottom, #fffacd, #ffdab9);
          color: #000080; /* 深い青色 */
        }
        .card-name {
          font-weight: bold;
          font-size: 1.2em;
          margin-bottom: 5px;
        }
        .card-type {
          margin-bottom: 10px;
        }
        .card-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .card-container:hover .card-tooltip,
        .card-container:focus .card-tooltip,
        .card-container:active .card-tooltip {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
    </div>
  );
};

export default CardList;