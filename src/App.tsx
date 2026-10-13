import { useEffect, useState } from 'react'
import { ToastProvider } from './components/ui/Toast'
import { Background } from './components/background/Background'
import { Header } from './components/layout/Header'
import { Home } from './pages/Home'
import { Privacy } from './pages/Privacy'
import { initSmoothScroll } from './lib/scroll'
import { pauseWhenHidden } from './lib/motion'
import { initAnalytics } from './lib/analytics'
import { CookieBanner } from './components/layout/CookieBanner'

type Route = 'home' | 'privacy'

const routeFromPath = (path: string): Route => (path.replace(/\/+$/, '') === '/privacy' ? 'privacy' : 'home')

export default function App() {
  const [route, setRoute] = useState<Route>(() => routeFromPath(window.location.pathname))

  useEffect(() => {
    const stopScroll = initSmoothScroll()
    initAnalytics()
    const stop = pauseWhenHidden()
    const onPop = () => setRoute(routeFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => {
      stop()
      stopScroll()
      window.removeEventListener('popstate', onPop)
    }
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setRoute(routeFromPath(path))
    window.scrollTo(0, 0)
  }

  return (
    <ToastProvider>
      <Background />
      <Header />
      {route === 'home' ? <Home navigate={navigate} /> : <Privacy navigate={navigate} />}
      <CookieBanner />
    </ToastProvider>
  )
}
