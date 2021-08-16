'use strict';
// 외래키 추가하기 
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("social_logins", "user_id", {
      type: Sequelize.INTEGER,
      references:{
        model:{
          tableName:'users'
        },
        key:'id'
      },
      allowNull:false,
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("social_logins", "user_id");
  }
};
