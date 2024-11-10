import { useEffect } from 'react'
import './Layout.css'

export const Layout = ({ children, title }) => {
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <>
      <header />
      <main>{children}</main>
      <footer />
    </>
  )
}
