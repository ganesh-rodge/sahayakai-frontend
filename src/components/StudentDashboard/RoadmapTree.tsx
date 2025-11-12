import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Target, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

// Minimal shape matching RoadmapPage Week/Lesson for compatibility
export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
}

export interface Week {
  weekNumber: number;
  title: string;
  lessonsCompleted: number;
  totalLessons: number;
  lessons: Lesson[];
}

interface RoadmapTreeProps {
  weeks: Week[];
  onWeekClick?: (week: Week) => void;
  onShowWeekInList?: (week: Week) => void;
}

// Util: clamp
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function RoadmapTree({ weeks, onWeekClick, onShowWeekInList }: RoadmapTreeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 1000, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panOrigin = useRef<{ x: number; y: number; left: number; top: number } | null>(null);

  // Observe container size for responsive layout
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setSize({ width: cr.width, height: cr.height });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Layout constants derived from width for responsive sizing
  const layout = useMemo(() => {
    const { width } = size;
    const isSmall = width < 640;
    const isMedium = width >= 640 && width < 1024;

    const NODE_W = isSmall ? 180 : isMedium ? 210 : 240;
    const NODE_H = isSmall ? 76 : 86;
    const ROW_GAP = isSmall ? 120 : isMedium ? 140 : 160;
    const TOP_PAD = 60;
    const BOTTOM_PAD = 120;
    const centerX = width / 2;
  const branchLen = clamp(width * 0.24, 160, 320);

    const totalHeight = TOP_PAD + weeks.length * ROW_GAP + BOTTOM_PAD;

    // Compute positioned nodes
    const nodes = weeks.map((wk, i) => {
      const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right';
      const y = TOP_PAD + i * ROW_GAP;
      const x = side === 'left' ? centerX - branchLen - NODE_W : centerX + branchLen;
      const cx = side === 'left' ? x + NODE_W : x; // connection point on node edge nearest trunk
      const cy = y + NODE_H / 2;
      return { index: i, side, x, y, cx, cy, width: NODE_W, height: NODE_H, week: wk };
    });

    return { NODE_W, NODE_H, ROW_GAP, TOP_PAD, totalHeight, centerX, branchLen, nodes };
  }, [size, weeks]);

  const setZoomSafe = (v: number) => setZoom(clamp(Number(v), 0.7, 1.6));

  // Pan with mouse drag on background (not on buttons)
  const onBackgroundMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const cont = containerRef.current;
    if (!cont) return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return; // don't start pan when interacting with nodes
    setIsPanning(true);
    panOrigin.current = {
      x: e.clientX,
      y: e.clientY,
      left: cont.scrollLeft,
      top: cont.scrollTop,
    };
    (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
  };

  const onBackgroundMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isPanning || !panOrigin.current) return;
    const cont = containerRef.current;
    if (!cont) return;
    const dx = e.clientX - panOrigin.current.x;
    const dy = e.clientY - panOrigin.current.y;
    cont.scrollLeft = panOrigin.current.left - dx;
    cont.scrollTop = panOrigin.current.top - dy;
  };

  const onBackgroundMouseUp: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setIsPanning(false);
    const el = e.currentTarget as HTMLElement;
    el.style.cursor = '';
    panOrigin.current = null;
  };

  return (
    <div className="relative rounded-2xl border border-gray-800 bg-dark-secondary overflow-hidden">
      {/* Header / Controls */}
      <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-800">
        <div className="flex items-center gap-2 text-accent">
          <Target className="w-5 h-5" />
          <span className="font-semibold">Interactive Roadmap Tree</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Zoom out"
            onClick={() => setZoomSafe(zoom - 0.1)}
            className="p-2 rounded-md bg-dark-tertiary border border-gray-700 hover:border-accent/40 hover:bg-accent/10 transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-accent" />
          </button>
          <input
            type="range"
            min={0.7}
            max={1.6}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoomSafe(parseFloat(e.target.value))}
            aria-label="Zoom"
            className="w-28 accent-green-500"
          />
          <button
            aria-label="Zoom in"
            onClick={() => setZoomSafe(zoom + 0.1)}
            className="p-2 rounded-md bg-dark-tertiary border border-gray-700 hover:border-accent/40 hover:bg-accent/10 transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-accent" />
          </button>
        </div>
      </div>

      {/* Scrollable area */}
      <div
        ref={containerRef}
        className="relative h-[560px] sm:h-[640px] md:h-[720px] overflow-auto select-none"
        onMouseDown={onBackgroundMouseDown}
        onMouseMove={onBackgroundMouseMove}
        onMouseUp={onBackgroundMouseUp}
      >
        {/* Zoomed canvas wrapper */}
        <div
          className="relative"
          style={{
            width: '100%',
            height: layout.totalHeight,
            transform: `scale(${zoom})`,
            transformOrigin: 'center top',
          }}
        >
          {/* Ambient gradient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 -translate-x-1/2 top-24 w-[60%] max-w-[720px] h-64 bg-accent/10 blur-3xl rounded-full" />
          </div>

          {/* Trunk + Branches (SVG) */}
          <svg className="absolute inset-0" width={size.width} height={layout.totalHeight}>
            {/* Main trunk path (slight organic sway) */}
            {(() => {
              const top = 16;
              const bottom = layout.totalHeight - 16;
              const x = layout.centerX;
              const sway = Math.max(14, Math.min(24, size.width * 0.02));
              const d = `M ${x},${bottom} C ${x - sway},${bottom - 200} ${x + sway},${top + 200} ${x},${top}`;
              return (
                <>
                  <path d={d} className="stroke-current text-accent/60" strokeWidth={10} fill="none" strokeLinecap="round" />
                  {/* Dashed center line */}
                  <path d={d} className="stroke-current text-accent-light/90" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeDasharray="8 8" />
                </>
              );
            })()}

            {/* Optional side stems for organic look */}
            {(() => {
              const top = 80;
              const bottom = layout.totalHeight - 40;
              const x = layout.centerX - 10;
              const sway = Math.max(10, Math.min(20, size.width * 0.015));
              const dLeft = `M ${x},${bottom} C ${x - sway},${bottom - 160} ${x + sway - 20},${top + 160} ${x - 8},${top}`;
              const x2 = layout.centerX + 10;
              const dRight = `M ${x2},${bottom} C ${x2 + sway},${bottom - 160} ${x2 - sway + 20},${top + 160} ${x2 + 8},${top}`;
              return (
                <g>
                  <path d={dLeft} className="stroke-current text-accent/30" strokeWidth={6} fill="none" strokeLinecap="round" />
                  <path d={dRight} className="stroke-current text-accent/30" strokeWidth={6} fill="none" strokeLinecap="round" />
                </g>
              );
            })()}

            {/* Branches with curved connectors and dashed inner line */}
            <g className="stroke-current" fill="none">
              {layout.nodes.map((n) => {
                const startX = layout.centerX;
                const startY = n.cy;
                const endX = n.cx;
                const endY = n.cy;
                const ctrlOffset = layout.branchLen * 0.65;
                const c1x = startX + (n.side === 'left' ? -ctrlOffset : ctrlOffset);
                const c1y = startY - 12; // slight upward curve
                const c2x = endX + (n.side === 'left' ? ctrlOffset : -ctrlOffset);
                const c2y = endY - 12;
                const d = `M ${startX},${startY} C ${c1x},${c1y} ${c2x},${c2y} ${endX},${endY}`;
                return (
                  <g key={`branch-${n.index}`}>
                    <path d={d} className="text-accent/70 drop-shadow-[0_0_6px_rgba(34,197,94,0.25)]" strokeWidth={4} strokeLinecap="round" />
                    <path d={d} className="text-accent-light/90" strokeWidth={1.75} strokeLinecap="round" strokeDasharray="6 8" />
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Nodes */}
          {layout.nodes.map((n) => {
            const wk = n.week;
            const isComplete = wk.lessonsCompleted >= wk.totalLessons && wk.totalLessons > 0;
            const progress = wk.totalLessons > 0 ? Math.round((wk.lessonsCompleted / wk.totalLessons) * 100) : 0;
            const isSelected = selectedWeek?.weekNumber === wk.weekNumber;

            return (
              <motion.button
                key={`node-${wk.weekNumber}`}
                onClick={() => {
                  setSelectedWeek((prev) => (prev?.weekNumber === wk.weekNumber ? null : wk));
                  onWeekClick?.(wk);
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: n.index * 0.03 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={[
                  'absolute text-left rounded-full px-5 py-4 shadow-lg border transition-colors',
                  'bg-dark-tertiary/80 backdrop-blur-md',
                  isComplete ? 'border-green-500/40' : 'border-accent/30 hover:border-accent/60',
                  'hover:shadow-accent/20',
                  selectedWeek && !isSelected ? 'opacity-60' : 'opacity-100',
                ].join(' ')}
                style={{ left: n.x, top: n.y, width: n.width, height: n.height }}
              >
                <div className="flex items-center gap-3">
                  {/* Status dot */}
                  <div
                    className={[
                      'w-3 h-3 rounded-full ring-4',
                      isComplete ? 'bg-green-400 ring-green-400/20' : 'bg-accent ring-accent/20',
                    ].join(' ')}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="truncate">
                        <p className="text-xs text-gray-400">Week {wk.weekNumber}</p>
                        <p className="font-semibold truncate">{wk.title}</p>
                      </div>
                      {isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>
                            {wk.lessonsCompleted}/{wk.totalLessons}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 w-full bg-dark-secondary rounded-full overflow-hidden">
                      <div
                        className={[
                          'h-full rounded-full transition-all',
                          isComplete ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-accent to-accent-light',
                        ].join(' ')}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* Popover with training of selected week (others remain hidden) */}
          {selectedWeek && (() => {
            const selectedNode = layout.nodes.find((n) => n.week.weekNumber === selectedWeek.weekNumber);
            if (!selectedNode) return null;
            const panelWidth = 320;
            const left = selectedNode.side === 'left' ? selectedNode.x - panelWidth - 16 : selectedNode.x + selectedNode.width + 16;
            const top = selectedNode.y - 8;
            return (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute z-10"
                style={{ left: Math.max(8, left), top }}
              >
                <div className="relative w-[320px] max-w-[70vw] rounded-xl border border-accent/30 bg-dark-secondary/95 backdrop-blur-md shadow-xl">
                  <div className="p-3 sm:p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <p className="text-xs text-gray-400">Week {selectedWeek.weekNumber}</p>
                        <h3 className="font-semibold truncate max-w-[220px]">{selectedWeek.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {(() => {
                          const idx = weeks.findIndex(w => w.weekNumber === selectedWeek.weekNumber);
                          const hasPrev = idx > 0;
                          const hasNext = idx >= 0 && idx < weeks.length - 1;
                          return (
                            <>
                              <button
                                aria-label="Previous week"
                                disabled={!hasPrev}
                                onClick={() => hasPrev && setSelectedWeek(weeks[idx - 1])}
                                className={`p-1 rounded-md border ${hasPrev ? 'border-gray-700 hover:border-accent/40 hover:bg-accent/10 text-gray-300' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                aria-label="Next week"
                                disabled={!hasNext}
                                onClick={() => hasNext && setSelectedWeek(weeks[idx + 1])}
                                className={`p-1 rounded-md border ${hasNext ? 'border-gray-700 hover:border-accent/40 hover:bg-accent/10 text-gray-300' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          );
                        })()}
                        <button
                          className="ml-1 text-sm text-gray-400 hover:text-accent px-2 py-1 rounded-md"
                          onClick={() => setSelectedWeek(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                    {/* Week pills selector */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                      {weeks.map((w) => (
                        <button
                          key={`pill-${w.weekNumber}`}
                          onClick={() => setSelectedWeek(w)}
                          className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                            w.weekNumber === selectedWeek.weekNumber
                              ? 'bg-accent/20 text-accent border-accent/40'
                              : 'text-gray-300 border-gray-700 hover:border-accent/30 hover:text-accent'
                          }`}
                        >
                          W{w.weekNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="max-h-[260px] overflow-auto p-3 space-y-2">
                    {selectedWeek.lessons.length === 0 && (
                      <p className="text-xs text-gray-400">No lessons yet.</p>
                    )}
                    {selectedWeek.lessons.map((lsn) => (
                      <div key={lsn.id} className="p-3 rounded-lg bg-dark-tertiary border border-gray-800 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{lsn.title}</p>
                          <p className="text-xs text-gray-500 truncate">{lsn.description}</p>
                        </div>
                        {lsn.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{lsn.duration}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Actions */}
                  <div className="p-3 border-t border-gray-800 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-gray-400">
                      {selectedWeek.lessonsCompleted}/{selectedWeek.totalLessons} complete
                    </div>
                    <button
                      onClick={() => onShowWeekInList?.(selectedWeek)}
                      className="px-3 py-1.5 rounded-md bg-gradient-to-r from-accent to-accent-light text-dark-primary text-xs font-medium hover:shadow-lg hover:shadow-accent/30"
                    >
                      View in List
                    </button>
                  </div>
                </div>
                {/* Arrow */}
                <div
                  className={[
                    'absolute top-6 w-3 h-3 rotate-45 border border-accent/30 bg-dark-secondary/95',
                    selectedNode.side === 'left' ? 'right-[-6px] border-l-0 border-b-0' : 'left-[-6px] border-r-0 border-t-0',
                  ].join(' ')}
                />
              </motion.div>
            );
          })()}
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-800">
        Tip: Use the zoom controls or scroll to explore your roadmap. Click a week to view lessons.
      </div>
    </div>
  );
}
