const formulario = document.getElementById("form-contacto");

if (formulario) {
  const campoNombre = document.getElementById("nombre");
  const campoCorreo = document.getElementById("correo");
  const campoMensaje = document.getElementById("mensaje");
  const mensajeExito = document.getElementById("mensaje-exito");

  formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    limpiarErrores();
    let hayErrores = false;

    if (campoNombre.value.trim() === "") {
      mostrarError("error-nombre", "Por favor escribe tu nombre.");
      hayErrores = true;
    }

    if (campoCorreo.value.trim() === "") {
      mostrarError("error-correo", "El correo es obligatorio.");
      hayErrores = true;
    } else if (!correoValido(campoCorreo.value.trim())) {
      mostrarError("error-correo", "Ingresa un correo electrónico válido.");
      hayErrores = true;
    }

    if (campoMensaje.value.trim() === "") {
      mostrarError("error-mensaje", "No olvides escribir tu mensaje.");
      hayErrores = true;
    }

    if (!hayErrores) {
      mensajeExito.style.display = "block";
      formulario.reset();
    }
  });
}

//informacion basica: texto, arroba, texto, punto y texto
function correoValido(correo) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(correo);
}

function mostrarError(idElemento, texto) {
  const elemento = document.getElementById(idElemento);
  elemento.textContent = texto;
  elemento.style.display = "block";
}

function limpiarErrores() {
  const errores = document.querySelectorAll(".mensaje-error");
  errores.forEach(error => {
    error.textContent = "";
    error.style.display = "none";
  });
  document.getElementById("mensaje-exito").style.display = "none";
}
