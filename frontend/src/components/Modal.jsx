export default function Modal({ title, onClose, children }) {
  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={e => e.stopPropagation()}>
        <div style={header}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
const overlay = { position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'1rem' }
const box = { background:'#fff',borderRadius:16,padding:'1.5rem',width:'100%',maxWidth:480,maxHeight:'90vh',overflowY:'auto' }
const header = { display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem' }
const closeBtn = { background:'none',border:'none',fontSize:'1.2rem',cursor:'pointer',color:'var(--muted)' }
