import app from "./src/app.js";
import sequelize from "./src/config/database.js";
import "./src/models/index.js";

const PORT = 3000;

const main = async () => {
    try {
        await sequelize.sync();
        console.log("base de datos conectada.");
        app.listen(PORT, () => {
            console.log("Servidor encendido.");
        });
    } catch (error) {
        console.error(error);
    }
};

main();
