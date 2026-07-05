export default function Card({ children, style }) {
  return <div style={{ background: 'var(--card)', borderRadius: 12, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', ...style }}>{children}</div>
}
