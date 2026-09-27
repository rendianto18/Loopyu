import React from "react";
import { useApp } from "../../context/AppContext";
import { INITIAL_6_LEVELS } from "../../data/levelsData";
import { soundManager } from "../../utils/audio";
import {
  Play,
  Sparkles,
  Zap,
  CheckCircle2,
  Code2,
  Cpu,
  Bot,
  ArrowRight,
  Flame,
  Award,
  BookOpen,
} from "lucide-react";

export const StartScreen: React.FC<{
  onStart: () => void;
  onSelectLevel: (levelId: number) => void;
}> = ({ onStart, onSelectLevel }) => {
  const { currentLevel, appUser } = useApp();

  // Load completed levels from localStorage
  const completedLevels: number[] = (() => {
    try {
      const saved = localStorage.getItem("loopyu_completed_levels");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const activeLevelId = currentLevel?.id || 1;

  const handleStartClick = () => {
    soundManager.play("win");
    onStart();
  };

  const handleLevelClick = (lvlId: number) => {
    soundManager.playClick();
    onSelectLevel(lvlId);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-10 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="w-full flex flex-col items-center text-center space-y-5 pt-4">
        {/* Animated Robot Mascot */}
        <div className="relative group cursor-pointer" onClick={handleStartClick}>
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 p-1.5 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              {/* Circuit background lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:12px_12px]" />

              {/* Robot Face */}
              <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
                {/* Antennas */}
                <div className="flex items-center gap-4 -mt-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                {/* Eyes */}
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
                {/* Mouth smile */}
                <div className="w-6 h-1.5 bg-pink-400 rounded-full" />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-900 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-md border-2 border-white">
            Level 1 - 6
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
            <span>Game Edukasi Logika Pemrograman Bahasa C</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            LOOP<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600">YU</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Kuasai konsep perulangan <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">for</span> dan{" "}
            <span className="font-mono font-bold text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded">while</span> dalam bahasa C secara visual bersama robot petualang!
          </p>
        </div>

        {/* Big Start Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleStartClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-700 hover:via-indigo-700 hover:to-pink-700 active:scale-95 text-white font-black text-base shadow-xl hover:shadow-indigo-300 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <span>MULAI PETUALANGAN</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 7. Struktur Level / Misi Showcase & Selection Map */}
      <div className="w-full space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                7. Struktur Level / Misi
              </h2>
              <p className="text-xs text-slate-500">
                Tingkat kesulitan bertahap dengan model Experiential Learning (EL)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full w-fit">
            {completedLevels.length} dari 6 Misi Selesai
          </span>
        </div>

        {/* Structured Level / Mission Table Overview matching the spec */}
        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-700 font-extrabold border-b border-slate-200">
                <th className="py-3 px-3.5 w-16 text-center">Level</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Fokus</th>
                <th className="py-3 px-4">Contoh Tantangan</th>
                <th className="py-3 px-4">Tahap EL</th>
                <th className="py-3 px-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {INITIAL_6_LEVELS.map((lvl) => {
                const isDone = completedLevels.includes(lvl.id);
                const isSelected = activeLevelId === lvl.id;

                return (
                  <tr
                    key={lvl.id}
                    onClick={() => handleLevelClick(lvl.id)}
                    className={`transition-colors cursor-pointer hover:bg-blue-50/60 ${
                      isSelected ? "bg-blue-50/80 font-semibold" : ""
                    }`}
                  >
                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
                          isDone
                            ? "bg-emerald-500 text-white"
                            : isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : lvl.id}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex flex-col gap-0.5">
                        <span>{lvl.name}</span>
                        <div className="flex items-center gap-1 text-[10px] text-amber-500">
                          <span>
                            {Array.from({ length: lvl.difficultyStars || 1 }).map((_, i) => (
                              <span key={i}>⭐</span>
                            ))}
                          </span>
                          <span className="text-slate-600 font-medium text-[9px]">
                            {lvl.difficulty}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-indigo-700 font-semibold">
                      {lvl.focus}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {lvl.challengeExample || lvl.description}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                        {lvl.stageEL}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLevelClick(lvl.id);
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        Main
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 6 Level Interactive Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {INITIAL_6_LEVELS.map((lvl) => {
            const isDone = completedLevels.includes(lvl.id);
            const isSelected = activeLevelId === lvl.id;

            return (
              <div
                key={lvl.id}
                onClick={() => handleLevelClick(lvl.id)}
                className={`relative rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? "bg-white border-blue-600 ring-4 ring-blue-100 shadow-md"
                    : isDone
                    ? "bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 hover:shadow-md"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="space-y-3">
                  {/* Level Header Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                          isDone
                            ? "bg-emerald-500 text-white"
                            : isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : lvl.id}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Level {lvl.id}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {lvl.stageEL}
                    </span>
                  </div>

                  {/* Level Title */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="flex text-amber-400 text-xs">
                        {Array.from({ length: lvl.difficultyStars || 1 }).map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {lvl.difficulty}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors mb-0.5">
                      {lvl.name}
                    </h3>
                    <div className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                      <span>Fokus:</span>
                      <span className="text-slate-700 font-semibold">{lvl.focus}</span>
                    </div>
                  </div>

                  {/* Challenge description */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                      Tantangan:
                    </div>
                    <p className="leading-relaxed">
                      {lvl.challengeExample}
                    </p>
                  </div>
                </div>

                {/* Level Footer Info */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
                    <Zap className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{lvl.targetBatteries.length} Sasaran</span>
                  </div>

                  <span className="text-blue-600 font-bold group-hover:underline flex items-center gap-1">
                    <span>Mulai Misi</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works (3 Steps) */}
      <div className="w-full bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="text-center space-y-1">
          <h3 className="text-base font-black text-slate-900">
            Cara Bermain & Belajar di LOOPYU
          </h3>
          <p className="text-xs text-slate-500">
            Tiga langkah sederhana untuk menguasai logika perulangan bahasa C
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 font-black text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-900">Susun Balok Logika</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tarik atau klik balok perintah (MAJU, AMBIL BATERAI, atau loop FOR/WHILE) ke area kerja.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 font-black text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-900">Jalankan Robot</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tekan tombol Jalankan untuk menyaksikan robot bergerak dan mengevaluasi putaran loop di arena.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 font-black text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-900">Pelajari Kode C Asli</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Lihat sintaks kode C sesungguhnya yang dihasilkan otomatis dari balok yang kamu susun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
