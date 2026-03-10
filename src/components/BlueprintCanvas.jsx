import { useEffect, useRef, useState } from 'react'

export default function BlueprintCanvas({ points = [], width = 520, height = 360, onAddPoint }) {
  const ref = useRef(null)
  const [mousePos, setMousePos] = useState(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    // limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // fondo
    ctx.fillStyle = '#0b1220'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // GRID
    ctx.strokeStyle = 'rgba(148,163,184,0.12)'
    ctx.lineWidth = 1

    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // líneas del blueprint
    if (points.length > 1) {
      ctx.strokeStyle = '#60a5fa'
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }

      // cerrar figura
      ctx.lineTo(points[0].x, points[0].y)

      ctx.stroke()
    }

    // puntos
    ctx.fillStyle = '#fbbf24'

    for (const p of points) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [points])

  const handleClick = (e) => {
    if (!onAddPoint) return

    const rect = ref.current.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    onAddPoint({ x, y })
  }

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()

    const x = Math.round(e.clientX - rect.left)
    const y = Math.round(e.clientY - rect.top)

    setMousePos({ x, y })
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <canvas
        ref={ref}
        width={width}
        height={height}
        onClick={handleClick}
        onMouseMove={handleMove}
        style={{
          background: '#0b1220',
          border: '1px solid #334155',
          borderRadius: '12px',
          width: '100%',
          maxWidth: width,
          marginTop: '10px',
          cursor: onAddPoint ? 'crosshair' : 'default',
          boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
        }}
      />

      {mousePos && (
        <div
          style={{
            position: 'absolute',
            bottom: 6,
            right: 10,
            fontSize: '12px',
            color: '#94a3b8',
          }}
        >
          {mousePos.x}, {mousePos.y}
        </div>
      )}
    </div>
  )
}
