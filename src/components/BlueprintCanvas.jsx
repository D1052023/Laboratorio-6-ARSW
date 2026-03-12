import { useEffect, useRef, useState } from 'react'

export default function BlueprintCanvas({
  points = [],
  width = 520,
  height = 360,
  onSave
}) {

  const ref = useRef(null)

  const [mousePos, setMousePos] = useState(null)
  const [localPoints, setLocalPoints] = useState(points)

  // sincronizar cuando cambie el blueprint
  useEffect(() => {
    setLocalPoints(points)
  }, [points])

  // dibujar canvas
  useEffect(() => {

    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

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

    // líneas
    if (localPoints.length > 1) {

      ctx.strokeStyle = '#60a5fa'
      ctx.lineWidth = 2

      ctx.beginPath()
      ctx.moveTo(localPoints[0].x, localPoints[0].y)

      for (let i = 1; i < localPoints.length; i++) {
        ctx.lineTo(localPoints[i].x, localPoints[i].y)
      }

      ctx.stroke()
    }

    // puntos
    ctx.fillStyle = '#fbbf24'

    for (const p of localPoints) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
      ctx.fill()
    }

  }, [localPoints])

  // agregar punto con click
  const handleClick = (e) => {

    const canvas = ref.current
    const rect = canvas.getBoundingClientRect()

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = Math.round((e.clientX - rect.left) * scaleX)
    const y = Math.round((e.clientY - rect.top) * scaleY)

    setLocalPoints((prev) => [...prev, { x, y }])
  }

  const handleMove = (e) => {

    const canvas = ref.current
    const rect = canvas.getBoundingClientRect()

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = Math.round((e.clientX - rect.left) * scaleX)
    const y = Math.round((e.clientY - rect.top) * scaleY)

    setMousePos({ x, y })
  }

  const handleSave = () => {

    if (!onSave) return

    onSave(localPoints)
  }

  const handleClear = () => {
    setLocalPoints([])
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
          cursor: 'crosshair',
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

      {/* botones */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '10px'
        }}
      >

        <button
          className="btn btn-success btn-sm"
          onClick={handleSave}
        >
          Guardar Blueprint
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={handleClear}
        >
          Limpiar
        </button>

      </div>

    </div>
  )
}