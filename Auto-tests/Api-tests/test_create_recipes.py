import pytest
import requests
import allure
@allure.epic('Создание рецептов')
class TestCreateRecipes:
    endpoynt = 'http://host.docker.internal:7000/recipes'
    recipe_data = {"name": "TVxJtV", "description": "yACKCMRAOZWwWZEtEKHRBNdnuwYUGO", "ingredients": ["test", "test1", "test2"], "instructions": ["test3", "test4"]}
    @allure.description('Позетивный тест создания рецепта')
    def test_positive_create_recipe(self):
        with allure.step(f'Отправить post запрос на эндпойнт {self.endpoynt} с телом в формате Json: {self.recipe_data}'):
            response_after_create_recipe = requests.post(self.endpoynt, json = self.recipe_data)
        new_recipe = response_after_create_recipe.json()
        with allure.step('Убедиться, что приходит ответ со статус кодом 200. В ответе содержится поле ID.'):
            assert response_after_create_recipe.status_code == 200, f'unexpected status code! Actual status code is {response_after_create_recipe.status_code}'
            assert 'id' in new_recipe, 'there field not found'
    # Создание рецепта без указания одного из полей
    @pytest.mark.parametrize('field', ['name', 'description', 'ingredients', 'instructions'])
    @allure.description('Создание рецепта без указания одного из полей')
    def test_create_recipe_missing_field(self, field):
        with allure.step(f'Пропустить поле {field}'):
            self.recipe_data.pop(field)
        with allure.step(f'Отправить post запрос на эндпойнт self.endpoynt с телом в формате Json: {self.recipe_data}'):
            response_after_create_recipe = requests.post(self.endpoynt, json = self.recipe_data)
        response_after_create_recipe_dict = response_after_create_recipe.json()
        expected_message = f"RecipesModel.{field} cannot be null"
        actual_messages = [error['message'] for error in response_after_create_recipe_dict['errors']]
        with allure.step(f'Убедиться в том, что ответ приходит со статус кодом 400. В ответе содержится сообщение: {expected_message}'):
            assert response_after_create_recipe.status_code == 400, f'Unexpected status code! Actual status code is {response_after_create_recipe.status_code}'
            assert expected_message in actual_messages, f'Expected message {expected_message} not found in errors: {actual_messages}'