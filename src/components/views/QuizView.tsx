import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { QuizQuestion } from '../../types';
import { CyberCard } from '../ui/CyberCard';
import { SoundEngine } from '../../services/audioService';

interface QuizViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const QuizView: React.FC<QuizViewProps> = ({ onNavigate, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredState, setAnsweredState] = useState<'UNANSWERED' | 'CORRECT' | 'WRONG'>('UNANSWERED');
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleAnswer = (userChoiceIsSuspicious: boolean) => {
    if (answeredState !== 'UNANSWERED') return;

    setSelectedAnswer(userChoiceIsSuspicious);
    const isCorrect = userChoiceIsSuspicious === currentQuestion.isSuspicious;

    if (isCorrect) {
      SoundEngine.playSuccessSound();
      setAnsweredState('CORRECT');
      setScore((prev) => prev + 1);
    } else {
      SoundEngine.playAlertSound();
      setAnsweredState('WRONG');
    }
  };

  const handleNext = () => {
    SoundEngine.playKeyClick();
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnsweredState('UNANSWERED');
      setSelectedAnswer(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    SoundEngine.playKeyClick();
    setCurrentIndex(0);
    setScore(0);
    setAnsweredState('UNANSWERED');
    setSelectedAnswer(null);
    setCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2 font-tech text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-bold tracking-widest uppercase">SIMULADOR DEFENSIVO INTERATIVO</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          VOCÊ RECONHECERIA O GOLPE?
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base">
          Analise cenários do cotidiano digital e aprenda a diferenciar comunicações legítimas de fraudes e engenharia social.
        </p>
      </div>

      {!completed ? (
        <div className="space-y-6">
          {/* Progress Tracker Bar */}
          <div className="flex items-center justify-between text-xs font-tech text-neutral-400">
            <span>
              CENÁRIO <b className="text-white">{currentIndex + 1}</b> DE <b className="text-white">{QUIZ_QUESTIONS.length}</b>
            </span>
            <span>
              ACERTOS: <b className="text-emerald-400">{score}</b>
            </span>
          </div>

          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#E00000] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Scenario Simulation Card */}
          <div className="hud-card bg-[#0a0a0a] border border-[#262626] rounded-lg p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between gap-2 border-b border-[#1a1a1a] pb-4 font-tech text-xs">
              <span className="text-[#FF5555] font-bold uppercase">{currentQuestion.senderOrPlatform}</span>
              <span className="text-neutral-500 uppercase">{currentQuestion.simulatedMessage.channel}</span>
            </div>

            {/* Context narrative */}
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-sans">
              {currentQuestion.scenarioText}
            </p>

            {/* Simulated UI Message Box (Phone/SMS/App style) */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#050505] border border-[#202020] font-sans text-xs sm:text-sm space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-tech text-neutral-500">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <Smartphone className="w-3.5 h-3.5 text-[#FF1A1A]" />
                  <b>{currentQuestion.simulatedMessage.sender}</b>
                </span>
                <span>Agora</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#141414] text-neutral-200 leading-relaxed whitespace-pre-line border border-[#252525]">
                {currentQuestion.simulatedMessage.body}
              </div>

              {currentQuestion.simulatedMessage.attachmentsOrLink && (
                <div className="p-2 bg-neutral-900 border border-neutral-800 rounded text-[11px] text-[#FF9999] font-mono">
                  [ANEXO/LINK]: {currentQuestion.simulatedMessage.attachmentsOrLink}
                </div>
              )}
            </div>

            {/* Answer Buttons */}
            {answeredState === 'UNANSWERED' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-tech">
                <button
                  onClick={() => handleAnswer(false)}
                  className="py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500 text-white rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>NORMAL / LEGÍTIMO</span>
                </button>

                <button
                  onClick={() => handleAnswer(true)}
                  className="py-3.5 px-4 bg-neutral-900 hover:bg-[#1a0808] border border-neutral-700 hover:border-[#FF1A1A] text-white rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-[#FF1A1A]" />
                  <span>SUSPEITO / GOLPE</span>
                </button>
              </div>
            ) : (
              /* Answer Feedback Breakdown */
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Result Tag Banner */}
                <div
                  className={`p-4 rounded-lg border font-tech text-xs flex items-center gap-3 ${
                    answeredState === 'CORRECT'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                      : 'bg-red-950/40 border-red-500 text-red-300'
                  }`}
                >
                  {answeredState === 'CORRECT' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-sm block">
                      {answeredState === 'CORRECT' ? 'RESPOSTA CORRETA! (+1)' : 'ATENÇÃO: AVALIAÇÃO INCORRETA!'}
                    </span>
                    <span className="text-[11px] opacity-90">
                      Este cenário é classificado como: <b>{currentQuestion.isSuspicious ? 'GOLPE / FRAUDE SUSPEITA' : 'INTERAÇÃO NORMAL / SEGURA'}</b>
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded space-y-2 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                  <h4 className="font-tech font-bold text-white uppercase text-xs">
                    POR QUE ESTA RESPOSTA É A CORRETA?
                  </h4>
                  <p>{currentQuestion.safeResponseExplanation}</p>
                </div>

                {/* Red Flags List (if suspicious) */}
                {currentQuestion.redFlags.length > 0 && (
                  <div className="p-4 bg-[#140a0a] border border-[#2b1212] rounded space-y-2 font-sans text-xs">
                    <h4 className="font-tech font-bold text-[#FF5555] uppercase text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> SINAIS DE ALERTA (RED FLAGS) IDENTIFICADOS:
                    </h4>
                    <ul className="space-y-1 text-neutral-300">
                      {currentQuestion.redFlags.map((rf, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#FF1A1A] font-bold">•</span>
                          <span>{rf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practical Defensive Tip */}
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded text-xs sm:text-sm text-neutral-200 font-sans flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <b className="font-tech text-emerald-400 text-xs uppercase block mb-0.5">DICA DEFENSIVA:</b>
                    <p>{currentQuestion.practicalDefensiveTip}</p>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-[#E00000] hover:bg-[#FF1A1A] text-white rounded font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'PRÓXIMO CENÁRIO' : 'VER RESULTADO FINAL'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="hud-card bg-[#0a0a0a] border border-[#262626] rounded-lg p-8 sm:p-12 text-center space-y-6 font-tech">
          <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wider uppercase">
              SIMULAÇÃO CONCLUÍDA
            </h2>
            <p className="font-sans text-neutral-400 text-sm">
              Você completou todos os cenários do simulador de reconhecimento de golpes.
            </p>
          </div>

          {/* Score Badge */}
          <div className="p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg max-w-sm mx-auto space-y-1">
            <span className="text-xs text-neutral-500 uppercase">SEU SCORE DEFENSIVO</span>
            <div className="font-display text-5xl text-white">
              {score} / {QUIZ_QUESTIONS.length}
            </div>
            <span className="text-xs font-sans text-emerald-400 font-bold block pt-1">
              {score === QUIZ_QUESTIONS.length
                ? 'EXCELENTE! Consciência de segurança apurada.'
                : score >= QUIZ_QUESTIONS.length * 0.7
                ? 'BOM NÍVEL! Atenção aos pequenos detalhes nos links e remetentes.'
                : 'ALERTA: Recomendamos explorar o Scam Archive e o Cyber Lab para reforçar sua proteção.'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="px-5 py-3 bg-neutral-900 border border-neutral-700 text-white rounded font-bold text-xs uppercase flex items-center gap-2 hover:border-[#E00000]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REPETIR TESTE</span>
            </button>

            <button
              onClick={() => onNavigate('/archive')}
              className="px-5 py-3 bg-[#E00000] hover:bg-[#FF1A1A] text-white rounded font-bold text-xs uppercase flex items-center gap-2"
            >
              <span>EXPLORAR O SCAM ARCHIVE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
