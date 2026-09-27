import { Outlet } from 'react-router-dom'

import Header from '../../components/Header/Header'

function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default PublicLayout