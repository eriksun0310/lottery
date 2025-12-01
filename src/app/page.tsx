'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LotteryForm from '@/components/LotteryForm';
import LotteryMachine from '@/components/LotteryMachine';
import WinnerList from '@/components/WinnerList';
import { LotteryConfig, Participant, Winner, LotteryState } from '@/types';

export default function Home() {
  const [state, setState] = useState<LotteryState>('setup');
  const [config, setConfig] = useState<LotteryConfig | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);

  const handleStartDraw = useCallback(
    (newConfig: LotteryConfig, newParticipants: Participant[]) => {
      setConfig(newConfig);
      setParticipants(newParticipants);
      setState('drawing');
    },
    []
  );

  const handleDrawComplete = useCallback((newWinners: Winner[]) => {
    setWinners(newWinners);
    setState('result');
  }, []);

  const handleReset = useCallback(() => {
    setState('setup');
    setWinners([]);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400
                       bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,212,255,0.3)]"
          >
            🎰 PTalk 抽獎系統
          </h1>
          <p className="text-slate-400 mt-3">幸運之神眷顧你！</p>
        </motion.header>

        {/* Content */}
        <AnimatePresence mode="wait">
          {state === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LotteryForm onStartDraw={handleStartDraw} />
            </motion.div>
          )}

          {state === 'drawing' && config && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <LotteryMachine
                config={config}
                participants={participants}
                onComplete={handleDrawComplete}
              />
            </motion.div>
          )}

          {state === 'result' && config && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WinnerList
                config={config}
                winners={winners}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
