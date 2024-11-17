import { useEffect } from 'react'
import './Layout.css'
import { parseJwt } from './utils'
import { ROLES_VIEW } from './constants'
import { useLocation, useNavigate } from 'react-router-dom'

export const Layout = ({ children, title }) => {
  useEffect(() => {
    document.title = title
  }, [title])

  const { pathname } = useLocation()
  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  const tokenData = token && parseJwt(token)

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
    location.reload()
  }

  return (
    <>
      <header className="app-header">
        {pathname !== '/login' && (tokenData 
          ? <>
            {tokenData.data.username} ({ROLES_VIEW[tokenData.data.role]})&nbsp;
            <button onClick={logout}>Выйти</button>
          </> 
          : <>
            {ROLES_VIEW.guest}&nbsp;
            <button onClick={() => navigate('/login')}>Войти</button>
          </>)}
      </header>
      <main>{children}</main>
      <footer />
    </>
  )
}
