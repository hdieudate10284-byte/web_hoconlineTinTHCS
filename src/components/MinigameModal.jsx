/* ============================================================================
   MINIGAME INTERACTIVE MODAL COMPONENT (REACT 18)
   Tích hợp Web Audio API phát âm thanh sinh động & Confetti pháo hoa
   ============================================================================ */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const MinigameModal = ({ isOpen, onClose, gradeNumber }) => {
  const { curriculum, recordMinigameView } = useData();
  const { addXP, currentUser } = useAuth();

  const [questionIdx, setQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const topic = curriculum.find(c => c.grade === gradeNumber);
  const minigame = topic?.minigame;

  useEffect(() => {
    if (isOpen && minigame) {
      recordMinigameView(minigame.id || `mg-${gradeNumber}`, gradeNumber, minigame.title, currentUser?.class, currentUser?.name);
    }
  }, [isOpen, gradeNumber, minigame, currentUser?.class, currentUser?.name]);

  if (!isOpen) return null;

  if (!minigame || !minigame.questions) {
    return (
      <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
        <div className="modal-container" style={{ textAlign: 'center' }}>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
          <h3>Chưa có minigame cho khối này!</h3>
        </div>
      </div>
    );
  }

  // Phát âm thanh tương tác
  const playSound = (type) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.setValueAtTime(196, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {}
  };

  const currentQ = minigame.questions[questionIdx];

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correct;
    if (isCorrect) {
      setScore(prev => prev + 50);
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const handleNext = () => {
    if (questionIdx + 1 < minigame.questions.length) {
      setQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const totalScore = score + (selectedAnswer === currentQ.correct ? 50 : 0);
      addXP(totalScore, `Hoàn thành minigame: ${minigame.title}`);

      // Bắn pháo hoa Confetti chúc mừng
      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const handleReset = () => {
    setQuestionIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsFinished(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && handleReset()}>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={handleReset}>✕</button>

        {!isFinished ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span className="hero-badge" style={{ background: '#EDE9FE', color: '#7C3AED', borderColor: '#C4B5FD' }}>
                🎮 MINIGAME TƯƠNG TÁC GAMIFICATION
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', marginTop: '8px' }}>
                {minigame.title}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                Câu hỏi {questionIdx + 1} / {minigame.questions.length} • Điểm hiện tại: {score} XP
              </p>
            </div>

            <div className="quiz-box">
              <div className="quiz-question-text">❓ {currentQ.text}</div>
              <div className="quiz-options-list">
                {currentQ.options.map((opt, idx) => {
                  let btnClass = 'quiz-option-btn';
                  if (isAnswered) {
                    if (idx === currentQ.correct) btnClass += ' correct';
                    else if (idx === selectedAnswer && selectedAnswer !== currentQ.correct) btnClass += ' wrong';
                  }
                  return (
                    <button
                      key={idx}
                      className={btnClass}
                      disabled={isAnswered}
                      onClick={() => handleSelect(idx)}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {isAnswered && (
              <div style={{ marginTop: '16px' }}>
                <div style={{
                  padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                  background: selectedAnswer === currentQ.correct ? '#D1FAE5' : '#FEE2E2',
                  color: selectedAnswer === currentQ.correct ? '#065F46' : '#991B1B',
                  border: `1px solid ${selectedAnswer === currentQ.correct ? '#34D399' : '#F87171'}`
                }}>
                  {selectedAnswer === currentQ.correct ? '🎉 CHÍNH XÁC! +50 XP điểm thưởng!' : '❌ CHƯA CHÍNH XÁC!'}<br />
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{currentQ.explanation}</span>
                </div>
              </div>
            )}

            {isAnswered && (
              <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button className="btn-primary" onClick={handleNext}>
                  {questionIdx + 1 < minigame.questions.length ? 'Câu kế tiếp ➔' : 'Xem Kết Quả & Nhận Thưởng 🏆'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>🏆</div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#7C3AED' }}>CHÚC MỪNG HOÀN THÀNH!</h2>
            <p style={{ fontSize: '16px', color: '#334155', marginTop: '8px' }}>
              Em đã xuất sắc giành được <strong>+{score} XP</strong> điểm thưởng Gamification!
            </p>
            
            <div style={{ background: '#FEF08A', border: '2px dashed #CA8A04', borderRadius: '16px', padding: '16px', margin: '20px 0', color: '#713F12' }}>
              <div style={{ fontSize: '32px' }}>🛡️</div>
              <strong style={{ fontSize: '16px' }}>MỞ KHÓA HUY HIỆU DANH DỰ!</strong>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>
                Huy hiệu An toàn số đã được lưu trực tiếp vào tài khoản Supabase của em.
              </p>
            </div>

            <button className="btn-primary" onClick={handleReset}>
              Về Trang Chủ & Cập Nhật Hồ Sơ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
