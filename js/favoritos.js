const CLAVE_FAVORITOS = "noticlic-favoritos";

// Leo del localStorage el arreglo de ids. Si todavia no hay nada, devuelvo uno vacio
function obtenerFavoritos() {
  const datos = localStorage.getItem(CLAVE_FAVORITOS);
  return datos ? JSON.parse(datos) : [];
}

function guardarFavoritos(lista) {
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(lista));
}

function esFavorito(id) {
  return obtenerFavoritos().includes(id);
}

// Si la noticia ya estaba la saco, y si no estaba la meto. Asi un solo boton hace las dos cosas
function alternarFavorito(id) {
  let favoritos = obtenerFavoritos();
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(favId => favId !== id);
  } else {
    favoritos.push(id);
  }
  guardarFavoritos(favoritos);
  return favoritos.includes(id);
}

function quitarFavorito(id) {
  const favoritos = obtenerFavoritos().filter(favId => favId !== id);
  guardarFavoritos(favoritos);
}

// De aqui en adelante es solo para favoritos.html. En las demas paginas no existe el contenedor
const contenedorFavoritos = document.getElementById("lista-favoritos");

if (contenedorFavoritos) {
  mostrarFavoritos();
}

function mostrarFavoritos() {
  fetch("data/noticias.json")
    .then(respuesta => respuesta.json())
    .then(noticias => {
      const idsGuardados = obtenerFavoritos();
      const misNoticias = noticias.filter(noticia => idsGuardados.includes(noticia.id));

      const estadoVacio = document.getElementById("favoritos-vacio");

      if (misNoticias.length === 0) {
        contenedorFavoritos.innerHTML = "";
        estadoVacio.style.display = "block";
        return;
      }

      estadoVacio.style.display = "none";
      contenedorFavoritos.innerHTML = "";

      misNoticias.forEach(noticia => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <div class="card-imagen">
            <img src="${noticia.imagen}" alt="${noticia.titulo}" />
          </div>
          <div class="card-cuerpo">
            <span class="card-categoria">${noticia.categoria}</span>
            <h3 class="card-titulo">${noticia.titulo}</h3>
            <p class="card-descripcion">${noticia.descripcionBreve}</p>
            <div class="card-pie">
              <a href="detalle.html?id=${noticia.id}" class="btn">Ver más</a>
              <button class="btn btn-secundario" data-id="${noticia.id}">Quitar</button>
            </div>
          </div>
        `;
        contenedorFavoritos.appendChild(card);
      });

      // El boton Quitar borra la noticia del localStorage y vuelvo a pintar la lista
      const botonesQuitar = contenedorFavoritos.querySelectorAll("button[data-id]");
      botonesQuitar.forEach(boton => {
        boton.addEventListener("click", () => {
          const id = Number(boton.getAttribute("data-id"));
          quitarFavorito(id);
          mostrarFavoritos();
        });
      });
    })
    .catch(() => {
      contenedorFavoritos.innerHTML =
        "<p class='estado-vacio'>No se pudieron cargar las noticias.</p>";
    });
}
