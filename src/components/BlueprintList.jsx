export default function BlueprintList({ items = [], onSelect }) {
  if (!items.length) return <p>No hay blueprints para este autor.</p>

  return (
    <table className="card" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: '8px' }}>Nombre del plano</th>
          <th style={{ textAlign: 'left', padding: '8px' }}>Número de puntos</th>
          <th style={{ textAlign: 'left', padding: '8px' }}>Open</th>
        </tr>
      </thead>

      <tbody>
        {items.map((bp) => (
          <tr key={bp.name}>
            <td style={{ padding: '8px' }}>{bp.name}</td>

            <td style={{ padding: '8px' }}>{bp.points ? bp.points.length : 0}</td>

            <td style={{ padding: '8px' }}>
              <button className="btn primary" onClick={() => onSelect(bp)}>
                Open
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
