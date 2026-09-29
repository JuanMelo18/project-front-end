const parametros = new URLSearchParams(window.location.search);
const idNoticia = Number(parametros.get("id"));

const contenedorDetalle = document.getElementById("detalle-noticia");

if (contenedorDetalle) {
  fetch("data/noticias.json")
    .then(respuesta => respuesta.json())
    .then(noticias => {
      const noticia = noticias.find(item => item.id === idNoticia);

      if (!noticia) {
        contenedorDetalle.innerHTML =
          "<p class='estado-vacio'>La noticia que buscas no existe.</p>";
        return;
      }

      pintarDetalle(noticia);
    })
    .catch(() => {
      contenedorDetalle.innerHTML =
        "<p class='estado-vacio'>No se pudo cargar la noticia.</p>";
    });
}

function pintarDetalle(noticia) {
  const favorita = esFavorito(noticia.id);
  const textoBoton = favorita ? "Quitar de favoritos" : "Agregar a favoritos";

  contenedorDetalle.innerHTML = `
    <div class="detalle-imagen">
      <img src="${noticia.imagen}" alt="${noticia.titulo}" />
    </div>
    <div class="detalle-cuerpo">
      <span class="card-categoria">${noticia.categoria}</span>
      <div class="detalle-meta">
        <span>${formatearFecha(noticia.fecha)}</span>
        <span>Por ${noticia.autor}</span>
      </div>
      <h1>${noticia.titulo}</h1>
      <p>${noticia.contenido}</p>
      <div class="detalle-acciones">
        <button id="boton-favorito" class="btn btn-favorito">${textoBoton}</button>
        <a href="contacto.html" class="btn btn-secundario">Contacto</a>
      </div>
    </div>
  `;

  const botonFavorito = document.getElementById("boton-favorito");
  botonFavorito.addEventListener("click", () => {
    const ahoraEsFavorito = alternarFavorito(noticia.id);
    botonFavorito.textContent = ahoraEsFavorito
      ? "Quitar de favoritos"
      : "Agregar a favoritos";
  });
}

// En el JSON la fecha viene como 2026-09-10, aca la paso a un formato mas legible
function formatearFecha(fecha) {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const partes = fecha.split("-");
  const anio = partes[0];
  const mes = meses[Number(partes[1]) - 1];
  const dia = Number(partes[2]);
  return `${dia} de ${mes} de ${anio}`;
}
