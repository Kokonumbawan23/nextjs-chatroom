import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize('chatapp','root',null,{
    dialect: 'mysql'
});

const Room = sequelize.define('Room',{
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userCapacity: {
        type: DataTypes.INTEGER,
        defaultValue: 8
    },
    userConnected: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE
    },   
},{
    tableName: 'room'
},);

export default Room;