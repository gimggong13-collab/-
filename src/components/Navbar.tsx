import React from 'react';
import { Sparkles, Database, RotateCcw, ShieldCheck, Printer } from 'lucide-react';

export type ActiveTab = 'authoring' | 'peer_review' | 'revision' | 'team_theme' | 'play_escape' | 'report';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDataModal: () => void;
  onResetSample: () => void;
  onOpenChatbot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDataModal,
  onResetSample,
  onOpenChatbot,
}) => {
  const navItems: { id: ActiveTab; label: string; step: string }[] = [
    { id: 'authoring', label: '개인 제작', step: '01' },
    { id: 'peer_review', label: '동료 검증', step: '02' },
    { id: 'revision', label: '수정 기록', step: '03' },
    { id: 'team_theme', label: '모둠 통합', step: '04' },
    { id: 'play_escape', label: '방탈출 플레이', step: '05' },
    { id: 'report', label: '평가 보고서', step: '06' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-xl border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Left: Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-white">
                MathEscape
              </span>
              <span className="text-[11px] font-medium tracking-wide text-zinc-400 border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 rounded">
                [12수과02-04]
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              수학과제 탐구 · 개발 연구 포털
            </span>
          </div>
        </div>

        {/* Center: Sleek Segmented Nav (Revolut aesthetic) */}
        <nav className="hidden md:flex items-center p-1 bg-zinc-900/80 border border-white/[0.06] rounded-xl overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm shadow-black/40 border border-white/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <span className={`text-[10px] ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`}>
                  {item.step}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenChatbot}
            title="제미나이 수학 힌트 조교 열기"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">제미나이 힌트 조교</span>
          </button>

          <button
            onClick={onOpenDataModal}
            title="데이터 JSON 저장 및 가져오기"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] rounded-lg transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">데이터 백업/공유</span>
          </button>

          <button
            onClick={onResetSample}
            title="기본 6개 예제 데이터로 복원"
            className="p-1.5 text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center px-4 py-2 border-t border-white/[0.06] overflow-x-auto gap-1 bg-black/90">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
              activeTab === item.id
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {item.step}. {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
