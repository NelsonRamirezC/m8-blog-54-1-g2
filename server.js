import app from "./src/app.js";
import sequelize from "./src/config/database.js";

const PORT = 3000;

const main = async () => {
    try {
        await sequelize.authenticate();
        console.log("base de datos conectada.");
        app.listen(PORT, () => {
            console.log("Servidor encendido.");
        });
    } catch (error) {
        console.error(error);
    }
};

main();
