const cboxEstado = document.querySelector("#comboboxEstado");

let estados;

async function getEstadosData() {
  const { data } = await axios.get("http://localhost:3000/api/estado");
  const arr = data.map((e) => [
    e.sigla,
    { svg: e.svg, viewbox: e.viewbox, nome: e.nome },
  ]);
  return new Map(arr);
}

function populateCombobox(estadosMap, cboxElement) {
  estadosMap.forEach((estado, sigla) => {
    const option = document.createElement("option");
    option.value = sigla;
    option.text = estado.nome;
    cboxElement.appendChild(option);
  });
}

(async function main() {
  estados = await getEstadosData();
  populateCombobox(estados, cboxEstado);
})();
