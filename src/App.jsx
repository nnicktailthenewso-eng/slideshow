import { useCallback, useEffect, useRef, useState } from 'react';

/* =====================================================================
   1) ข้อมูลสไลด์ — แก้เนื้อหาตรงส่วนนี้
   ===================================================================== */

const AUTO_MS = 4000; // เวลาเปลี่ยนสไลด์อัตโนมัติ (มิลลิวินาที)

// โหมดแกลเลอรีสินค้า
// ใส่รูปจริงได้ด้วยฟิลด์ image เช่น image: '/images/dripper.jpg' (วางไฟล์ไว้ใน public/images/)
// ถ้าไม่ใส่ image จะใช้ภาพ SVG ตัวอย่างตาม id (dripper | mug | kettle | grinder)
const PRODUCTS = [
  { id: 'dripper', type: 'ดริปเปอร์เซรามิก', name: 'Kōn 02', desc: 'กรวยเซรามิกเคลือบด้าน สกัดกาแฟสม่ำเสมอ ใช้กับกระดาษกรองทรงกรวยขนาด 02', price: '฿690', spec: 'เซรามิก · 1–2 ถ้วย', tint: '#dfe7f5', tint2: '#b9c9ea', ink: '#1b2540' },
  { id: 'mug', type: 'แก้วมัก', name: 'Dune Mug 280', desc: 'แก้วทรงเตี้ย ถือถนัดมือ เคลือบสองชั้นกันคราบกาแฟ ใช้ได้ในไมโครเวฟ', price: '฿320', spec: '280 มล. · 340 กรัม', tint: '#f0e1d4', tint2: '#e2c3a8', ink: '#3a2417' },
  { id: 'kettle', type: 'กาดริป', name: 'Heron Kettle', desc: 'คอยาวควบคุมสายน้ำได้ละเอียด ก้นเรียบใช้ได้กับเตาไฟฟ้าและเตาแม่เหล็ก', price: '฿2,450', spec: 'สแตนเลส · 0.9 ลิตร', tint: '#dbe9e3', tint2: '#a9ccbd', ink: '#12382c' },
  { id: 'grinder', type: 'เครื่องบดมือหมุน', name: 'Mill 38', desc: 'เฟืองบดขนาด 38 มม. ปรับความละเอียดได้ 40 ระดับ บดเสร็จใน 40 วินาที', price: '฿3,900', spec: 'อะลูมิเนียม · 25 กรัม', tint: '#e4e4ea', tint2: '#bfc0cc', ink: '#1d1e2b' },
];

// โหมดงานนำเสนอ — kind: title | bullets | stat | code | end
const TALK = [
  { kind: 'title', eyebrow: 'React · เวิร์กชอป', title: 'สไลด์โชว์บนเว็บด้วย React', sub: 'คอมโพเนนต์เดียวใช้ได้ทั้งแกลเลอรีสินค้าและงานนำเสนอ' },
  { kind: 'bullets', eyebrow: 'โครงสร้าง', title: 'แบ่งเป็นสามส่วน', items: [['Deck', 'เก็บ state ว่าตอนนี้อยู่สไลด์ไหน'], ['Slide', 'แสดงเนื้อหาของหนึ่งหน้า'], ['Controls', 'ปุ่ม จุด และการเล่นอัตโนมัติ']] },
  { kind: 'stat', eyebrow: 'การควบคุม', title: 'เปลี่ยนสไลด์ได้ห้าวิธี', big: '5', items: [['ปุ่มลูกศร', 'คลิกหรือแตะที่เวที'], ['จุดบอกตำแหน่ง', 'กระโดดไปสไลด์ที่ต้องการ'], ['คีย์บอร์ด', '← → Home End'], ['ปัดนิ้ว', 'บนมือถือและแท็บเล็ต'], ['เล่นอัตโนมัติ', 'เว้นช่วงละ 4 วินาที']] },
  { kind: 'code', eyebrow: 'หัวใจของ Deck', title: 'state ตัวเดียวพอ', code: 'const [i, setI] = useState(0);\nconst next = () => setI(n => Math.min(n + 1, last));\nconst prev = () => setI(n => Math.max(n - 1, 0));\n// track: translateX(-i * 100%)' },
  { kind: 'end', eyebrow: 'ขั้นต่อไป', title: 'ใส่เนื้อหาของคุณเอง', tags: ['แก้ข้อมูลใน App.jsx', 'เปลี่ยนสี', 'เพิ่มภาพจริง'] },
];

/* =====================================================================
   2) ภาพสินค้าตัวอย่าง (SVG) — สีอ้างอิงจากตัวแปร --ink / --tint2
   ===================================================================== */

function Art({ id }) {
  return (
    <svg viewBox="0 0 400 380" aria-hidden="true">
      <ellipse className="f-sh" cx="200" cy="346" rx="120" ry="12" />
      {id === 'dripper' && (
        <>
          <path className="f-c" d="M140 296 h120 l-10 46 h-100 z" />
          <path className="f-b" d="M110 150 L290 150 L240 270 L160 270 Z" />
          <rect className="f-a" x="98" y="136" width="204" height="18" rx="9" />
          <rect className="f-a" x="150" y="270" width="100" height="16" rx="8" />
          <path className="s-a" d="M170 190 L222 190" strokeWidth="5" opacity=".35" />
        </>
      )}
      {id === 'mug' && (
        <>
          <path className="s-a" d="M270 190 h22 a34 34 0 0 1 0 68 h-22" strokeWidth="18" />
          <path className="f-b" d="M120 150 h150 v110 a45 45 0 0 1 -45 45 h-60 a45 45 0 0 1 -45 -45 z" />
          <ellipse className="f-a" cx="195" cy="150" rx="75" ry="12" />
          <path className="s-a" d="M165 118 q-10 -16 0 -30 M200 118 q-10 -16 0 -30 M235 118 q-10 -16 0 -30" strokeWidth="6" opacity=".4" />
        </>
      )}
      {id === 'kettle' && (
        <>
          <path className="s-a" d="M282 196 q58 0 58 48 q0 38 -50 44" strokeWidth="14" />
          <path className="f-a" d="M124 236 q-52 -8 -72 -76 l14 -6 q22 52 64 58 z" />
          <path className="f-b" d="M120 210 a80 72 0 0 1 160 0 v62 a22 22 0 0 1 -22 22 h-116 a22 22 0 0 1 -22 -22 z" />
          <rect className="f-a" x="168" y="126" width="64" height="14" rx="7" />
          <circle className="f-a" cx="200" cy="114" r="11" />
        </>
      )}
      {id === 'grinder' && (
        <>
          <path className="f-a" d="M148 176 l20 -64 h64 l20 64 z" />
          <rect className="f-a" x="190" y="80" width="20" height="34" />
          <path className="s-a" d="M200 86 h74" strokeWidth="12" />
          <circle className="f-a" cx="282" cy="86" r="15" />
          <rect className="f-b" x="128" y="172" width="144" height="140" rx="14" />
          <circle className="f-a" cx="200" cy="230" r="28" />
          <circle className="f-c" cx="200" cy="230" r="10" />
          <rect className="f-c" x="152" y="274" width="96" height="24" rx="6" />
        </>
      )}
    </svg>
  );
}

// รูปสินค้า: ใช้รูปจริงถ้ามี image ไม่เช่นนั้นใช้ SVG ตัวอย่าง
function ProductImage({ item, alt = '' }) {
  return item.image ? <img src={item.image} alt={alt} /> : <Art id={item.id} />;
}

const tintVars = (p) => ({ '--tint': p.tint, '--tint2': p.tint2, '--ink': p.ink });

/* =====================================================================
   3) หน้าตาของสไลด์แต่ละหน้า
   ===================================================================== */

function ProductSlide({ item: p }) {
  return (
    <article className="slide g-slide" style={tintVars(p)} aria-label={p.name}>
      <div className="art">
        <ProductImage item={p} alt={p.name} />
      </div>
      <div className="info">
        <p className="kicker">{p.type}</p>
        <h2>{p.name}</h2>
        <p className="desc">{p.desc}</p>
        <div className="meta">
          <span className="price">{p.price}</span>
          <span className="spec">{p.spec}</span>
        </div>
      </div>
    </article>
  );
}

function List({ items }) {
  return (
    <ul>
      {items.map(([term, text]) => (
        <li key={term}>
          <b>{term}</b>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

function TalkSlide({ item: s }) {
  return (
    <article className={`slide p-slide ${s.kind}`}>
      {s.kind === 'stat' && <p className="big">{s.big}</p>}
      <p className="eyebrow">{s.eyebrow}</p>
      <h2>{s.title}</h2>
      {s.kind === 'title' && <p className="sub">{s.sub}</p>}
      {(s.kind === 'bullets' || s.kind === 'stat') && <List items={s.items} />}
      {s.kind === 'code' && <pre>{s.code}</pre>}
      {s.kind === 'end' && (
        <div>
          {s.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}
    </article>
  );
}

/* =====================================================================
   4) Deck — ตัวควบคุมสไลด์ ใช้ได้กับทุกชุดข้อมูล
   props: items (อาร์เรย์สไลด์), Slide (คอมโพเนนต์แสดง 1 สไลด์), thumbs (แสดงภาพย่อ), label
   ===================================================================== */

const svgProps = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };
const IconPrev = () => (<svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.4" {...svgProps}><path d="M15 5l-7 7 7 7" /></svg>);
const IconNext = () => (<svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.4" {...svgProps}><path d="M9 5l7 7-7 7" /></svg>);
const IconPlay = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z" /></svg>);
const IconPause = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>);
const IconFull = () => (<svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2.2" {...svgProps}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>);

const pad = (n) => String(n).padStart(2, '0');

function Deck({ items, Slide, thumbs = false, label }) {
  const last = items.length - 1;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stageRef = useRef(null);
  const startX = useRef(null);

  const go = useCallback((n) => setI(Math.max(0, Math.min(last, n))), [last]);
  const next = useCallback(() => setI((n) => Math.min(n + 1, last)), [last]);
  const prev = useCallback(() => setI((n) => Math.max(n - 1, 0)), []);

  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else stageRef.current?.requestFullscreen?.().catch(() => {});
  }, []);

  // เล่นอัตโนมัติ: ถึงสไลด์สุดท้ายแล้ววนกลับไปสไลด์แรก
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setI(i >= last ? 0 : i + 1), AUTO_MS);
    return () => clearTimeout(t);
  }, [playing, i, last]);

  // คีย์บอร์ด
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(last);
      else if (e.key === ' ' && tag !== 'BUTTON') { e.preventDefault(); setPlaying((v) => !v); }
      else if (e.key === 'f' || e.key === 'F') toggleFull();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, go, last, toggleFull]);

  // ปัดนิ้ว / ลากเมาส์
  const onDown = (e) => { startX.current = e.clientX; };
  const onUp = (e) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };

  return (
    <>
      <section
        className="stage"
        ref={stageRef}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => { startX.current = null; }}
        aria-roledescription="carousel"
        aria-label={label}
      >
        <div className="track" style={{ transform: `translateX(${-i * 100}%)` }}>
          {items.map((it, k) => (
            <div key={k} className="slide-wrap" aria-hidden={k !== i} role="group" aria-label={`${k + 1} / ${items.length}`}>
              <Slide item={it} />
            </div>
          ))}
        </div>

        <button className="arrow l" onClick={prev} disabled={i === 0} aria-label="สไลด์ก่อนหน้า"><IconPrev /></button>
        <button className="arrow r" onClick={next} disabled={i === last} aria-label="สไลด์ถัดไป"><IconNext /></button>

        <div className="progress" aria-hidden="true">
          <i
            key={`${i}-${playing}`}
            className={playing ? 'run' : ''}
            style={{
              '--dur': `${AUTO_MS / 1000}s`,
              transform: playing ? undefined : `scaleX(${(i + 1) / items.length})`,
              transition: playing ? 'none' : 'transform .5s',
            }}
          />
        </div>
      </section>

      <div className="bar">
        <div className="btns">
          <button className="btn" onClick={prev} disabled={i === 0} aria-label="ก่อนหน้า"><IconPrev /></button>
          <button className="btn" onClick={next} disabled={i === last} aria-label="ถัดไป"><IconNext /></button>
          <button className={`btn${playing ? ' on' : ''}`} onClick={() => setPlaying(!playing)} aria-pressed={playing}>
            {playing ? <IconPause /> : <IconPlay />}
            {playing ? 'หยุด' : 'เล่นอัตโนมัติ'}
          </button>
          <button className="btn" onClick={toggleFull} aria-label="เต็มจอ"><IconFull /></button>
        </div>
        <div className="dots">
          {items.map((_, k) => (
            <button key={k} className="dot" onClick={() => go(k)} aria-current={k === i} aria-label={`ไปสไลด์ที่ ${k + 1}`} />
          ))}
        </div>
        <span className="count">{pad(i + 1)} / {pad(items.length)}</span>
      </div>

      {thumbs && (
        <div className="thumbs">
          {items.map((it, k) => (
            <button key={it.id ?? k} className="thumb" style={tintVars(it)} onClick={() => go(k)} aria-current={k === i} aria-label={it.name}>
              <div className="tv"><ProductImage item={it} /></div>
              <span>{it.name}</span>
            </button>
          ))}
        </div>
      )}

      <p className="hint">
        คีย์ลัด <kbd>←</kbd> <kbd>→</kbd> เปลี่ยนสไลด์ · <kbd>Space</kbd> เล่น/หยุด · <kbd>F</kbd> เต็มจอ
      </p>
    </>
  );
}

/* =====================================================================
   5) App — สลับโหมดแกลเลอรี / งานนำเสนอ
   ===================================================================== */

export default function App() {
  const [mode, setMode] = useState('gallery');

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>React Slideshow</h1>
          <p>เลือกโหมดแกลเลอรีสินค้า หรือโหมดงานนำเสนอ ใช้คอมโพเนนต์ Deck ตัวเดียวกัน</p>
        </div>
        <div className="seg" role="group" aria-label="โหมดสไลด์">
          <button onClick={() => setMode('gallery')} aria-pressed={mode === 'gallery'}>แกลเลอรีสินค้า</button>
          <button onClick={() => setMode('present')} aria-pressed={mode === 'present'}>งานนำเสนอ</button>
        </div>
      </header>

      {/* key ทำให้สลับโหมดแล้วเริ่มที่สไลด์แรกใหม่ */}
      {mode === 'gallery' ? (
        <Deck key="gallery" items={PRODUCTS} Slide={ProductSlide} thumbs label="แกลเลอรีสินค้า" />
      ) : (
        <Deck key="present" items={TALK} Slide={TalkSlide} label="งานนำเสนอ" />
      )}
    </div>
  );
}
