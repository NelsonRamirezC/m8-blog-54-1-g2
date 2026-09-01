import Usuario from "./Usuario.model.js";
import Publicacion from "./Publicacion.model.js";
import Comentario from "./Comentario.model.js";

// Asociaciones entre modelos

// Un Usuario tiene muchas Publicaciones
Usuario.hasMany(Publicacion, {
    foreignKey: "usuarioId",
    sourceKey: "id",
    as: "publicaciones",
});

// Una Publicación pertenece a un Usuario
Publicacion.belongsTo(Usuario, {
    foreignKey: "usuarioId",
    targetKey: "id",
    as: "usuario",
});

// Un Usuario tiene muchos Comentarios
Usuario.hasMany(Comentario, {
    foreignKey: "usuarioId",
    sourceKey: "id",
    as: "comentarios",
});

// Un Comentario pertenece a un Usuario
Comentario.belongsTo(Usuario, {
    foreignKey: "usuarioId",
    targetKey: "id",
    as: "usuario",
});

// Una Publicación tiene muchos Comentarios
Publicacion.hasMany(Comentario, {
    foreignKey: "publicacionId",
    sourceKey: "id",
    as: "comentarios",
});

// Un Comentario pertenece a una Publicación
Comentario.belongsTo(Publicacion, {
    foreignKey: "publicacionId",
    targetKey: "id",
    as: "publicacion",
});

export { Usuario, Publicacion, Comentario };
