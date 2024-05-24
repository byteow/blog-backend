import sequelize from '../db';
import { DataTypes } from 'sequelize';

export const Post = sequelize.define('post', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, unique: true, primaryKey: true },
    authorId: { type: DataTypes.INTEGER },
    title: { type: DataTypes.STRING },
    body: { type: DataTypes.TEXT },
    categoryId: { type: DataTypes.INTEGER },
    tagsIds: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
    image: { type: DataTypes.STRING, allowNull: true }
});

export const Category = sequelize.define('category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, unique: true, primaryKey: true },
    name: { type: DataTypes.STRING, unique: true },
    userId: { type: DataTypes.INTEGER }
});

export const Tag = sequelize.define('tag', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, unique: true, primaryKey: true },
    hashName: { type: DataTypes.STRING, unique: true },
    userId: { type: DataTypes.INTEGER }
});

export const Author = sequelize.define('author', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, unique: true, primaryKey: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING, allowNull: true }
});