import React, { useState, useEffect } from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { DETECTIVE_QUIZZES } from '../../data/challenges';
import { 
  Target, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle,
  Trophy,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

export const DetectiveChallenge: React.FC = () => {
  const { profile, completeChallenge } = useDetective();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);

  // Optional Timer mode
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45); // seconds per question

  const currentQuiz = DETECTIVE_QUIZZES[currentIndex];
  const isLastQuestion = currentIndex === DETECTIVE_QUIZZES.length - 1;

  useEffect(() => {
    let timer: any;
    if (isTimerMode && !isAnswerChecked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsAnswerChecked(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerMode, isAnswerChecked, timeLeft]);

  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);

    if (selectedOption === currentQuiz.correctIndex) {
      setScore(prev => prev + currentQuiz.points);
      completeChallenge(currentQuiz.id, currentQuiz.points);
    }
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setTimeLeft(45);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setTimeLeft(45);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
            <Target className="h-4 w-4" />
            <span>UJIAN KUALIFIKASI FORENSIK SAINS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Tantangan Deduksi & Kuis Fisika
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Asah ketajaman logika penalaran ilmiah Anda melalui analisis skenario nyata. Dapatkan poin pengalaman (XP) dan lencana Master Deduksi!
          </p>
        </div>

        {/* Timer toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsTimerMode(!isTimerMode);
              setTimeLeft(45);
            }}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
              isTimerMode
                ? 'border-rose-500 bg-rose-500/15 text-rose-300'
                : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Mode Waktu: {isTimerMode ? 'Aktif (45s)' : 'Santai'}</span>
          </button>
        </div>
      </div>

      {/* Progress & Score Bar */}
      <div className="flex items-center justify-between text-xs font-mono rounded-2xl border border-slate-800 bg-[#0c1427]/80 p-4 backdrop-blur">
        <div className="text-slate-400">
          Soal <span className="text-white font-bold">{currentIndex + 1}</span> dari{' '}
          <span className="text-white font-bold">{DETECTIVE_QUIZZES.length}</span>
        </div>

        {isTimerMode && (
          <div className={`flex items-center gap-1.5 font-bold ${timeLeft < 10 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
            <Clock className="h-4 w-4" />
            <span>{timeLeft}s Tersisa</span>
          </div>
        )}

        <div className="text-cyan-400 font-bold">
          Skor Sesi Ini: <span className="tabular-nums text-white">{score}</span> XP
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c1427]/90 p-6 md:p-8 space-y-6 backdrop-blur shadow-2xl">
        
        {/* Scenario */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-cyan-400">{currentQuiz.category}</span>
            <span>·</span>
            <span>Tingkat: {currentQuiz.difficulty}</span>
            <span>·</span>
            <span className="text-cyan-300 font-mono font-bold">+{currentQuiz.points} XP</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white">{currentQuiz.title}</h2>
          
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80">
            {currentQuiz.scenario}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuiz.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuiz.correctIndex;

            let optionStyle = 'border-slate-800 bg-[#0e172e]/60 text-slate-300 hover:border-slate-700 hover:bg-[#0e172e]';

            if (isAnswerChecked) {
              if (isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold shadow-sm';
              } else if (isSelected) {
                optionStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
              } else {
                optionStyle = 'border-slate-800 bg-slate-950/30 text-slate-500 opacity-40';
              }
            } else if (isSelected) {
              optionStyle = 'border-cyan-500 bg-cyan-500/15 text-white font-semibold shadow-sm shadow-cyan-500/10';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswerChecked}
                className={`w-full text-left rounded-xl border p-4 text-xs sm:text-sm transition flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono font-bold ${
                    isSelected
                      ? isAnswerChecked
                        ? isCorrect
                          ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                          : 'border-rose-400 bg-rose-500 text-white'
                        : 'border-cyan-400 bg-cyan-500 text-slate-950'
                      : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="flex-1 leading-relaxed">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Scientific Feedback if checked */}
        {isAnswerChecked && (
          <div
            className={`rounded-2xl border p-5 space-y-2 text-xs ${
              selectedOption === currentQuiz.correctIndex
                ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200'
                : 'border-amber-500/50 bg-amber-950/30 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {selectedOption === currentQuiz.correctIndex ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>DEDUKSI TEPAT! (+{currentQuiz.points} XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-400" />
                  <span>ANALISIS BELUM TEPAT</span>
                </>
              )}
            </div>
            <p className="leading-relaxed text-slate-200">{currentQuiz.explanation}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end gap-3">
          {!isAnswerChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Periksa Jawaban
            </button>
          ) : isLastQuestion ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRestartQuiz}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Ulangi Seluruh Tantangan</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:bg-cyan-400 transition cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <span>Soal Berikutnya</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
