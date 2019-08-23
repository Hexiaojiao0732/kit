import React from 'react'
import mergeRoute from 'components/mergeRoutes'
const Main = React.lazy(() => import('./main'))
export default mergeRoute([
  {
    path: '/main',
    tmpl: Main
  }
])
