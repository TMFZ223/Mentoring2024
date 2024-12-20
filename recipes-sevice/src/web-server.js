const { initDbConnection } = require('./db/init.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

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
    const recipes = await RecipesModel.findAndCountAll({ limit: 10, offset: page * 10, order: [['name', 'ASC']] });
    res.json(recipes);
  });

  app.listen(process.env.RECIPES_PORT, () => {
    console.log(`Server is running on port ${process.env.RECIPES_PORT}`);
  });
})();
