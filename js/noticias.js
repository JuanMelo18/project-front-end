let todasLasNoticias = [];

const contenedorNoticias = document.getElementById("lista-noticias");

// El index marca su grid como destacado para que salgan solo unas pocas
const soloDestacadas = contenedorNoticias
  ? contenedorNoticias.dataset.destacadas === "true"
  : false;

const inputBuscador = document.getElementById("buscador");
const contenedorFiltros = document.getElementById("filtros");

if (contenedorNoticias) {
  fetch("data/noticias.json")
    .then(respuesta => respuesta.json())
    .then(noticias => {
      todasLasNoticias = noticias;

      if (soloDestacadas) {
        // En la portada dejo nada mas las tres primeras
        pintarNoticias(todasLasNoticias.slice(0, 3));
      } else {
        pintarNoticias(todasLasNoticias);
        activarBuscador();
        activarFiltros();
      }
    })
    .catch(() => {
      contenedorNoticias.innerHTML =
        "<p class='estado-vacio'>No se pudieron cargar las noticias.</p>";
    });
}

function pintarNoticias(lista) {
  contenedorNoticias.innerHTML = "";

  if (lista.length === 0) {
    contenedorNoticias.innerHTML =
      "<p class='estado-vacio'>No se encontraron noticias.</p>";
    return;
  }

  lista.forEach(noticia => {
    const favorita = esFavorito(noticia.id);
    // La estrella llena o vacia es la misma del mockup, se deja como emoji
    const estrella = favorita ? "★" : "☆";
    const claseActiva = favorita ? "icono-fav activo" : "icono-fav";

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
          <span class="${claseActiva}" data-id="${noticia.id}">${estrella}</span>
        </div>
      </div>
    `;
    contenedorNoticias.appendChild(card);
  });

  activarEstrellas();
}

// Con la estrella de cada card marco la noticia como favorita sin salir del listado
function activarEstrellas() {
  const estrellas = contenedorNoticias.querySelectorAll(".icono-fav");
  estrellas.forEach(estrella => {
    estrella.addEventListener("click", () => {
      const id = Number(estrella.getAttribute("data-id"));
      const ahoraEsFavorito = alternarFavorito(id);
      if (ahoraEsFavorito) {
        estrella.textContent = "★";
        estrella.classList.add("activo");
      } else {
        estrella.textContent = "☆";
        estrella.classList.remove("activo");
      }
    });
  });
}

// Busco comparando el texto escrito contra el titulo de cada noticia
function activarBuscador() {
  if (!inputBuscador) return;

  inputBuscador.addEventListener("input", () => {
    const texto = inputBuscador.value.toLowerCase().trim();
    const filtradas = todasLasNoticias.filter(noticia =>
      noticia.titulo.toLowerCase().includes(texto)
    );
    pintarNoticias(filtradas);
  });
}

// Cada boton de categoria deja solo las noticias de esa categoria
// y el boton "Todas" vuelve a traer el listado completo
function activarFiltros() {
  if (!contenedorFiltros) return;

  const botones = contenedorFiltros.querySelectorAll(".filtro");
  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      botones.forEach(b => b.classList.remove("activo"));
      boton.classList.add("activo");

      const categoria = boton.dataset.categoria;
      if (categoria === "todas") {
        pintarNoticias(todasLasNoticias);
      } else {
        const filtradas = todasLasNoticias.filter(
          noticia => noticia.categoria === categoria
        );
        pintarNoticias(filtradas);
      }
    });
  });
}
