import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  forceMathMode?: boolean;
}

/**
 * Parses text containing $inline math$ or $$display math$$ and renders via KaTeX.
 * If text doesn't contain $ delimiters but looks like a mathematical expression,
 * or forceMathMode is true, it automatically renders with KaTeX display mode.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = '',
  forceMathMode = false,
}) => {
  if (!content) return null;

  // If forceMathMode or the entire string appears to be a pure formula (no $ but contains math symbols)
  const hasDollarDelimiters = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/.test(content);

  // If it's a pure mathematical formula without dollar signs
  const looksLikeFormula =
    forceMathMode ||
    (!hasDollarDelimiters &&
      /[\^_\\=+\-*/<>]|\b(sin|cos|tan|log|lim|sum|int|pmod|equiv|implies|times|div|frac|sqrt|alpha|beta|theta|pi)\b/i.test(
        content
      ) &&
      !content.includes('\n\n'));

  if (looksLikeFormula && !hasDollarDelimiters) {
    try {
      const html = katex.renderToString(content.trim(), {
        displayMode: true,
        throwOnError: false,
      });
      return (
        <div
          className={`overflow-x-auto py-1 text-center my-1 font-serif ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      // Fall through to standard token parser
    }
  }

  // Tokenize by $$...$$ or $...$
  const parts: React.ReactNode[] = [];
  const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {content.slice(lastIndex, match.index)}
        </span>
      );
    }

    const token = match[0];
    const isDisplay = token.startsWith('$$') && token.endsWith('$$');
    const math = isDisplay ? token.slice(2, -2) : token.slice(1, -1);

    try {
      const html = katex.renderToString(math.trim(), {
        displayMode: isDisplay,
        throwOnError: false,
      });
      parts.push(
        <span
          key={`math-${match.index}`}
          className={
            isDisplay
              ? 'block my-2 overflow-x-auto text-center'
              : 'inline-block mx-0.5 align-middle'
          }
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      parts.push(
        <code
          key={`err-${match.index}`}
          className="font-mono text-amber-400 bg-zinc-800 px-1 py-0.5 rounded text-sm"
        >
          {token}
        </code>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < content.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {content.slice(lastIndex)}
      </span>
    );
  }

  return (
    <div className={`whitespace-pre-line leading-relaxed ${className}`}>
      {parts}
    </div>
  );
};
