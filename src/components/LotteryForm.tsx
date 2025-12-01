'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LotteryConfig, Participant } from '@/types';
import { parseParticipants } from '@/utils/parser';

interface LotteryFormProps {
  onStartDraw: (config: LotteryConfig, participants: Participant[]) => void;
}

export default function LotteryForm({ onStartDraw }: LotteryFormProps) {
  const [eventName, setEventName] = useState('');
  const [prizeName, setPrizeName] = useState('');
  const [winnerCount, setWinnerCount] = useState(1);
  const [participantText, setParticipantText] = useState('');
  const [error, setError] = useState('');
  const [showParticipantCount, setShowParticipantCount] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const participants = parseParticipants(participantText);

    if (!eventName.trim()) {
      setError('請輸入活動名稱');
      return;
    }

    if (!prizeName.trim()) {
      setError('請輸入獎項名稱');
      return;
    }

    if (participants.length === 0) {
      setError('請輸入參與者名單');
      return;
    }

    if (winnerCount > participants.length) {
      setError(`中獎數量不能超過參與者人數 (${participants.length} 人)`);
      return;
    }

    onStartDraw(
      { eventName, prizeName, winnerCount },
      participants
    );
  };

  const participantCount = parseParticipants(participantText).length;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="space-y-2">
        <label className="block text-cyan-400 text-sm font-medium">
          活動名稱
        </label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg
                     text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400
                     focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-cyan-400 text-sm font-medium">
            獎項名稱
          </label>
          <input
            type="text"
            value={prizeName}
            onChange={(e) => setPrizeName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg
                       text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400
                       focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-300"
            placeholder="例如：頭獎"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-cyan-400 text-sm font-medium">
            中獎數量
          </label>
          <input
            type="number"
            min={1}
            value={winnerCount}
            onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg
                       text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400
                       focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-300"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-cyan-400 text-sm font-medium">
            參與者名單
          </label>
          <button
            type="button"
            onClick={() => setShowParticipantCount(!showParticipantCount)}
            className={`px-3 py-1 text-sm rounded-full border transition-all duration-300 ${
              showParticipantCount
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                : 'bg-slate-800/50 border-slate-600 text-slate-400 hover:border-cyan-500/50'
            }`}
          >
            {showParticipantCount
              ? `👁 ${participantCount} 位參與者`
              : '👁‍🗨 顯示人數'}
          </button>
        </div>
        <textarea
          value={participantText}
          onChange={(e) => setParticipantText(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg
                     text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400
                     focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-300
                     font-mono text-sm resize-none"
          placeholder="格式：UUID EMAIL 姓名（每行一筆)"
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-pink-400 text-sm bg-pink-500/10 border border-pink-500/30
                     rounded-lg px-4 py-2"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg
                   text-white font-bold text-lg shadow-[0_0_20px_rgba(0,212,255,0.4)]
                   hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={participantCount === 0}
      >
        🎰 開始抽獎
      </motion.button>
    </motion.form>
  );
}
