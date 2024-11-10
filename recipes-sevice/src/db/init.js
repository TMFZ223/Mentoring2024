const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports.initDbConnection = async () => {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: 'postgres_db'
  })

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  class RecipesModel extends Model {}

  RecipesModel.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ingredients: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    instructions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, 
  {sequelize}
);

  await RecipesModel.sync();

  return { RecipesModel };
};
