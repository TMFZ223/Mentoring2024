const { initDbConnection } = require('./db/init.js');
const express = require('express');

const app = express();
app.use(express.json());

(async () => {
  const { RecipesModel } = await initDbConnection();

  app.post("/recipes", async (req, res) => {
    try {
      const recipe = await RecipesModel.create(req.body);
      res.json(recipe);
    } catch (err) {
      console.log(err);

      if (err?.name === 'SequelizeValidationError') {
        const errors = err.errors.map(({ message, type, path, value }) => ({ message, type, path, value }));
        res.status(400).json({ errors });
        return
      }

      res.status(500).json(err);
    }
  });

  app.get("/recipes", async (req, res) => {
    const { page = 0 } = req.query;
    const recipes = await RecipesModel.findAndCountAll({ limit: 10, offset: page * 10 });
    res.json(recipes);
  });

  app.listen(process.env.RECIPES_PORT, () => {
    console.log("Server is running on port 7000");
  });
})();
