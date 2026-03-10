import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAuthors,
  fetchByAuthor,
  fetchBlueprint,
} from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const { byAuthor, current, status } = useSelector((s) => s.blueprints)

  const [authorInput, setAuthorInput] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')

  const items = byAuthor[selectedAuthor] || []

  // ✅ SOLO CONSULTAR SI EXISTE TOKEN
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      dispatch(fetchAuthors())
    }
  }, [dispatch])

  const totalPoints = useMemo(
    () => items.reduce((acc, bp) => acc + (bp.points?.length || 0), 0),
    [items],
  )

  const getBlueprints = () => {
    if (!authorInput) return

    const token = localStorage.getItem('token')
    if (!token) return

    setSelectedAuthor(authorInput)
    dispatch(fetchByAuthor(authorInput))
  }

  const openBlueprint = (bp) => {
    const token = localStorage.getItem('token')
    if (!token) return

    dispatch(fetchBlueprint({ author: bp.author, name: bp.name }))
  }

  return (
    <div className="container-fluid">
      <div className="row g-4">
        
        {/* LEFT SIDE */}
        <div className="col-md-5">
          
          {/* SEARCH CARD */}
          <div className="card p-3 mb-3">
            <h4 className="mb-3">Blueprints</h4>

            <div className="d-flex gap-2">
              <input
                className="form-control input"
                placeholder="Author"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
              />

              <button className="btn btn-primary" onClick={getBlueprints}>
                Get blueprints
              </button>
            </div>
          </div>

          {/* RESULTS CARD */}
          <div className="card p-3">
            <h5 className="mb-3">
              {selectedAuthor ? `${selectedAuthor}'s blueprints` : 'Results'}
            </h5>

            {status === 'loading' && <p>Cargando...</p>}

            {!items.length && status !== 'loading' && (
              <p className="no-results">No results</p>
            )}

            {!!items.length && (
              <div className="table-responsive">
                <table className="table table-dark table-striped table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Blueprint name</th>
                      <th className="text-end">Points</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((bp) => (
                      <tr key={bp.name}>
                        <td>{bp.name}</td>

                        <td className="text-end">
                          <span className="badge bg-info">
                            {bp.points?.length || 0}
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => openBlueprint(bp)}
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-3 fw-bold">
              <p>
                <span className="label">Total user points</span>:{' '}
                <span className="points">{totalPoints}</span>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-7">
          <div className="card p-3">
            <h5 className="mb-3">
              Current blueprint: {current?.name || '—'}
            </h5>

            <BlueprintCanvas points={current?.points || []} />
          </div>
        </div>

      </div>
    </div>
  )
}