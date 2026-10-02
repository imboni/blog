import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'

type ScrollPosition = { left: number; top: number }
type PendingScroll = { path: string; finish: (ready: boolean) => void }
let homeScroll: ScrollPosition | null = null
let readyPath: string | null = null
let pendingScroll: PendingScroll | null = null

// The shell signals after the destination is inserted, before its first visible frame.
export function markRouteReady(path: string) {
  if (path !== router.currentRoute.value.fullPath) return
  readyPath = path
  if (pendingScroll?.path === path) pendingScroll.finish(true)
}

export function cancelRouteScroll() {
  pendingScroll?.finish(false)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: () => import('../views/Post.vue')
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import('../views/Board.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.fullPath !== router.currentRoute.value.fullPath) return false
    const position = savedPosition
      ?? (to.name === 'Home' && from.name === 'Post' && homeScroll
        ? { ...homeScroll }
        : { left: 0, top: 0 })

    if (readyPath === to.fullPath || to.path === from.path) return position

    cancelRouteScroll()
    return new Promise<ScrollPosition | false>((resolve) => {
      // Initial rendering, interrupted transitions, and zero-duration motion must settle too.
      const timeout = window.setTimeout(() => request.finish(true), 450)
      const request: PendingScroll = {
        path: to.fullPath,
        finish(ready) {
          window.clearTimeout(timeout)
          if (pendingScroll === request) pendingScroll = null
          resolve(ready && router.currentRoute.value.fullPath === to.fullPath ? position : false)
        },
      }
      pendingScroll = request
    })
  }
})

const removeScrollGuard = router.beforeEach((to, from) => {
  cancelRouteScroll()
  readyPath = null
  if (from.name === 'Home' && to.name !== 'Home') {
    homeScroll = { left: window.scrollX, top: window.scrollY }
  }
})

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    removeScrollGuard()
    cancelRouteScroll()
  })
}

export default router
