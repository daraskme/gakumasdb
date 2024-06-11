"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { imageList } from './images'; 

const HomePage: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [columns, setColumns] = useState(4); // デフォルトの列数

  // ls コマンドの結果をハードコーディング
  useEffect(() => {
    setImages(imageList); 
  }, []);

  // 画像表示エリアのサイズ調整
  const handleResize = () => {
    const windowWidth = window.innerWidth;
    // 画面幅に応じて列数を調整 (例として実装)
    if (windowWidth > 1200) {
      setColumns(6);
    } else if (windowWidth > 900) {
      setColumns(4);
    } else {
      setColumns(2);
    }
  };

  // ウィンドウサイズ変更時のイベントリスナー
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* 画像表示エリア */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {images.map((image) => (
          <div key={image}>
            <Image
              src={`/images/${image}`}
              alt={image}
              width={150}
              height={200}
              layout="responsive"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;