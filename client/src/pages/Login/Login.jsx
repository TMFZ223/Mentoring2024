import { useState } from "react"
import { api } from "../../api"
import './login.css'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setLoadingState] = useState(false)
  const [error, setError] = useState('')

  const login = async () => {
    setLoadingState(true)

    try {
      setError('')
      const { data } = await api.post('/login', null, { params: { username, password } })
      localStorage.setItem('token', data.token)
      location.replace('/')
    } catch (e) {
      setError(e.response.data.message)
    } finally {
      setLoadingState(false)
    }
  }

  return <div className="login-container">
    <h2>Вход</h2>
    <p>Заполните данные для входа</p>
    <label>
      Логин:
      <input name="username" type="text" value={username} onChange={({ target }) => setUsername(target.value)} disabled={isLoading} />
    </label>
    <label>
      Пароль:
      <input name="password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} disabled={isLoading} />
    </label>
    <button type="submit" onClick={() => login()} disabled={isLoading}>{isLoading ? 'Вход...' : 'Войти'}</button>
    <p className="error">{error}</p>
  </div>
}