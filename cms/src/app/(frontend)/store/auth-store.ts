import { createStore, useStoreState, useStoreValue } from 'zustand-x';
const isProd = process.env.NODE_ENV === 'production'

type State = {
  isAuth: boolean
  jwt: string
}

const defaultAuth: State = {
  isAuth: false,
  jwt: '',
}

export const authStore = createStore(
  {
    ...defaultAuth,
  },
  {
    name: 'authStore',
    devtools: {
      enabled: !isProd, // Truyền false khi build production
    },
  }
).extendActions(({ set }) => ({
  reset: () => set('state', {...defaultAuth}),
}));