import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import service from '../../services/blueprintsService.js'

const API = "http://localhost:8080/api/blueprints"

/* AUTHORS */
export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async () => {
  const data = await service.getAll()
  const authors = [...new Set(data.map((bp) => bp.author))]
  return authors
})

/* BLUEPRINTS BY AUTHOR */
export const fetchByAuthor = createAsyncThunk(
  'blueprints/fetchByAuthor',
  async (author) => {

    await new Promise(r => setTimeout(r, 2000))

    const data = await service.getByAuthor(author)
    return { author, items: data }
  }
)

/* SINGLE BLUEPRINT */
export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }) => {
    const data = await service.getByAuthorAndName(author, name)
    return data
  },
)

/* CREATE */
export const createBlueprint = createAsyncThunk(
  'blueprints/createBlueprint',
  async (payload) => {
    const data = await service.create(payload)
    return data
  }
)

/* UPDATE */
export const updateBlueprint = createAsyncThunk(
  'blueprints/updateBlueprint',
  async ({ author, name, points }) => {
    await service.update(author, name, { points })
    return { author, name, points }
  }
)

/* DELETE */
export const deleteBlueprint = createAsyncThunk(
  'blueprints/deleteBlueprint',
  async ({ author, name }) => {
    await service.remove(author, name)
    return { author, name }
  }
)

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
  },

  reducers: {

    /* OPTIMISTIC DELETE */
    deleteBlueprintOptimistic: (s, a) => {
      const { author, name } = a.payload

      if (!s.byAuthor[author]) return

      s.byAuthor[author] =
        s.byAuthor[author].filter(bp => bp.name !== name)
    },

    /* OPTIMISTIC UPDATE */
    updateBlueprintOptimistic: (s, a) => {
      const { author, name, points } = a.payload

      const bp = s.byAuthor[author]?.find(b => b.name === name)

      if (bp) {
        bp.points = points
      }

      if (s.current && s.current.author === author && s.current.name === name) {
        s.current.points = points
      }
    }

  },

  extraReducers: (builder) => {
    builder

      // AUTHORS
      .addCase(fetchAuthors.pending, (s) => {
        s.loading.authors = true
        s.error.authors = null
      })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.loading.authors = false
        s.authors = a.payload
      })
      .addCase(fetchAuthors.rejected, (s, a) => {
        s.loading.authors = false
        s.error.authors = a.error.message
      })

      // BLUEPRINTS BY AUTHOR
      .addCase(fetchByAuthor.pending, (s) => {
        s.loading.blueprints = true
        s.error.blueprints = null
      })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.loading.blueprints = false
        s.byAuthor[a.payload.author] = a.payload.items
      })
      .addCase(fetchByAuthor.rejected, (s, a) => {
        s.loading.blueprints = false
        s.error.blueprints = a.error.message
      })

      // SINGLE BLUEPRINT
      .addCase(fetchBlueprint.pending, (s) => {
        s.loading.blueprint = true
        s.error.blueprint = null
      })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.loading.blueprint = false
        s.current = a.payload
      })
      .addCase(fetchBlueprint.rejected, (s, a) => {
        s.loading.blueprint = false
        s.error.blueprint = a.error.message
      })

      // CREATE
      .addCase(createBlueprint.fulfilled, (s, a) => {
        const bp = a.payload

        if (!s.byAuthor[bp.author]) {
          s.byAuthor[bp.author] = []
        }

        s.byAuthor[bp.author].push(bp)
      })

      // UPDATE
      .addCase(updateBlueprint.fulfilled, (s, a) => {
        const { author, name, points } = a.payload

        const bp = s.byAuthor[author]?.find(b => b.name === name)

        if (bp) {
          bp.points = points
        }

        if (s.current && s.current.author === author && s.current.name === name) {
          s.current.points = points
        }
      })

      // DELETE
      .addCase(deleteBlueprint.fulfilled, (s, a) => {
        const { author, name } = a.payload

        if (!s.byAuthor[author]) return

        s.byAuthor[author] =
          s.byAuthor[author].filter(bp => bp.name !== name)
      })
  },
})

export const {
  deleteBlueprintOptimistic,
  updateBlueprintOptimistic
} = slice.actions

export default slice.reducer