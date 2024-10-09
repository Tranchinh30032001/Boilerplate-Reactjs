import { lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const MainLayout = lazy(() => import('./layouts/MainLayout'))

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          {/* {userRouter.map((route, index) => (
            <Route
              key={index}
              index
              path={route.path}
              element={route.component}
            />
          ))} */}
        </Route>
        {/* <Route path='/' element={<Dashboard />}>
          {adminRouter.map((route, index) => (
            <Route
              key={index}
              index
              path={route.path}
              element={route.component}
            />
          ))}
        </Route> */}
      </Routes>
    </Router>
  )
}

export default App
