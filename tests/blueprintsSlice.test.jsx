import { describe, it, expect } from 'vitest'
import reducer from '../src/features/blueprints/blueprintsSlice.js'

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

})