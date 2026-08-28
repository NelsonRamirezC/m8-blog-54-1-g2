import { Sequelize } from "sequelize";

//motor_db://usuario:password@direccion_host:puerto/nombre_db

const URI_DATABASE =
    "postgres://postgres:123456@localhost:5432/m8_blog_54_1_g2";

const sequelize = new Sequelize(URI_DATABASE);

export default sequelize;
