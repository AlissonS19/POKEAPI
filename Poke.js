//1.- Hacer una petición a la PokeAPI para obtener cualquier Pokémon.  Muestra sus tipos en consola mediante un for.


let pokemones;
let pokemonesFiltrados;

//----------------------------------------------------------------------
//Aquí se creó una función para obtener la lista de los pokemones de la API 
//Se ha creado una variable repsuesta que va a obtener la lista de los pokemones pero indicando que solo queremos 151 pokemones
async function obtenerPokemones() {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151'); //
    if (response.status === 200) {
      pokemones = response.data.results.map(i => {
        return { name: i.name }
      });

      pokemones = await Promise.all(pokemones.map(async pokemon => obtenerDatosPokemon(pokemon)));
      pokemones.forEach(pokemon => mostrarPokemones(pokemon));
    }
    else alert('NO SE OBTUVO INFORMACION');
  }
  catch (e) {
    console.log(e);
  }
}

//----------------------------------------------------------------------
//En esta función vamos a obtener los datos de los pokemones 
//Al encontrarlos por su nombre va a mostrar los datos como la imagen y que tipo es
async function obtenerDatosPokemon(pokemon) {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);

    if (response.status === 200) {
      pokemon.img = response.data.sprites.front_default;
      pokemon.types = response.data.types.map(item => item.type.name);
      return pokemon;
    }
    else alert('NO SE OBTUVO INFORMACION');
  }
  catch (e) {
    console.log(e);
  }
}

//----------------------------------------------------------------------
//Esta funcion nos permite mostrar los pokemones en la interfaz que se encuentran dentro de un div mostrandolos como cartas
function mostrarPokemones(pokemon) {
  const cardPokemon = document.createElement('div');
  cardPokemon.classList.add('col-6', 'col-md-4', 'col-lg-3', 'col-xl-2', 'mb-3');
  cardPokemon.innerHTML = `
                          <div class="card">
                            <div class="body text-center p-3">
                              <h3 class="h5">${pokemon.name}</h3>
                              <img src="${pokemon.img}" alt="Pokemon">
                            </div>
                          </div>
                          `

  const listaPokemonesElement = document.getElementById('listaPokemones');
  listaPokemonesElement.insertAdjacentElement('beforeend', cardPokemon);
};

//----------------------------------------------------------------------
// Esta funcion nos permite que se filtren los pokemones los cuales contienen las letras que vamos ingresando en el buscador....
//...usando el toLowerCase para que no haya problemas al usar mayúsculas
function filtrarPokemones(texto) {
  document.getElementById('listaPokemones').innerHTML = null;
  if (texto != '') {
    pokemonesFiltrados = pokemones.filter(pokemon => pokemon.name.toLowerCase().indexOf(texto.toLowerCase()) > -1);
    pokemonesFiltrados.forEach(p => mostrarPokemones(p));
  }
  else pokemones.forEach(p => mostrarPokemones(p));
}

document.getElementById('searchIn').addEventListener('input', (e) => {
  console.log(e.target.value);
  const textoBusqueda = e.target.value;
  filtrarPokemones(textoBusqueda);
});



obtenerPokemones();
