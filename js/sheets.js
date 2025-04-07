let identifiers = [];

let columnaAEditar;

let assistDate = document.getElementById("assist-date");

async function getIdentifier() {
  //Obtener las identificaciones
  let response;
  try {
    response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1wX2oD76QuFmyexe0bNmFeFLtsuVOjoZmSHP9CMDSpJo",
      range: "Asistencia!D2:D",
    });
  } catch (err) {
    console.error(err);
    return;
  }
  const range = response.result;
  if (!range || !range.values || range.values.length == 0) {
    console.warn("No se encontraron valores");
    return;
  }
  range.values.forEach((fila) => {
    identifiers.push(parseInt(fila[0]));
  });
  console.log(identifiers);

  //Obtener la ultima columna y persistirla
  let firstRow;
  try {
    firstRow = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1wX2oD76QuFmyexe0bNmFeFLtsuVOjoZmSHP9CMDSpJo",
      range: "Asistencia!1:1",
    });
  } catch (err) {
    console.error(err);
    return;
  }
  columnaAEditar = firstRow.result.values[0].length + 1;

  console.log("Verificar la columna: ", firstRow.result.values[0]);

  console.log("La columna a editar actualmente es: ", columnaAEditar);
}

async function compareIdentifier(response) {
  try {
    console.log(
      "El numero de identificacion está o no en la lista: ",
      identifiers.includes(response)
    );
    return identifiers.includes(response);
  } catch (error) {
    console.log(error);
  }
}

async function addAsistencia(contenido) {
  //const columnaAEditar = range.values[0].length + 1;
  filaAEditar = identifiers.indexOf(contenido) + 2;

  response = await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: "1wX2oD76QuFmyexe0bNmFeFLtsuVOjoZmSHP9CMDSpJo",
    range: `Asistencia!R1C${columnaAEditar}:R1C${columnaAEditar}`,
    values: [[assistDate.value]],
    valueInputOption: "USER_ENTERED",
  });

  response = await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: "1wX2oD76QuFmyexe0bNmFeFLtsuVOjoZmSHP9CMDSpJo",
    range: `Asistencia!R${filaAEditar}C${columnaAEditar}:R${filaAEditar}C${columnaAEditar}`,
    values: [["X"]],
    valueInputOption: "USER_ENTERED",
  });

  console.log(assistDate.value);

  console.log(
    "Aqui se sigue manteniendo la columna a editar: ",
    columnaAEditar,
    "Y ahora muestra la fila a editar: ",
    filaAEditar
  );
}
