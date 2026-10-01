import { useEffect, useRef, useState } from 'react';
import { DEFAULT_CONFIG, LOGOS, PRESET_PHOTOS, type PostConfig, type PostEvent } from '../lib/post-maker/defaults';
import { buildCaption, drawPost, H, THEMES, W, type Assets } from '../lib/post-maker/render';

const STORAGE_KEY = 'lv-post-maker-v1';
const CHOATE_LOGO_KEY = 'lv-post-maker-choate-logo';

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function loadSaved(): PostConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    // ignore unreadable storage
  }
  return DEFAULT_CONFIG;
}

const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none';
const label = 'block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1';

export default function PostMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cfg, setCfg] = useState<PostConfig>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [assets, setAssets] = useState<Assets>({ photo: null, tomahawks: null, choate: null });
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCfg(loadSaved());
    setLoaded(true);
    Promise.all([document.fonts.load('100px Anton'), document.fonts.load('500 40px Oswald'), document.fonts.load('600 40px Oswald'), document.fonts.load('700 40px Oswald')])
      .catch(() => undefined)
      .then(() => setFontsReady(true));
    let savedChoate: string | null = null;
    try {
      savedChoate = localStorage.getItem(CHOATE_LOGO_KEY);
    } catch {
      // ignore
    }
    Promise.all([loadImage(LOGOS.tomahawks), savedChoate ? loadImage(savedChoate) : loadImage(LOGOS.choate)]).then(([tomahawks, choate]) =>
      setAssets((a) => ({ ...a, tomahawks, choate })),
    );
    try {
      const probe = new File([new Blob()], 'p.png', { type: 'image/png' });
      setCanShare(!!navigator.canShare?.({ files: [probe] }));
    } catch {
      setCanShare(false);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch {
      // ignore full/blocked storage
    }
  }, [cfg, loaded]);

  // Load whichever photo is selected.
  useEffect(() => {
    const src = cfg.photoId === 'upload' ? uploadedPhoto : PRESET_PHOTOS.find((p) => p.id === cfg.photoId)?.src;
    if (!src) {
      setAssets((a) => ({ ...a, photo: null }));
      return;
    }
    loadImage(src).then((photo) => setAssets((a) => ({ ...a, photo })));
  }, [cfg.photoId, uploadedPhoto]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && fontsReady) drawPost(ctx, cfg, assets);
  }, [cfg, assets, fontsReady]);

  const set = <K extends keyof PostConfig>(key: K, value: PostConfig[K]) => setCfg((c) => ({ ...c, [key]: value }));
  const setEvent = (i: number, patch: Partial<PostEvent>) =>
    setCfg((c) => ({ ...c, events: c.events.map((e, j) => (j === i ? { ...e, ...patch } : e)) }));

  const choosePreset = (id: string) => {
    const p = PRESET_PHOTOS.find((x) => x.id === id);
    setCfg((c) => ({ ...c, photoId: id, photoZoom: 1, photoX: p?.x ?? 0.5, photoY: p?.y ?? 0.3 }));
  };

  const onPhotoUpload = async (file?: File) => {
    if (!file) return;
    setUploadedPhoto(await readFile(file));
    setCfg((c) => ({ ...c, photoId: 'upload', photoZoom: 1, photoX: 0.5, photoY: 0.3 }));
  };

  const onChoateUpload = async (file?: File) => {
    if (!file) return;
    const url = await readFile(file);
    try {
      localStorage.setItem(CHOATE_LOGO_KEY, url);
    } catch {
      // too big to remember; still use it for this session
    }
    const choate = await loadImage(url);
    setAssets((a) => ({ ...a, choate }));
  };

  const fileName = () => `lucie-${[cfg.titleTop, cfg.titleBottom].join('-').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;

  const getBlob = () => new Promise<Blob | null>((resolve) => canvasRef.current?.toBlob(resolve, 'image/png'));

  const download = async () => {
    const blob = await getBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName();
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const share = async () => {
    const blob = await getBlob();
    if (!blob) return;
    try {
      await navigator.share({ files: [new File([blob], fileName(), { type: 'image/png' })] });
    } catch {
      // user cancelled
    }
  };

  const caption = buildCaption(cfg);
  const copyCaption = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => {
    if (confirm('Reset everything back to the defaults?')) {
      setCfg(DEFAULT_CONFIG);
      choosePreset(DEFAULT_CONFIG.photoId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div>
            <h1 className="font-semibold">Instagram Post Maker</h1>
            <p className="text-white/60 text-xs -mt-0.5">Lucie Valle recruiting</p>
          </div>
          <a href="/" className="text-white/70 hover:text-white text-sm">
            ← Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Preview */}
        <section className="lg:sticky lg:top-4 self-start space-y-3">
          <canvas ref={canvasRef} width={W} height={H} className="w-full h-auto rounded-xl shadow-lg bg-black" />
          <div className="flex flex-wrap gap-2">
            {canShare && (
              <button onClick={share} className="flex-1 rounded-lg bg-gold px-4 py-3 font-semibold text-navy-dark">
                Share / Save to Photos
              </button>
            )}
            <button onClick={download} className="flex-1 rounded-lg bg-navy px-4 py-3 font-semibold text-white">
              Download PNG
            </button>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className={label}>Caption</span>
              <button onClick={copyCaption} className="text-sm font-semibold text-navy">
                {copied ? 'Copied ✓' : 'Copy caption'}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{caption}</pre>
          </div>
        </section>

        {/* Controls */}
        <section className="space-y-5">
          <Card title="1. Events">
            <p className="text-xs text-gray-500 mb-3">Sorted by date on the post. Up to 6 fit. Leave end date blank for one-day events.</p>
            <div className="space-y-3">
              {cfg.events.map((e, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className={label}>Date</span>
                      <input type="date" className={input} value={e.date} onChange={(ev) => setEvent(i, { date: ev.target.value })} />
                    </div>
                    <div>
                      <span className={label}>End date</span>
                      <input type="date" className={input} value={e.endDate} onChange={(ev) => setEvent(i, { endDate: ev.target.value })} />
                    </div>
                  </div>
                  <input className={input} placeholder="Event name" value={e.name} onChange={(ev) => setEvent(i, { name: ev.target.value })} />
                  <div className="flex gap-2">
                    <input className={input} placeholder="City, ST" value={e.location} onChange={(ev) => setEvent(i, { location: ev.target.value })} />
                    <button
                      onClick={() => setCfg((c) => ({ ...c, events: c.events.filter((_, j) => j !== i) }))}
                      className="shrink-0 rounded-lg border border-gray-300 px-3 text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCfg((c) => ({ ...c, events: [...c.events, { date: '', endDate: '', name: '', location: '' }] }))}
              className="mt-3 w-full rounded-lg border-2 border-dashed border-gray-300 py-2 text-sm font-semibold text-gray-600"
            >
              + Add event
            </button>
          </Card>

          <Card title="2. Photo">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {PRESET_PHOTOS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => choosePreset(p.id)}
                  className={`overflow-hidden rounded-lg border-2 ${cfg.photoId === p.id ? 'border-gold' : 'border-transparent'}`}
                >
                  <img src={p.src} alt={p.label} className="h-28 w-full object-cover" />
                  <span className="block bg-white py-1 text-xs">{p.label}</span>
                </button>
              ))}
            </div>
            <label className="block rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-navy cursor-pointer">
              {cfg.photoId === 'upload' && uploadedPhoto ? 'Using uploaded photo, tap to change' : 'Upload a different photo'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onPhotoUpload(e.target.files?.[0])} />
            </label>
            <div className="mt-4 space-y-3">
              <Slider name="Zoom" min={1} max={2.5} step={0.01} value={cfg.photoZoom} onChange={(v) => set('photoZoom', v)} />
              <Slider name="Left ↔ right" min={0} max={1} step={0.01} value={cfg.photoX} onChange={(v) => set('photoX', v)} />
              <Slider name="Up ↕ down" min={0} max={1} step={0.01} value={cfg.photoY} onChange={(v) => set('photoY', v)} />
            </div>
          </Card>

          <Card title="3. Text">
            <div className="grid grid-cols-2 gap-3">
              <Field name="Title (white)" value={cfg.titleTop} onChange={(v) => set('titleTop', v)} />
              <Field name="Title (gold)" value={cfg.titleBottom} onChange={(v) => set('titleBottom', v)} />
              <Field name="Name" value={cfg.name} onChange={(v) => set('name', v)} />
              <Field name="Number" value={cfg.number} onChange={(v) => set('number', v)} />
              <Field name="Position" value={cfg.position} onChange={(v) => set('position', v)} />
              <Field name="Grad year" value={cfg.gradYear} onChange={(v) => set('gradYear', v)} />
            </div>
            <div className="mt-3 space-y-3">
              <Field name="Team line" value={cfg.teamLine} onChange={(v) => set('teamLine', v)} />
              <Field name="School line" value={cfg.schoolLine} onChange={(v) => set('schoolLine', v)} />
              <Field name="Footer (website / email / handle)" value={cfg.footer} onChange={(v) => set('footer', v)} />
              <Field name="Team Instagram tag (caption)" value={cfg.igTeamHandle} onChange={(v) => set('igTeamHandle', v)} />
            </div>
          </Card>

          <Card title="4. Look">
            <span className={label}>Colors</span>
            <div className="flex gap-2 mb-4">
              {Object.entries(THEMES).map(([id, t]) => (
                <button
                  key={id}
                  onClick={() => set('theme', id as PostConfig['theme'])}
                  className={`flex-1 rounded-lg border-2 px-3 py-2 text-sm ${cfg.theme === id ? 'border-gold' : 'border-gray-200'}`}
                >
                  <span className="inline-block h-3 w-3 rounded-full mr-1 align-middle" style={{ background: t.primary }} />
                  <span className="inline-block h-3 w-3 rounded-full mr-2 align-middle" style={{ background: t.accent }} />
                  {t.label}
                </button>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={cfg.showTomahawks} onChange={(e) => set('showTomahawks', e.target.checked)} />
                NH Tomahawks logo
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={cfg.showChoate} onChange={(e) => set('showChoate', e.target.checked)} />
                Choate logo
                {!assets.choate && <span className="text-xs text-amber-600">(placeholder until you upload the seal)</span>}
              </label>
              <label className="inline-block text-xs font-semibold text-navy cursor-pointer underline">
                Upload Choate logo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onChoateUpload(e.target.files?.[0])} />
              </label>
            </div>
          </Card>

          <button onClick={reset} className="text-sm text-gray-500 underline">
            Reset to defaults
          </button>
        </section>
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 font-semibold text-navy">{title}</h2>
      {children}
    </div>
  );
}

function Field({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <span className={label}>{name}</span>
      <input className={input} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Slider({ name, value, min, max, step, onChange }: { name: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className={label}>{name}</span>
      <input type="range" className="w-full" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
