'use client'

import React, { useState, useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';

interface Card {
  number: string;
  name: string;
  カードタイプ: string;
  プラン: string;
  パラメータ: string;
  強化後パラメータ: string;
  元気: string;
  強化後元気: string;
  やる気: string;
  強化後やる気: string;
  好印象: string;
  強化後好印象: string;
  集中: string;
  強化後集中: string;
  好調: string;
  強化後好調: string;
  絶好調: string;
  強化後絶好調: string;
  消費体力減少: string;
  強化後消費体力減少: string;
  体力回復: string;
  強化後体力回復: string;
  消費対象: string;
  消費: string;
  強化後消費: string;
  他効果: string;
  レアリティ: string;
  PLv: string;
  固有カード: string;
}

interface FilterOption {
  key: string;
  label: string;
  options: string[];
}

const CardList: React.FC = () => {
  const [cardsData, setCardsData] = useState<Card[]>([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
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
      options: ['フリー', 'ロジック', 'センス'],
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
    {
      key: 'パラメータ',
      label: '効果',
      options: ['パラメータ'],
    },
    {
      key: '元気',
      label: '　',
      options: ['元気'],
    },
    {
      key: 'やる気',
      label: '　',
      options: ['やる気'],
    },
    {
      key: '好印象',
      label: '　',
      options: ['好印象'],
    },
    {
      key: '集中',
      label: '　',
      options: ['集中'],
    },
    {
      key: '好調',
      label: '　',
      options: ['好調'],
    },
    {
      key: '絶好調',
      label: '　',
      options: ['絶好調'],
    },
    {
      key: '消費体力減少',
      label: '　',
      options: ['消費体力減少'],
    },
    {
      key: '体力回復',
      label: '　',
      options: ['体力回復'],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/cards.csv');
      const data = await response.text();
      const cards = data.split('\n').slice(1).map(line => {
        const [
          number,
          name,
          カードタイプ,
          プラン,
          パラメータ,
          強化後パラメータ,
          元気,
          強化後元気,
          やる気,
          強化後やる気,
          好印象,
          強化後好印象,
          集中,
          強化後集中,
          好調,
          強化後好調,
          絶好調,
          強化後絶好調,
          消費体力減少,
          強化後消費体力減少,
          体力回復,
          強化後体力回復,
          消費対象,
          消費,
          強化後消費,
          他効果,
          レアリティ,
          PLv,
          固有カード,
        ] = line.split(',');
        return {
          number,
          name,
          カードタイプ,
          プラン,
          パラメータ,
          強化後パラメータ,
          元気,
          強化後元気,
          やる気,
          強化後やる気,
          好印象,
          強化後好印象,
          集中,
          強化後集中,
          好調,
          強化後好調,
          絶好調,
          強化後絶好調,
          消費体力減少,
          強化後消費体力減少,
          体力回復,
          強化後体力回復,
          消費対象,
          消費,
          強化後消費,
          他効果,
          レアリティ,
          PLv,
          固有カード,
        } as Card;
      });
      setCardsData(cards);
    };
    fetchData();
  }, []);

  // useLayoutEffect を使用してウィンドウ幅を初期化
  useLayoutEffect(() => {
    setWindowWidth(window.innerWidth);
    // ウィンドウサイズが変更されたときにウィンドウ幅を更新
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    // クリーンアップ関数
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // カードの表示列数を計算
  // 画面幅の半分だけ表示
  const cardColumns = Math.floor(windowWidth / 192); // カード幅96の2倍
  const cardListWidth = cardColumns * 96;

  const filteredCards = cardsData.filter(card => {
    const searchTermLower = searchTerm.toLowerCase();
    // すべての項目で検索
    const matchesSearch = Object.values(card)
      .map(value => value.toLowerCase())
      .some(value => value.includes(searchTermLower));

    const matchesFilters = Object.entries(selectedFilters).every(
      ([key, values]) => {
        if (values.length === 0) {
          return true;
        }

        // フィルターオプションのキーに基づいてフィルター条件を変える
        if (
          key === 'カードタイプ' ||
          key === 'プラン' ||
          key === '消費対象' ||
          key === 'レアリティ'
        ) {
          // キーが "カードタイプ", "プラン", "消費対象", "レアリティ" の場合、
          // オプションの値が一致するかどうかでフィルター
          return values.includes(card[key as keyof Card]);
        } else {
          // それ以外のキーの場合、値が '-' ではないかどうかでフィルター
          return card[key as keyof Card] !== '-' && card[key as keyof Card] !== undefined && card[key as keyof Card] !== null;
        }
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

  const handleCardClick = (card: Card) => {
    // 詳細表示のロジックを実装
    console.log('カードをクリックしました:', card);
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
        <div className="filter-container">
          {filterOptions.map(option => (
            <div key={option.key} className="filter-group">
              <div className="filter-label" style={{ color: '#000080' }}>{option.label}</div> {/* ラベルの色を濃い青色に変更 */}
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
              <div key={index} className="card-container" onClick={() => handleCardClick(card)}>
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
                  <div className="card-type" style={{ color: '#000080' }}>{card.カードタイプ}</div>
                  <div className="card-details">
                    {/* - が含まれない項目だけ表示 */}
                    {Object.entries(card).map(([key, value]) => {
                      if (value !== '-' && value !== undefined && value !== null) {
                        return (
                          <div key={key} style={{ color: '#000080' }}> {/* 詳細項目の色を濃い青色に変更 */}
                            {key}: {value}
                          </div>
                        );
                      }
                      return null;
                    })}
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
        .filter-container {
          display: flex;
          flex-wrap: wrap;
          gap: 5px; /* ボタン間隔を小さく */
          margin-bottom: 20px;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
        }
        .filter-label {
          font-weight: bold;
          color: #000080; /* ラベルの色を濃い青色に変更 */
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
          cursor: pointer;
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
          color: #000080; /* 濃い青色 */
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