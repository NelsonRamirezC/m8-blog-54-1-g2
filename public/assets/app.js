const API = "";

const getToken = () => localStorage.getItem("blog_token");

const decodeToken = (token) => {
    try {
        return JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
        );
    } catch {
        return null;
    }
};
const getUser = () => {
    const token = getToken();
    const user = token ? decodeToken(token) : null;
    if (!user || (user.exp && user.exp * 1000 < Date.now())) {
        localStorage.removeItem("blog_token");
        return null;
    }
    return user;
};
const authHeaders = () =>
    getToken() ? { Authorization: `Bearer ${getToken()}` } : {};
const escapeHtml = (value = "") =>
    String(value).replace(
        /[&<>'"]/g,
        (char) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;",
            })[char],
    );
const date = (value) =>
    value
        ? new Date(value).toLocaleString("es-CL", {
              dateStyle: "medium",
              timeStyle: "short",
          })
        : "";

async function request(path, options = {}) {
    const headers = {
        ...authHeaders(),
        ...(options.body instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),
        ...options.headers,
    };
    const response = await fetch(`${API}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
        throw new Error(data.message || "No se pudo completar la operación.");
    return data;
}

function renderNav() {
    const user = getUser();
    const nav = document.querySelector("#site-nav");
    if (!nav) return;
    nav.innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark"><div class="container">
    <a class="navbar-brand fw-bold" href="/">M8 Blog</a><button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#main-nav"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="main-nav"><div class="navbar-nav me-auto"><a class="nav-link" href="/">Publicaciones</a>${user ? '<a class="nav-link" href="/crear-publicacion.html">Nueva publicación</a>' : ""}</div>
    <div class="navbar-nav align-items-lg-center">${user ? `<span class="navbar-text me-lg-3">Hola, ${escapeHtml(user.nombre)}</span><button class="btn btn-sm btn-outline-light me-lg-2" id="logout">Cerrar sesión</button><button class="btn btn-sm btn-outline-danger" id="delete-account">Eliminar cuenta</button>` : '<a class="nav-link" href="/login.html">Iniciar sesión</a><a class="nav-link" href="/registro.html">Registrarse</a>'}</div></div></div></nav>`;
    document.querySelector("#logout")?.addEventListener("click", () => {
        localStorage.removeItem("blog_token");
        location.href = "/";
    });
    document
        .querySelector("#delete-account")
        ?.addEventListener("click", async () => {
            if (!confirm("¿Eliminar definitivamente tu cuenta?")) return;
            try {
                await request(`/api/usuarios/${user.id}`, { method: "DELETE" });
                localStorage.removeItem("blog_token");
                location.href = "/";
            } catch (error) {
                showMessage(error.message);
            }
        });
}
function showMessage(message, type = "danger") {
    const box = document.querySelector("#message");
    if (box) {
        box.className = `alert alert-${type}`;
        box.textContent = message;
        box.hidden = false;
    }
}
function owns(resource, user) {
    return (
        user &&
        (user.admin ||
            Number(resource.usuarioId || resource.autor?.id) ===
                Number(user.id))
    );
}

async function loadHome() {
    const list = document.querySelector("#publicaciones");
    try {
        const data = await request("/api/publicaciones");
        list.innerHTML = data.publicaciones.length
            ? data.publicaciones
                  .map(
                      (post) =>
                          `<article class="col-md-6 col-xl-4"><div class="card h-100"><div class="card-body d-flex flex-column"><div class="small text-muted mb-2">${escapeHtml(post.autor?.nombre || "Autor desconocido")} · ${date(post.fecha_creacion)}</div><h2 class="h4 card-title"><a href="/publicacion.html?id=${post.id}">${escapeHtml(post.titulo)}</a></h2><p class="content-copy text-muted flex-grow-1">${escapeHtml(post.contenido.length > 180 ? `${post.contenido.slice(0, 180)}...` : post.contenido)}</p><a class="btn btn-outline-dark align-self-start" href="/publicacion.html?id=${post.id}">Leer publicación</a></div></div></article>`,
                  )
                  .join("")
            : '<div class="col"><div class="alert alert-light">Todavía no hay publicaciones.</div></div>';
    } catch (error) {
        list.innerHTML = `<div class="col"><div class="alert alert-danger">${escapeHtml(error.message)}</div></div>`;
    }
}

async function loadPost() {
    const root = document.querySelector("#post");
    const id = new URLSearchParams(location.search).get("id");
    if (!id) {
        root.innerHTML =
            '<div class="alert alert-warning">Falta el identificador de la publicación.</div>';
        return;
    }
    try {
        const { publicacion: post } = await request(`/api/publicaciones/${id}`);
        const user = getUser();
        root.innerHTML = `<article class="card"><div class="card-body p-4 p-lg-5"><div class="small text-muted">${escapeHtml(post.autor?.nombre || "Autor desconocido")} · ${date(post.fechaCreacion)}</div><h1 class="display-6 mt-2">${escapeHtml(post.titulo)}</h1><p class="content-copy mt-4">${escapeHtml(post.contenido)}</p></div></article>
      <section class="mt-4"><h2 class="h4">Comentarios <span class="badge text-bg-secondary">${post.comentarios?.length || 0}</span></h2>${user ? '<form id="comment-form" class="card card-body mb-4"><label class="form-label" for="comment">Deja tu comentario</label><textarea id="comment" class="form-control mb-2" rows="3" required></textarea><button class="btn btn-primary align-self-start">Publicar comentario</button></form>' : '<div class="alert alert-light">Inicia sesión para comentar.</div>'}<div id="comments">${renderComments(post.comentarios || [], post, user)}</div></section>`;
        document
            .querySelector("#comment-form")
            ?.addEventListener("submit", async (event) => {
                event.preventDefault();
                try {
                    await request("/api/comentarios", {
                        method: "POST",
                        body: JSON.stringify({
                            contenido: document.querySelector("#comment").value,
                            publicacionId: Number(id),
                        }),
                    });
                    location.reload();
                } catch (error) {
                    showMessage(error.message);
                }
            });
        document.querySelectorAll("[data-delete-comment]").forEach((button) =>
            button.addEventListener("click", async () => {
                if (!confirm("¿Eliminar este comentario?")) return;
                try {
                    await request(
                        `/api/comentarios/${button.dataset.deleteComment}`,
                        { method: "DELETE" },
                    );
                    location.reload();
                } catch (error) {
                    showMessage(error.message);
                }
            }),
        );
    } catch (error) {
        root.innerHTML = `<div class="alert alert-danger">${escapeHtml(error.message)}</div>`;
    }
}
function renderComments(comments, post, user) {
    return comments.length
        ? comments
              .map(
                  (comment) =>
                      `<div class="card mb-2"><div class="card-body"><div class="d-flex justify-content-between gap-3"><div><strong>${escapeHtml(comment.autor?.nombre || "Usuario")}</strong><div class="small text-muted">${date(comment.fechaCreacion || comment.fecha_creacion)}</div></div>${owns(comment, user) || owns(post, user) ? `<button class="btn btn-sm btn-outline-danger" data-delete-comment="${comment.id}">Eliminar</button>` : ""}</div><p class="content-copy mt-3 mb-0">${escapeHtml(comment.contenido)}</p></div></div>`,
              )
              .join("")
        : '<p class="text-muted">Sé la primera persona en comentar.</p>';
}

function setupForm(selector, callback) {
    document
        .querySelector(selector)
        ?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const button = event.submitter;
            button.disabled = true;
            try {
                await callback(new FormData(event.target));
            } catch (error) {
                showMessage(error.message);
                button.disabled = false;
            }
        });
}
function init() {
    renderNav();
    const page = document.body.dataset.page;
    if (page === "home") loadHome();
    if (page === "post") loadPost();
    if (page === "create" && !getUser())
        location.href = "/login.html?next=/crear-publicacion.html";
    if (page === "create")
        setupForm("#post-form", async (form) => {
            await request("/api/publicaciones", {
                method: "POST",
                body: JSON.stringify({
                    titulo: form.get("titulo"),
                    contenido: form.get("contenido"),
                }),
            });
            location.href = "/";
        });
    if (page === "login")
        setupForm("#login-form", async (form) => {
            const data = await request("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: form.get("email"),
                    password: form.get("password"),
                }),
            });
            localStorage.setItem("blog_token", data.token);
            location.href =
                new URLSearchParams(location.search).get("next") || "/";
        });
    if (page === "register")
        setupForm("#register-form", async (form) => {
            await request("/auth/registro", { method: "POST", body: form });
            location.href = "/login.html";
        });
}
document.addEventListener("DOMContentLoaded", init);
