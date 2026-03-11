import { createSelector } from '@reduxjs/toolkit'

const selectBlueprintsState = (state) => state.blueprints
export const selectAllBlueprints = createSelector(
  [selectBlueprintsState],
  (blueprintsState) => {

    const all = Object.values(blueprintsState.byAuthor)

    return all.flat()
  }
)
export const selectTopBlueprints = createSelector(
  [selectAllBlueprints],
  (blueprints) => {

    return [...blueprints]
      .sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0))
      .slice(0, 5)
  }
)