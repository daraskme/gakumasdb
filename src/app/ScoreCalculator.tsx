import { useState } from "react";

const ScoreCalculator = () => {
  const [順位, set順位] = useState<number>(0);
  const [ボーカル, setボーカル] = useState<number>(0);
  const [ダンス, setダンス] = useState<number>(0);
  const [ビジュアル, setビジュアル] = useState<number>(0);
  const [最終試験スコア, set最終試験スコア] = useState<number>(0);
  const [計算結果, set計算結果] = useState<number>(0);
  const [ランク, setランク] = useState<string>('');
  const [目標スコア, set目標スコア] = useState<number>(0);
  const [ランク別必要スコア, setランク別必要スコア] = useState<{
    [rank: string]: number;
  }>({});

  const handle順位Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    set順位(parseInt(event.target.value, 10));
    updateScoreAndRank();
  };

  const handleボーカルChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setボーカル(parseInt(event.target.value, 10) || 0);
    updateScoreAndRank();
  };

  const handleダンスChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setダンス(parseInt(event.target.value, 10) || 0);
    updateScoreAndRank();
  };

  const handleビジュアルChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setビジュアル(parseInt(event.target.value, 10) || 0);
    updateScoreAndRank();
  };

  const handle最終試験スコアChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    set最終試験スコア(parseInt(event.target.value, 10) || 0);
    updateScoreAndRank();
  };

  // 順位スコアを計算する関数
  const get順位スコア = (順位: number) => {
    switch (順位) {
      case 1:
        return 1700;
      case 2:
        return 900;
      case 3:
        return 500;
      case 4:
        return 100;
      case 5:
        return 50;
      case 6:
        return 0;
      default:
        return 0;
    }
  };

  // 計算結果とランクを更新する関数
  const updateScoreAndRank = () => {
    set計算結果(calculateScore());
    setランク(getRank(calculateScore()));
    calculateRankScores();
  };

  const calculateScore = () => {
    let finalScore = 0;

    // 順位スコア計算
    finalScore += get順位スコア(順位);

    // ステータス合計計算
    finalScore += (ボーカル + ダンス + ビジュアル) * 2.3;

    // 最終試験スコア計算
    finalScore += calculateFinalExamScore(最終試験スコア);

    return Math.floor(finalScore);
  };

  // 最終試験スコアを逆算する関数
  const calculateFinalExamScore = (targetScore: number) => {
    // 現在のスコアを取得
    const currentScore =
      get順位スコア(順位) + (ボーカル + ダンス + ビジュアル) * 2.3;

    // 最終試験スコア計算
    let finalExamScore = 0;
    if (targetScore <= 5000) {
      finalExamScore = Math.floor(targetScore / 0.3);
    } else if (targetScore <= 10000) {
      finalExamScore = Math.floor(
        (targetScore - 5000 * 0.3) / 0.15 + 5000
      );
    } else if (targetScore <= 20000) {
      finalExamScore = Math.floor(
        (targetScore - 5000 * 0.3 - 5000 * 0.15) / 0.08 + 10000
      );
    } else if (targetScore <= 30000) {
      finalExamScore = Math.floor(
        (targetScore - 5000 * 0.3 - 5000 * 0.15 - 10000 * 0.08) /
          0.04 +
          20000
      );
    } else if (targetScore <= 40000) {
      finalExamScore = Math.floor(
        (targetScore - 5000 * 0.3 - 5000 * 0.15 - 10000 * 0.08 - 10000 * 0.04) /
          0.02 +
          30000
      );
    } else {
      finalExamScore = Math.floor(
        (targetScore - 5000 * 0.3 - 5000 * 0.15 - 10000 * 0.08 - 10000 * 0.04 - 10000 * 0.02) / 0.01 + 40000
      );
    }

    return finalExamScore - currentScore;
  };

  const getRank = (score: number) => {
    if (score >= 13000) {
      return "S";
    } else if (score >= 11500) {
      return "A+";
    } else if (score >= 10000) {
      return "A";
    } else if (score >= 8000) {
      return "B+";
    } else if (score >= 6000) {
      return "B";
    } else if (score >= 4500) {
      return "C+";
    } else if (score >= 3000) {
      return "C";
    } else {
      return "D"; // 3000 未満は D とする
    }
  };

  // 各ランクに必要な評価点を計算する関数
  const calculateRankScores = () => {
    const scores: { [rank: string]: number } = {};
    for (const rank of ["S", "A+", "A", "B+", "B", "C+", "C"]) {
      const requiredScore = getRankScore(rank);
      scores[rank] = calculateFinalExamScore(requiredScore);
    }
    setランク別必要スコア(scores);
  };

  const handleReverseCalculate = () => {
    const targetScore = getRankScore(ランク);
    set目標スコア(calculateFinalExamScore(targetScore));
  };

  const getRankScore = (rank: string) => {
    switch (rank) {
      case "S":
        return 13000;
      case "A+":
        return 11500;
      case "A":
        return 10000;
      case "B+":
        return 8000;
      case "B":
        return 6000;
      case "C+":
        return 4500;
      case "C":
        return 3000;
      default:
        return 0;
    }
  };

  return (
    <div className="score-calculator">
      <h2 style={{ color: '#000080' }}>スコア計算機</h2>
      <div>
        <label htmlFor="順位" style={{ color: '#000080' }}>順位:</label>
        <select
          id="順位"
          value={順位}
          onChange={handle順位Change}
          style={{ color: '#000080' }}
        >
          <option value={0}>選択してください</option>
          <option value={1}>1位</option>
          <option value={2}>2位</option>
          <option value={3}>3位</option>
          <option value={4}>4位</option>
          <option value={5}>5位</option>
          <option value={6}>6位</option>
        </select>
      </div>
      <div>
        <label htmlFor="ボーカル" style={{ color: '#000080' }}>ボーカル:</label>
        <input
          type="number"
          id="ボーカル"
          value={ボーカル}
          onChange={handleボーカルChange}
          style={{ color: '#000080', width: '100px' }}
        />
      </div>
      <div>
        <label htmlFor="ダンス" style={{ color: '#000080' }}>ダンス:</label>
        <input
          type="number"
          id="ダンス"
          value={ダンス}
          onChange={handleダンスChange}
          style={{ color: '#000080', width: '100px' }}
        />
      </div>
      <div>
        <label htmlFor="ビジュアル" style={{ color: '#000080' }}>ビジュアル:</label>
        <input
          type="number"
          id="ビジュアル"
          value={ビジュアル}
          onChange={handleビジュアルChange}
          style={{ color: '#000080', width: '100px' }}
        />
      </div>
      <div>
        <label htmlFor="最終試験スコア" style={{ color: '#000080' }}>最終試験スコア:</label>
        <input
          type="number"
          id="最終試験スコア"
          value={最終試験スコア}
          onChange={handle最終試験スコアChange}
          style={{ color: '#000080', width: '100px' }}
        />
      </div>

      <p style={{ color: '#000080' }}>計算結果: {計算結果}</p>
      <p style={{ color: '#000080' }}>ランク: {ランク}</p>

      {/* 逆算機能 */}
      <div>
        <label htmlFor="ランク" style={{ color: '#000080' }}>目標ランク:</label>
        <select
          id="ランク"
          value={ランク}
          onChange={(e) => setランク(e.target.value)}
          style={{ color: '#000080' }}
        >
          <option value="S">S</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="C+">C+</option>
          <option value="C">C</option>
        </select>
      </div>
      <button style={{ color: '#000080' }} onClick={handleReverseCalculate}>
        逆算
      </button>
      <p style={{ color: '#000080' }}>目標スコア: {目標スコア}</p>

      {/* 各ランクに必要な最終試験スコアを表示 */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#000080' }}>各ランクに必要な最終試験スコア</h3>
        {Object.entries(ランク別必要スコア).map(([rank, score]) => (
          <p key={rank} style={{ color: '#000080' }}>
            {rank}: {score}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ScoreCalculator;