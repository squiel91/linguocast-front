import { configureStore } from '@reduxjs/toolkit'
import { playerSlice } from './player.store'

const store = configureStore({
  reducer: {
    player: playerSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store