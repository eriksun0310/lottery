'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Winner, LotteryConfig } from '@/types';
import { maskEmail } from '@/utils/parser';

interface WinnerListProps {
  config: LotteryConfig;
  winners: Winner[];
  onReset: () => void;
}

export default function WinnerList({ config, winners, onReset }: WinnerListProps) {
  const [showEmail, setShowEmail] = useState(false);

  // 匯出純姓名文字檔
  const exportNameOnly = () => {
    const content = winners.map(w => w.name).join('\n');
    downloadFile(content, `${config.eventName}_${config.prizeName}_names.txt`);
  };

  // 匯出純 Email 文字檔
  const exportEmailOnly = () => {
    const content = winners.map(w => w.email).join('\n');
    downloadFile(content, `${config.eventName}_${config.prizeName}_emails.txt`);
  };

  // 匯出 Name + Email 文字檔
  const exportNameAndEmail = () => {
    const content = winners.map(w => `${w.name}\t${w.email}`).join('\n');
    downloadFile(content, `${config.eventName}_${config.prizeName}_winners.txt`);
  };

  // 下載檔案
  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">{config.eventName}</h2>
        <p className="text-xl text-purple-400">{config.prizeName}</p>
        <p className="text-cyan-400">🎊 中獎名單 🎊</p>
      </div>

      {/* Email Toggle Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEmail(!showEmail)}
          className={`px-6 py-2 rounded-full border-2 transition-all duration-300 ${
            showEmail
              ? 'bg-pink-500/20 border-pink-500 text-pink-400'
              : 'bg-slate-800/50 border-cyan-500/30 text-cyan-400'
          }`}
        >
          {showEmail ? '🔓 隱藏 Email' : '🔒 顯示 Email'}
        </motion.button>
      </div>

      {/* Winners Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {winners.map((winner, index) => (
          <motion.div
            key={winner.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-800/40
                       border border-yellow-500/30 rounded-xl p-3
                       shadow-[0_0_15px_rgba(255,215,0,0.1)]
                       hover:shadow-[0_0_25px_rgba(255,215,0,0.2)]
                       hover:border-yellow-500/60
                       transition-all duration-300 text-center"
          >
            {/* Winner Name */}
            <div className="text-lg font-bold text-yellow-400 mb-1 truncate">
              {winner.name}
            </div>
            {/* Winner Email */}
            <div className="text-xs text-slate-400 font-mono truncate">
              {showEmail ? winner.email : maskEmail(winner.email)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportNameOnly}
          className="px-4 py-2 bg-slate-700/50 border border-cyan-500/50 rounded-lg
                     text-cyan-400 text-sm hover:bg-cyan-500/20 transition-all duration-300"
        >
          👤 匯出姓名
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportEmailOnly}
          className="px-4 py-2 bg-slate-700/50 border border-green-500/50 rounded-lg
                     text-green-400 text-sm hover:bg-green-500/20 transition-all duration-300"
        >
          📧 匯出 Email
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportNameAndEmail}
          className="px-4 py-2 bg-slate-700/50 border border-orange-500/50 rounded-lg
                     text-orange-400 text-sm hover:bg-orange-500/20 transition-all duration-300"
        >
          📋 匯出姓名+Email
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg
                     text-white font-bold shadow-[0_0_20px_rgba(0,212,255,0.4)]
                     hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all duration-300"
        >
          🎰 再抽一次
        </motion.button>
      </div>

      {/* Summary */}
      <div className="text-center text-slate-500 text-sm pt-4 border-t border-slate-700">
        共 {winners.length} 位中獎者
      </div>
    </motion.div>
  );
}
