import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ExploreFeatureData {
  icon: string;
  title: string;
  description?: string;
  items?: string[]; // details/capabilities
  ctaLabel?: string;
  onCta?: () => void;
}

interface ExploreFeatureModalProps {
  open: boolean;
  onClose: () => void;
  feature?: ExploreFeatureData | null;
}

export default function ExploreFeatureModal({ open, onClose, feature }: ExploreFeatureModalProps) {
  // lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open || !feature) return null;

  return createPortal(
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* bottom-sheet on mobile, centered on larger screens */}
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
      >
        <div className="pointer-events-auto w-full sm:w-[min(92vw,640px)] max-h-[85dvh] sm:max-h-[75vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-accent/30 ring-1 ring-accent/20 bg-dark-secondary shadow-[0_18px_60px_rgba(0,212,170,0.18)] p-5 sm:p-6 pb-[max(16px,env(safe-area-inset-bottom))]">
          <div className="sm:hidden flex justify-center mb-2">
            <span className="block h-1.5 w-12 rounded-full bg-white/20" />
          </div>

          <div className="flex items-start gap-3 mb-4">
            <div className="h-12 w-12 grid place-items-center rounded-xl bg-accent/12 text-accent text-2xl ring-1 ring-accent/30">
              {feature.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold leading-tight">{feature.title}</h3>
              {feature.description && (
                <p className="text-gray-400 text-sm mt-1">{feature.description}</p>
              )}
            </div>
            <button aria-label="Close" onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-full">✕</button>
          </div>

          {feature.items && feature.items.length > 0 && (
            <ul className="space-y-2">
              {feature.items.map((it, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-accent mt-1">✓</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          )}

          {feature.onCta && (
            <div className="mt-5">
              <button onClick={feature.onCta} className="px-6 py-3 rounded-lg font-semibold text-dark-primary bg-gradient-to-r from-accent to-accent-light">
                {feature.ctaLabel ?? 'Try this feature'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>,
    document.body
  );
}
