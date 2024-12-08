const cboxEstado = document.querySelector("#comboboxEstado");
const cboxMunicipio = document.querySelector("#comboboxMunicipio");
const svgTag = document.querySelector("#svg");

const estados = new Map();

let currentEstado = null;
let currentId = null;

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
  cboxEstado.dispatchEvent(new Event("change"));

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

function createStatePath(svg, id) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.id = id;
  path.setAttribute("d", svg);
  path.setAttribute("stroke", "black");
  path.setAttribute("fill", "green");
  path.setAttribute("stroke-width", "0.01");

  return path;
}

function drawState(viewbox, municipios) {
  svgTag.replaceChildren();
  svgTag.setAttribute("viewBox", viewbox);
  const fragment = document.createDocumentFragment();
  municipios.forEach((obj) => {
    const path = createStatePath(obj[1].svg, obj[0]);
    fragment.appendChild(path);
  });
  svgTag.appendChild(fragment);
}

function changeMunicipioComboValue(id) {
  cboxMunicipio.value = id;
}

function changeCity(currentId, prevId) {
  if (currentId != prevId) {
    changeMunicipioComboValue(currentId);
    if (currentId) {
      const el = document.getElementById(currentId);
      el && el.setAttribute("fill", "blue");
    }
    if (prevId) {
      const prev = document.getElementById(prevId);
      prev && prev.setAttribute("fill", "green");
    }
    return currentId;
  }
  return prevId;
}

cboxMunicipio.addEventListener("change", (e) => {
  const id = e.target.value;
  currentId = changeCity(id, currentId);
});

cboxEstado.addEventListener("change", (e) => {
  const uf = e.target.value;
  let { municipios, viewbox } = estados.get(uf);

  populateCombobox(municipios, cboxMunicipio);
  drawState(viewbox, municipios.entries());

  currentId = changeCity(municipios.keys().next().value, null);
});

svgTag.addEventListener("mousemove", (e) => {
  const { target } = e;
  if (target.tagName === "path" && target.id) {
    currentId = changeCity(target.id, currentId);
  }
});
