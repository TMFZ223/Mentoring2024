import axios from "axios"
import { useEffect, useState } from "react"
import './recipes.css'

export const Recipes = () => {
  const [pageData, setPageData] = useState({count: 0, rows: []})
  const [pageNumber, setPageNumber] = useState(0)
  const [isLoading, setLoadingState] = useState(false)

  const pagesCount = Math.ceil(pageData.count / 10)

  useEffect(() => {
    setLoadingState(true)

    const getData = async () => {
      try {
        const { data } = await axios(import.meta.env.VITE_RECIPES_URL, { 
          params: {
            page: pageNumber
          },
          headers: {
            'Access-Control-Allow-Origin': null
          }
        })

        setPageData(data)
      } catch (error) {
        console.error(error)
        alert(error)
      } finally {
        setLoadingState(false)
      }
    }

    getData()
  }, [pageNumber])


  return <>
    <h1>Рецепты</h1>
    <header className="recipes-page__header">
      <button
        title="Предыдущая страница"
        onClick={() => setPageNumber(page => page - 1)}
        disabled={pageNumber < 1}
      >
        {'<-'}
      </button>&nbsp;
      Страница {pageNumber + 1} из {pagesCount}&nbsp;
      <button
        title="Следующая страница"
        onClick={() => setPageNumber(page => page + 1)}
        disabled={pageNumber + 1 >= pagesCount}
      >
        {'->'}
      </button>
    </header>
    <section className="recipe-list">
      {!isLoading && pageData.rows.map((recipe) => (
        <article className="recipe-list__item" key={recipe.id}>
          <img className="recipe-list__item-image" src={recipe.image || '/meal.png'} alt={recipe.name} width={300} height={300} />
          <h2 className="recipe-list__item-title">{recipe.name}</h2>
          <p>{recipe.description}</p>
        </article>
      ))}
      {isLoading && <p>Загрузка...</p>}
    </section>
  </>
}