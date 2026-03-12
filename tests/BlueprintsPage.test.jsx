import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import BlueprintsPage from '../src/pages/BlueprintsPage.jsx'

/* MOCK ACTIONS */
vi.mock('../src/features/blueprints/blueprintsSlice.js', () => ({
  fetchAuthors: () => ({ type: 'blueprints/fetchAuthors' }),
  fetchByAuthor: (author) => ({ type: 'blueprints/fetchByAuthor', payload: author }),
  fetchBlueprint: (payload) => ({ type: 'blueprints/fetchBlueprint', payload }),
  deleteBlueprint: () => ({ type: 'blueprints/deleteBlueprint' }),
  deleteBlueprintOptimistic: () => ({ type: 'blueprints/deleteBlueprintOptimistic' }),
  updateBlueprint: () => ({ type: 'blueprints/updateBlueprint' }),
  updateBlueprintOptimistic: () => ({ type: 'blueprints/updateBlueprintOptimistic' }),
}))

/* MOCK SELECTOR */
vi.mock('../src/features/blueprints/selectors', () => ({
  selectTopBlueprints: () => []
}))

/* MOCK CANVAS */
vi.mock('../src/components/BlueprintCanvas.jsx', () => ({
  default: () => <div data-testid="canvas">Canvas</div>
}))

function makeStore(preloaded) {
  const slice = createSlice({
    name: 'blueprints',
    initialState: {
      authors: [],
      byAuthor: {},
      current: null,

      loading: {
        authors: false,
        blueprints: false,
        blueprint: false,
      },

      error: {
        authors: null,
        blueprints: null,
        blueprint: null,
      },

      ...preloaded,
    },
    reducers: {},
  })

  return configureStore({
    reducer: { blueprints: slice.reducer },
  })
}

describe('BlueprintsPage', () => {

  /* simular usuario logueado */
  beforeEach(() => {
    localStorage.setItem('token', 'fake-jwt-token')
  })

  it('despacha fetchByAuthor al hacer click', () => {

    const store = makeStore()

    const spy = vi.spyOn(store, 'dispatch')

    render(
      <Provider store={store}>
        <BlueprintsPage />
      </Provider>,
    )

    fireEvent.change(screen.getByPlaceholderText(/Author/i), {
      target: { value: 'JohnConnor' },
    })

    fireEvent.click(screen.getByText(/Get blueprints/i))

    expect(spy).toHaveBeenCalledWith({
      type: 'blueprints/fetchByAuthor',
      payload: 'JohnConnor',
    })
  })

})