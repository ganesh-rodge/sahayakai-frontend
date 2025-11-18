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
  const [loadingModels, setLoadingModels] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [state, setState] = useState<DetectState>('none');
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const ringColor = useMemo(() => {
    if (state === 'captured') return 'ring-yellow-400';
    if (state === 'ready') return 'ring-green-500';
    return 'ring-red-500';
  }, [state]);

  const stopStream = useCallback(() => {
    const v = videoRef.current;
    if (v && v.srcObject) {
      (v.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      v.srcObject = null;
    }
  }, []);

  // Load face-api model
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
    if (isOpen) {
      load();
    }
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Start camera when open and models loaded
  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        setStreamError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 }, audio: false });
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
    return () => {
      cancelled = true;
      setRunning(false);
      stopStream();
    };
  }, [isOpen, loadingModels, stopStream]);

  // Detect faces and gate capture
  useEffect(() => {
    let raf = 0;
    const v = videoRef.current;
    if (!running || !v) return;

    const opt = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

    const loop = async () => {
      if (!v || v.readyState < 2) {
        raf = requestAnimationFrame(loop);
        return;
      }
      try {
        const det = await faceapi.detectSingleFace(v, opt);
        const vw = v.videoWidth || 640;
        const vh = v.videoHeight || 480;
        const cx = vw / 2;
        const cy = vh / 2;
        const radius = Math.min(vw, vh) * 0.35;

        if (det) {
          const { x, y, width, height } = det.box;
          const fx = x + width / 2;
          const fy = y + height / 2;
          const dx = fx - cx;
          const dy = fy - cy;
          const inCircle = (dx * dx + dy * dy) <= (radius * radius);
          setState(prev => (prev === 'captured' ? 'captured' : (inCircle ? 'ready' : 'none')));
        } else {
          setState(prev => (prev === 'captured' ? 'captured' : 'none'));
        }
      } catch (e) {
        // keep running but mark none
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
    c.width = vw;
    c.height = vh;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(v, 0, 0, vw, vh);

    // Optional: crop to centered circle (export rectangular to keep it simple)
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
      <div className="relative w-full max-w-2xl mx-4 rounded-xl border border-gray-700 bg-dark-secondary p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{title ?? 'Capture Your Photo'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {streamError && (
          <div className="text-sm text-red-400 mb-3">{streamError}</div>
        )}

        <div className="relative flex items-center justify-center bg-black rounded-lg overflow-hidden aspect-video">
          {!capturedUrl ? (
            <>
              <video ref={videoRef} playsInline muted className="w-full h-auto" />
              {/* Guidance ring */}
              <div className={`pointer-events-none absolute inset-0 flex items-center justify-center`}>
                <div className={`rounded-full ${ringColor}`} style={{ width: '60%', height: '60%', boxShadow: '0 0 0 200vmax rgba(0,0,0,0.45) inset' }} />
              </div>
            </>
          ) : (
            <img src={capturedUrl} alt="Captured" className="w-full h-auto object-contain" />
          )}
        </div>

        <canvas ref={captureCanvasRef} className="hidden" />

        <div className="mt-4 flex items-center justify-between gap-2">
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
                <button type="button" onClick={handleUse} className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-accent to-accent-light text-dark-primary">Use Photo</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
