const { DataTypes, UUIDV4 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('videogame', {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    released: {
      type: DataTypes.DATEONLY,      
    },
    rating: {
      type: DataTypes.FLOAT,    
    },
    platforms: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const value = this.getDataValue('platforms');
        return value.split(",");
      }
    },
    
  }, {
    timestamps: false,
   });
};
