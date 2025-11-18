import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

interface FaceCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptured: (dataUrl: string) => void;
  title?: string;
}

type DetectState = 'none' | 'ready' | 'captured';

export default function FaceCaptureModal({ isOpen, onClose, onCaptured, title }: FaceCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [loadingModels, setLoadingModels] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [state, setState] = useState<DetectState>('none');
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 640, h: 360 });

  const borderColor = useMemo(() => {
    if (state === 'captured') return '#FACC15'; // yellow-400
    if (state === 'ready') return '#22C55E'; // green-500
    return '#EF4444'; // red-500
  }, [state]);

  const stopStream = useCallback(() => {
    const v = videoRef.current;
    if (v && v.srcObject) {
      (v.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      v.srcObject = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoadingModels(true);
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        if (!cancelled) setLoadingModels(false);
      } catch (err) {
        console.error('Failed loading face model', err);
        if (!cancelled) setLoadingModels(false);
      }
    }
    if (isOpen) load();
    return () => { cancelled = true; };
  }, [isOpen]);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        setStreamError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        const v = videoRef.current;
        if (v) {
          v.srcObject = stream;
          await v.play();
          setRunning(true);
        }
      } catch (err: any) {
        console.error('getUserMedia error', err);
        setStreamError(err?.message ?? 'Unable to access camera');
      }
    }
    if (isOpen && !loadingModels) start();
    return () => { cancelled = true; setRunning(false); stopStream(); };
  }, [isOpen, loadingModels, stopStream]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      setDims({ w: Math.max(1, Math.floor(r.width)), h: Math.max(1, Math.floor(r.height)) });
    };
    update();
    const RO = (window as any).ResizeObserver as undefined | (new (callback: ResizeObserverCallback) => ResizeObserver);
    const ro = RO ? new RO(() => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }) : undefined;
    ro?.observe?.(el as Element);
    window.addEventListener('orientationchange', update);
    window.addEventListener('resize', update);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect?.();
      window.removeEventListener('orientationchange', update);
      window.removeEventListener('resize', update);
    };
  }, [isOpen]);

  useEffect(() => {
    let raf = 0;
    const v = videoRef.current;
    if (!running || !v) return;
    const opt = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
    const loop = async () => {
      if (!v || v.readyState < 2) { raf = requestAnimationFrame(loop); return; }
      try {
        const det = await faceapi.detectSingleFace(v, opt);
        const vw = v.clientWidth || v.videoWidth || 640;
        const vh = v.clientHeight || v.videoHeight || 480;
        const cx = vw / 2; const cy = vh / 2;
        const base = Math.min(vw, vh) * 0.6;
        const diameter = Math.max(180, Math.min(420, base));
        const radius = diameter / 2;
        if (det) {
          const { x, y, width, height } = det.box;
          const fx = x + width / 2; const fy = y + height / 2;
          const dx = fx - cx; const dy = fy - cy;
          const inCircle = (dx * dx + dy * dy) <= (radius * radius);
          setState(prev => (prev === 'captured' ? 'captured' : (inCircle ? 'ready' : 'none')));
        } else {
          setState(prev => (prev === 'captured' ? 'captured' : 'none'));
        }
      } catch {
        setState(prev => (prev === 'captured' ? 'captured' : 'none'));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const handleCapture = useCallback(() => {
    const v = videoRef.current;
    const c = captureCanvasRef.current;
    if (!v || !c) return;
    const vw = v.videoWidth || 640;
    const vh = v.videoHeight || 480;
    c.width = vw; c.height = vh;
    const ctx = c.getContext('2d'); if (!ctx) return;
    ctx.drawImage(v, 0, 0, vw, vh);
    const dataUrl = c.toDataURL('image/jpeg', 0.9);
    setCapturedUrl(dataUrl);
    setState('captured');
  }, []);

  const handleUse = useCallback(() => {
    if (capturedUrl) {
      onCaptured(capturedUrl);
      setCapturedUrl(null);
      setState('none');
      onClose();
    }
  }, [capturedUrl, onCaptured, onClose]);

  const handleRetake = useCallback(() => {
    setCapturedUrl(null);
    setState('none');
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-2xl mx-0 sm:mx-4 rounded-none sm:rounded-xl border border-gray-700 bg-dark-secondary p-0 sm:p-4 shadow-2xl h-dvh sm:h-auto sm:max-h-[90dvh]">
        <div className="flex items-center justify-between mb-2 p-4 sm:p-0">
          <h3 className="text-lg font-semibold">{title ?? 'Capture Your Photo'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {streamError && (
          <div className="text-sm text-red-400 mb-3 px-4 sm:px-0">{streamError}</div>
        )}

        <div ref={frameRef} className="relative flex items-center justify-center bg-black sm:rounded-lg overflow-hidden aspect-video w-full">
          {!capturedUrl ? (
            <>
              <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
              <svg className="pointer-events-none absolute inset-0 w-full h-full" viewBox={`0 0 ${dims.w} ${dims.h}`}>
                {(() => {
                  const vw = dims.w; const vh = dims.h;
                  const base = Math.min(vw, vh) * 0.6;
                  const diameter = Math.max(180, Math.min(420, base));
                  const r = diameter / 2; const cx = vw / 2; const cy = vh / 2;
                  return (
                    <>
                      <defs>
                        <mask id="hole-mask">
                          <rect x="0" y="0" width={vw} height={vh} fill="white" />
                          <circle cx={cx} cy={cy} r={r} fill="black" />
                        </mask>
                      </defs>
                      <rect x="0" y="0" width={vw} height={vh} fill="rgba(0,0,0,0.45)" mask="url(#hole-mask)" />
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke={borderColor} strokeWidth={Math.max(3, Math.min(6, r * 0.04))} />
                    </>
                  );
                })()}
              </svg>
            </>
          ) : (
            <img src={capturedUrl} alt="Captured" className="w-full h-auto object-contain" />
          )}
        </div>

        <canvas ref={captureCanvasRef} className="hidden" />

        <div className="mt-4 flex items-center justify-between gap-2 px-4 sm:px-0 pb-4 sm:pb-0">
          <div className="text-xs text-gray-400">
            {loadingModels ? 'Loading face model…' : state === 'ready' ? 'Face centered — ready to capture' : state === 'captured' ? 'Preview captured photo' : 'Center your face inside the circle'}
          </div>
          <div className="flex items-center gap-2">
            {!capturedUrl ? (
              <button
                type="button"
                onClick={handleCapture}
                disabled={loadingModels || state !== 'ready'}
                className={`px-4 py-2 rounded-lg font-semibold ${loadingModels || state !== 'ready' ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-accent text-dark-primary hover:brightness-110'}`}
              >
                Capture
              </button>
            ) : (
              <>
                <button type="button" onClick={handleRetake} className="px-4 py-2 rounded-lg font-semibold bg-gray-700 text-white hover:bg-gray-600">Retake</button>
                <button type="button" onClick={handleUse} className="px-4 py-2 rounded-lg font-semibold bg-linear-to-r from-accent to-accent-light text-dark-primary">Use Photo</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
