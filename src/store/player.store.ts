import { DetailedEpisode } from '@/types/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PlayerState {
  episode: DetailedEpisode | null
  isPlaying: boolean
  time: number
}

const initialState: PlayerState = {
  episode: null,
  isPlaying: false,
  time: 0
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    reproduce(state, { payload: episode }: PayloadAction<DetailedEpisode | null>) {
      state.episode = episode
      return state
    },
    stop(state) {
      state.isPlaying = false
      state.episode = null
      return state
    },
    play(state) {
      state.isPlaying = true
      return state
    },
    pause(state) {
      state.isPlaying = false
      return state
    },
    setTime(state, { payload: newTime }: PayloadAction<number>) {
      state.time = newTime
      return state
    }
  }
})

export const { reproduce, play, pause, setTime, stop } = playerSlice.actions
