const cboxEstado = document.querySelector("#comboboxEstado");
const cboxMunicipio = document.querySelector("#comboboxMunicipio");

const estados = new Map();

const estadosSiglas = [
  "AC",
  "AL",
  "AM",
  "AP",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MG",
  "MS",
  "MT",
  "PA",
  "PB",
  "PE",
  "PI",
  "PR",
  "RJ",
  "RN",
  "RO",
  "RR",
  "RS",
  "SC",
  "SE",
  "SP",
  "TO",
];

async function getEstadoData(uf) {
  const { data } = await axios.get(`http://localhost:3000/api/estado/${uf}`);
  return { svg: data.svg, viewbox: data.viewbox, nome: data.nome };
}

async function getMunicipioData(uf) {
  const { data } = await axios.get(
    `http://localhost:3000/api/estado/${uf}/municipios`,
  );
  return new Map(data.map((c) => [c.id, { nome: c.nome, svg: c.svg }]));
}

function addToCombox(obj, cboxElement) {
  const option = document.createElement("option");
  option.value = obj.uf;
  option.text = obj.nome;
  option.id = obj.uf;
  cboxElement.appendChild(option);
}

function populateCombobox(estadosMap, cboxElement) {
  cboxElement.replaceChildren();
  estadosMap.forEach((estado, sigla) => {
    const option = document.createElement("option");
    option.value = sigla;
    option.text = estado.nome;
    cboxElement.appendChild(option);
  });
}

function toggleComboboxOptionById(optionId) {
  const option = document.getElementById(optionId);
  if (option && option.disabled) {
    option.disabled = false;
  } else if (option) {
    option.disabled = true;
  }
}
async function fetchAndSetEstadoInMapObject(uf, estadoMap) {
  const estado = await getEstadoData(uf);
  estadoMap.set(uf, { ...estado });
}

async function fetchAndAddCitiesToMapObjects(uf, estadoMap) {
  const municipios = await getMunicipioData(uf);
  const obj = estadoMap.get(uf) || {};
  estadoMap.set(uf, { ...obj, municipios });
}

async function fetchAndAddFullEstadoInMapObject(uf, estadoMap) {
  await fetchAndSetEstadoInMapObject(uf, estadoMap);
  await fetchAndAddCitiesToMapObjects(uf, estadoMap);
}

async function loadBlockFullEstado(uf, estadoMap, cboxElement) {
  await fetchAndSetEstadoInMapObject(uf, estadoMap);
  const obj = estadoMap.get(uf);
  addToCombox({ uf, nome: obj.nome }, cboxElement);
  toggleComboboxOptionById(uf);
  await fetchAndAddCitiesToMapObjects(uf, estadoMap);
  toggleComboboxOptionById(uf);
}

function insertChildAtPosition(parent, child, index) {
  child.remove();
  if (index >= parent.children.length) {
    parent.appendChild(child);
  } else {
    parent.insertBefore(child, parent.children[index]);
  }
}

async function loadEstadosData(ufs, estadoMap, cboxEstado, cboxMunicipio) {
  const first = "DF";
  const others = ufs.filter((uf) => uf !== first);

  await loadBlockFullEstado(first, estadoMap, cboxEstado);
  populateCombobox(estadoMap.get(first).municipios, cboxMunicipio);

  for (const uf of others) {
    await fetchAndSetEstadoInMapObject(uf, estadoMap);
    const obj = estadoMap.get(uf);
    addToCombox({ uf, nome: obj.nome }, cboxEstado);
  }

  insertChildAtPosition(cboxEstado, document.querySelector("#" + first), 6);

  const res = others.map((uf) => {
    loadBlockFullEstado(uf, estadoMap, cboxEstado);
  });

  await Promise.all(res);
}

(async function main() {
  await loadEstadosData(estadosSiglas, estados, cboxEstado, cboxMunicipio);
})();

cboxEstado.addEventListener("change", (e) => {
  const uf = e.target.value;
  let municipios = estados.get(uf).municipios;
  populateCombobox(municipios, cboxMunicipio);
});
