import pytest
import requests
import allure
@allure.epic('Просмотр рецептов')
class TestWiewRecipes:
    pages = [(0), (1), (2)]
    endpoynt = 'http://host.docker.internal:7000/recipes'
    @allure.description('Просмотр рецептов без указания страницы')
    def test_wiew_recipes_without_page(self):
        with allure.step(f'отправить get запрос на эндпойнт {self.endpoynt}'):
            response = requests.get(self.endpoynt)
        recipes_list = response.json()
        recipe_fields = ["id", "name", "description", "ingredients", "instructions", "image"]
        with allure.step('убедиться в том, что в списке рецептов 10 об\ектов'):
            assert len(recipes_list["rows"]) == 10, f"Unexpected len list! the len of this list: {len(recipes_list['rows'])}"
        with allure.step(f'Убедиться в том, что в теле ответа присутствуют следующие поля: {recipe_fields}'):
            for row in recipes_list["rows"]:
                for recipe_field in recipe_fields:
                    assert recipe_field in row, f"{recipe_field} not found in row: {row}"
    @pytest.mark.parametrize('page', pages)
    @allure.description('Просмотр рецептов с указанием страницы')
    def test_with_page(self, page):
        query_params = {"page": page}
        with allure.step(f'Отправить get запрос на эндпойнт {self.endpoynt}. В квери параметрах указать следующие параметры: {query_params}'):
            response = requests.get(self.endpoynt, params = query_params)
        recipes_list = response.json()
        if page == 0:
            expected_len = 10
        elif page == 1:
            expected_len = 6
        else:
            expected_len = 0
        actual_len = len(recipes_list['rows'])
        with allure.step(f'Проверить, что в теле ответа возвращаются {expected_len} об\ектов'):
            assert actual_len == expected_len, f"actual len: {actual_len}, but expected len: {expected_len}"