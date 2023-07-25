import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { routes } from './config/routes'
import { Loading } from './components/Loading'

const Router = () => {
  const appRoutes = routes.map((item) => {
    return <Route key={item.path} path={item.path} element={<item.component />} />
  })
  return (
    <Suspense fallback={<Loading />}>
      <Routes>{appRoutes}</Routes>
    </Suspense>
  )
}

export default Router
