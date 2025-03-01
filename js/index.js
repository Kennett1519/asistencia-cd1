//crea elemento
const video = document.createElement("video");

//nuestro camvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

//div donde llegara nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

//lectura desactivada
let scanning = false;

let respuesta = 0;

let identificaciones = [];

//funcion para encender la camara
const encenderCamara = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

//funciones para levantar las funiones de encendido de la camara
function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}

function compareIdentifiersLocal(response) {
  try {
    console.log(
      "El numero de identificacion está o no en la lista local: ",
      identificaciones.includes(response)
    );
    return identificaciones.includes(response);
  } catch (error) {
    console.log(error);
  }
}

async function actuSheet(respuesta) {
  await addAsistencia(respuesta);
}

//apagara la camara
const cerrarCamara = () => {
  video.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  canvasElement.hidden = true;
  btnScanQR.hidden = false;
};

//callback cuando termina de leer el codigo QR
qrcode.callback = (respuesta) => {
  console.log(identificaciones);
  if (respuesta) {
    console.log(respuesta);
    Swal.fire({
      template: "#my-template",
      title: "Desea guardar el numero de identificación: " + respuesta,
    }).then((result) => {
      if (result.isConfirmed) {
        let confirmacion = compareIdentifier(parseInt(respuesta));
        console.log("la confirmación: ", confirmacion);

        confirmacion.then((result) => {
          if (result) {
            if (!compareIdentifiersLocal(parseInt(respuesta))) {
              console.log(
                "Aqui lo esta guardando: ",
                compareIdentifier(parseInt(respuesta))
                // HAY QUE COMPROBAR TAMBIEN QUE EL NUMERO DE IDENTIFICACION NO ESTÉ YA EN EL ARRAY
              );

              identificaciones.push(parseInt(respuesta));
              actuSheet(parseInt(respuesta));
              encenderCamara();
            } else {
              Swal.fire({
                title: "El numero de identificación ya fue leído previamente",
                icon: "error",
                iconColor: "red",
                showConfirmButton: true,
                confirmButtonText: "Ok",
              });
              encenderCamara();
            }
          } else {
            Swal.fire({
              title:
                "El numero de identificación no existe en la base de datos",
              icon: "error",
              iconColor: "red",
              showConfirmButton: true,
              confirmButtonText: "Ok",
            });
            encenderCamara();
          }
        });
      } else if (result.isDenied) {
        encenderCamara();
      }
    });

    getRespuesta(respuesta);
    //addAsistencia();
    //encenderCamara();
    //cerrarCamara();
  }
};

const getRespuesta = (respuesta) => {
  respuesta = respuesta;
};

console.log(respuesta);

//evento para mostrar la camara sin el boton
window.addEventListener("load", (e) => {
  encenderCamara();
});
