import React, { useState } from 'react';
import { TeamTheme } from '../types';
import { Download, Upload, Copy, Check, FileJson, AlertCircle } from 'lucide-react';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: TeamTheme;
  onImportTheme: (newTheme: TeamTheme) => void;
}

export const DataModal: React.FC<DataModalProps> = ({
  isOpen,
  onClose,
  theme,
  onImportTheme,
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentJsonString = JSON.stringify(theme, null, 2);

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(currentJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download JSON file
  const handleDownload = () => {
    const blob = new Blob([currentJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `수학방탈출_${theme.teamName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Upload JSON file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.problems && Array.isArray(parsed.problems)) {
          onImportTheme(parsed);
          setErrorMsg(null);
          onClose();
        } else {
          setErrorMsg('유효한 모둠 테마 JSON 형식이 아닙니다 (problems 배열 필수).');
        }
      } catch (err) {
        setErrorMsg('JSON 구문 오류가 발생했습니다. 파일을 다시 확인하세요.');
      }
    };
    reader.readAsText(file);
  };

  // Paste import
  const handlePasteImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.problems && Array.isArray(parsed.problems)) {
        onImportTheme(parsed);
        setErrorMsg(null);
        setJsonInput('');
        onClose();
      } else {
        setErrorMsg('유효한 모둠 테마 JSON 형식이 아닙니다.');
      }
    } catch {
      setErrorMsg('JSON 텍스트 파싱 오류입니다. 올바른 JSON 형식인지 확인해 주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/[0.12] space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-indigo-400">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">데이터 백업 및 공유</h3>
              <p className="text-xs text-zinc-400">
                모둠원 간 파일 교환 및 브라우저 저장 데이터 내보내기/가져오기
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-sm cursor-pointer"
          >
            닫기 ✕
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Export */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
            현재 모둠 데이터 내보내기 (Export)
          </span>

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>JSON 파일로 다운로드</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>클립보드 복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 2: Import */}
        <div className="space-y-3 pt-2 border-t border-white/[0.06]">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
            외부 데이터 불러오기 (Import)
          </span>

          <div>
            <label className="block p-4 rounded-xl border border-dashed border-white/20 hover:border-indigo-400/50 bg-zinc-900/40 text-center cursor-pointer transition-colors">
              <Upload className="w-5 h-5 mx-auto text-zinc-400 mb-1" />
              <span className="text-xs text-zinc-300 block font-medium">
                JSON 파일 업로드하여 병합
              </span>
              <span className="text-[11px] text-zinc-500 block mt-0.5">
                모둠원이 전달한 .json 파일을 선택하세요
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-[11px] text-zinc-400 block">
              또는 JSON 텍스트 직접 붙여넣기:
            </span>
            <textarea
              rows={3}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="클립보드의 JSON 문자열을 여기에 붙여넣으세요..."
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/[0.08] text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handlePasteImport}
              disabled={!jsonInput.trim()}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              붙여넣은 JSON 적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
