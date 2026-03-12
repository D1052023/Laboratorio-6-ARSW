import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchAuthors,
  fetchByAuthor,
  fetchBlueprint,
  deleteBlueprint,
  deleteBlueprintOptimistic,
  updateBlueprint,
  updateBlueprintOptimistic
} from '../features/blueprints/blueprintsSlice.js'

import BlueprintCanvas from '../components/BlueprintCanvas.jsx'
import { selectTopBlueprints } from '../features/blueprints/selectors'

export default function BlueprintsPage() {

  const dispatch = useDispatch()

  const { byAuthor, current, loading, error } = useSelector((s) => s.blueprints)

  const topBlueprints = useSelector(selectTopBlueprints)

  const [authorInput, setAuthorInput] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')

  const [showAddModal, setShowAddModal] = useState(false)
  const [xCoord, setXCoord] = useState('')
  const [yCoord, setYCoord] = useState('')

  const items = byAuthor[selectedAuthor] || []

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

  /* DELETE */
  const handleDelete = (author, name) => {

    if (!confirm("Delete this blueprint?")) return

    dispatch(deleteBlueprintOptimistic({ author, name }))

    dispatch(deleteBlueprint({ author, name }))
      .unwrap()
      .catch(() => {

        alert("Error deleting blueprint")

        dispatch(fetchByAuthor(author))
      })
  }

  /* ADD RANDOM POINT */
  const handleAddRandomPoint = () => {

    if (!current) return

    const newPoint = {
      x: Math.floor(Math.random() * 200),
      y: Math.floor(Math.random() * 200)
    }

    const updatedPoints = [...(current.points || []), newPoint]

    dispatch(updateBlueprintOptimistic({
      author: current.author,
      name: current.name,
      points: updatedPoints
    }))

    dispatch(updateBlueprint({
      author: current.author,
      name: current.name,
      points: updatedPoints
    }))
      .unwrap()
      .catch(() => {

        alert("Error updating blueprint")

        dispatch(fetchBlueprint({
          author: current.author,
          name: current.name
        }))
      })
  }

  /* ADD POINT MANUAL */
  const handleAddPointManual = () => {

    if (!current) return

    const x = Number(xCoord)
    const y = Number(yCoord)

    if (isNaN(x) || isNaN(y)) {
      alert("Invalid coordinates")
      return
    }

    const newPoint = { x, y }

    const updatedPoints = [...(current.points || []), newPoint]

    dispatch(updateBlueprintOptimistic({
      author: current.author,
      name: current.name,
      points: updatedPoints
    }))

    dispatch(updateBlueprint({
      author: current.author,
      name: current.name,
      points: updatedPoints
    }))
      .unwrap()
      .catch(() => {

        alert("Error updating blueprint")

        dispatch(fetchBlueprint({
          author: current.author,
          name: current.name
        }))
      })

    setShowAddModal(false)
    setXCoord('')
    setYCoord('')
  }

  return (
    <div className="container-fluid">

      <div className="row g-4">

        {/* LEFT SIDE */}
        <div className="col-md-5">

          {/* SEARCH */}
          <div className="card p-3 mb-3">

            <h4 className="mb-3">Blueprints</h4>

            <div className="d-flex gap-2">

              <input
                className="form-control"
                placeholder="Author"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
              />

              <button
                className="btn btn-primary"
                onClick={getBlueprints}
              >
                Get blueprints
              </button>

            </div>
          </div>

          {/* RESULTS */}
          <div className="card p-3">

            <h5 className="mb-3">
              {selectedAuthor ? `${selectedAuthor}'s blueprints` : 'Results'}
            </h5>

            {loading.blueprints && <p>Cargando blueprints...</p>}

            {error.blueprints && (
              <div className="alert alert-danger">
                {error.blueprints}
              </div>
            )}

            {!items.length && !loading.blueprints && (
              <p>No results</p>
            )}

            {!!items.length && (

              <div className="table-responsive">

                <table className="table table-dark table-striped table-hover">

                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="text-end">Points</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {items.map((bp) => (

                      <tr key={`${bp.author}-${bp.name}`}>

                        <td>{bp.name}</td>

                        <td className="text-end">

                          <span className="badge bg-info">
                            {bp.points?.length || 0}
                          </span>

                        </td>

                        <td>

                          <div className="d-flex gap-2 justify-content-center">

                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => openBlueprint(bp)}
                              title="Open"
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => setShowAddModal(true)}
                              title="Add point"
                            >
                              <i className="bi bi-plus-circle"></i>
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(bp.author, bp.name)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

            <div className="mt-3 fw-bold">
              Total user points: {totalPoints}
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

            <div className="mt-3">

              <button
                className="btn btn-success"
                onClick={handleAddRandomPoint}
                disabled={!current}
              >
                Add Random Point
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* TOP 5 */}
      <div className="mt-4">

        <h5>Top 5 blueprints</h5>

        <ul className="list-group">

          {topBlueprints.map((bp) => (

            <li
              key={`${bp.author}-${bp.name}`}
              className="list-group-item d-flex justify-content-between"
            >

              {bp.name}

              <span className="badge bg-primary">
                {bp.points?.length || 0}
              </span>

            </li>

          ))}

        </ul>

      </div>

      {/* MODAL */}
      {showAddModal && (

        <div className="modal fade show d-block">

          <div className="modal-dialog">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">Add Point</h5>

                <button
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                />

              </div>

              <div className="modal-body">

                <div className="mb-3">

                  <label>X Coordinate</label>

                  <input
                    type="number"
                    className="form-control"
                    value={xCoord}
                    onChange={(e) => setXCoord(e.target.value)}
                  />

                </div>

                <div className="mb-3">

                  <label>Y Coordinate</label>

                  <input
                    type="number"
                    className="form-control"
                    value={yCoord}
                    onChange={(e) => setYCoord(e.target.value)}
                  />

                </div>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleAddPointManual}
                >
                  Add Point
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}