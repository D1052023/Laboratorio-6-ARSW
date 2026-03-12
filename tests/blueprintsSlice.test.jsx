import { describe, it, expect } from 'vitest'
import reducer, {
  updateBlueprintOptimistic,
  deleteBlueprintOptimistic,
  fetchAuthors,
  fetchByAuthor,
  fetchBlueprint,
  createBlueprint,
  updateBlueprint,
  deleteBlueprint
} from '../src/features/blueprints/blueprintsSlice.js'

describe('blueprints slice', () => {

  it('should initialize correctly', () => {
    const state = reducer(undefined, { type: '@@INIT' })

    expect(state.authors).toEqual([])
    expect(state.byAuthor).toEqual({})
    expect(state.current).toBeNull()

    expect(state.loading).toEqual({
      authors: false,
      blueprints: false,
      blueprint: false,
    })

    expect(state.error).toEqual({
      authors: null,
      blueprints: null,
      blueprint: null,
    })
  })

  it('should update blueprint points optimistically', () => {

    const initialState = {
      authors: [],
      byAuthor: {
        john: [
          { name: 'house', author: 'john', points: [{ x: 1, y: 2 }] }
        ]
      },
      current: null,
      loading: {},
      error: {},
    }

    const action = updateBlueprintOptimistic({
      author: 'john',
      name: 'house',
      points: [{ x: 5, y: 6 }]
    })

    const state = reducer(initialState, action)

    expect(state.byAuthor.john[0].points).toEqual([{ x: 5, y: 6 }])
  })

  it('should delete blueprint optimistically', () => {

    const initialState = {
      authors: [],
      byAuthor: {
        john: [
          { name: 'house', author: 'john', points: [] },
          { name: 'tree', author: 'john', points: [] }
        ]
      },
      current: null,
      loading: {},
      error: {},
    }

    const action = deleteBlueprintOptimistic({
      author: 'john',
      name: 'house'
    })

    const state = reducer(initialState, action)

    expect(state.byAuthor.john.length).toBe(1)
    expect(state.byAuthor.john[0].name).toBe('tree')
  })

  it('should handle fetchAuthors fulfilled', () => {

    const initialState = reducer(undefined, { type: '@@INIT' })

    const action = {
      type: fetchAuthors.fulfilled.type,
      payload: ['john', 'maria']
    }

    const state = reducer(initialState, action)

    expect(state.loading.authors).toBe(false)
    expect(state.authors).toEqual(['john', 'maria'])
  })

  it('should handle fetchByAuthor fulfilled', () => {

    const initialState = reducer(undefined, { type: '@@INIT' })

    const action = {
      type: fetchByAuthor.fulfilled.type,
      payload: {
        author: 'john',
        items: [{ name: 'house', author: 'john', points: [] }]
      }
    }

    const state = reducer(initialState, action)

    expect(state.byAuthor.john.length).toBe(1)
  })

  it('should handle fetchBlueprint fulfilled', () => {

    const initialState = reducer(undefined, { type: '@@INIT' })

    const blueprint = {
      name: 'house',
      author: 'john',
      points: []
    }

    const action = {
      type: fetchBlueprint.fulfilled.type,
      payload: blueprint
    }

    const state = reducer(initialState, action)

    expect(state.current).toEqual(blueprint)
  })

  it('should handle createBlueprint fulfilled', () => {

    const initialState = reducer(undefined, { type: '@@INIT' })

    const blueprint = {
      name: 'house',
      author: 'john',
      points: []
    }

    const action = {
      type: createBlueprint.fulfilled.type,
      payload: blueprint
    }

    const state = reducer(initialState, action)

    expect(state.byAuthor.john.length).toBe(1)
    expect(state.byAuthor.john[0].name).toBe('house')
  })

  it('should handle updateBlueprint fulfilled', () => {

    const initialState = {
      authors: [],
      byAuthor: {
        john: [{ name: 'house', author: 'john', points: [{ x: 1, y: 2 }] }]
      },
      current: null,
      loading: {},
      error: {}
    }

    const action = {
      type: updateBlueprint.fulfilled.type,
      payload: {
        author: 'john',
        name: 'house',
        points: [{ x: 9, y: 9 }]
      }
    }

    const state = reducer(initialState, action)

    expect(state.byAuthor.john[0].points).toEqual([{ x: 9, y: 9 }])
  })

  it('should handle deleteBlueprint fulfilled', () => {

    const initialState = {
      authors: [],
      byAuthor: {
        john: [
          { name: 'house', author: 'john', points: [] },
          { name: 'tree', author: 'john', points: [] }
        ]
      },
      current: null,
      loading: {},
      error: {}
    }

    const action = {
      type: deleteBlueprint.fulfilled.type,
      payload: {
        author: 'john',
        name: 'house'
      }
    }

    const state = reducer(initialState, action)

    expect(state.byAuthor.john.length).toBe(1)
    expect(state.byAuthor.john[0].name).toBe('tree')
  })

})