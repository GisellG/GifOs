// Mostrar u ocultar el menú para cambiar el tema

function selecTema() {
    document.getElementById("mostrar_temas").classList.toggle("show");
  }
  
  window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
    let mostrarTemas = document.getElementById("mostrar_temas");
      if (mostrarTemas.classList.contains('show')) {
        mostrarTemas.classList.remove('show');
      }
    }
  }

// Cambiar el Tema de la página

// ------------------------------- T E M A  D A R K ---------------------------------- //

function tema(){

  // Cambio de logo

  let elimLogo = document.getElementById("logo_tema");
  
  while (elimLogo.hasChildNodes()) {
    elimLogo.removeChild(elimLogo.firstChild);
  }

  let creaLogo = document.createElement("IMG");
  creaLogo.setAttribute("src", "resources/img/gifOF_logo_dark.png");
  elimLogo.appendChild(creaLogo);

  // Cambio de estado del tema

  let dayActiv = document.getElementById("change_light");
  dayActiv.classList.remove("active");

  let nightActiv = document.getElementById("change_night");
  nightActiv.classList.add("active");

  // Cambio del dropdown

  let imgDropdown = document.getElementById("imgDrop");

  imgDropdown.src="resources/img/forward.svg";
  imgDropdown.classList.add('fix_image');

  // Cambio de variables adjuntando el estilo "night"

  document.getElementById("cont_gnral").classList.add('night');
}

window.onload = function(){
  document.getElementById("change_night").addEventListener( 'click', tema);
}

// ------------------------ V O L V E R   A   T E M A   L I G H T -------------------- //

function nTema(){

  // Cambio de logo

  let elimLogo = document.getElementById("logo_tema");

  while (elimLogo.hasChildNodes()) {
    elimLogo.removeChild(elimLogo.firstChild);
  }

  let creaLogo = document.createElement("IMG");
  creaLogo.setAttribute("src", "resources/img/gifOF_logo.png");
  elimLogo.appendChild(creaLogo);

  // Cambio de estado del tema

  let dayActiv = document.getElementById("change_night");
  dayActiv.classList.remove("active");
  
  let nightActiv = document.getElementById("change_light");
  nightActiv.classList.add("active");

  // Cambio de variables regresando a las variables del root
  document.getElementById("cont_gnral").classList.remove('night');
}

window.onload = function(){
  document.getElementById("change_light").addEventListener('click', nTema);
}

// ------------------------ L L A M A D O   A   A P I :  B Ú S Q U E D A ------------------------ //


let api_key = 'YW2975MP7wtGlGS7qrpq4z2v7KS58MMC';

document.addEventListener("DOMContentLoaded", init);

function init(){
  document.getElementById("btn_search").addEventListener("click", ev =>{
    ev.preventDefault();
        
    let url = `http://api.giphy.com/v1/gifs/search?api_key=${api_key}&limit=10&q=`;
    let str = document.getElementById("search").value.trim();
    url = url.concat(str);
    console.log(url);

    //Confirmación del estado de la respuesta de la API
    fetch(url)
    .then(response => response.json() )
    .then(content => {
    //parámetros de estado de la API: data, pagination, meta
      console.log(content.data);
      console.log('META', content.meta);

      let contenedor = document.createElement("div");
      contenedor.setAttribute('class', 'elem_resultado');

      let busq = document.getElementById("textoRes");
      busq.classList.remove("hiden");

      let tend = document.getElementById("tend");
      tend.classList.add("hiden");

      content.data.forEach(gif => {
        let divImg = document.createElement("div");
        contenedor.appendChild(divImg);
        divImg.classList.add("prueba");

        let img = document.createElement("img");
        img.src = gif.images.downsized_large.url;
        img.alt = gif.title;

        divImg.appendChild(img);

        let txtImg = document.createElement("h2");
        divImg.appendChild(txtImg);
        txtImg.innerText = "#" + gif.title;

        let res = document.querySelector(".resultado_busqueda");
        res.insertAdjacentElement('beforeend', contenedor); 
    //El método insertAdjacentElement() inserta un elemento nodo dado en una posición dada con respecto al elemento sobre el que se invoca.
    //En este caso usé 'beforeend' para que se posicionaran después del último nodo hijo.
        });
    })
    .catch(err =>{
      console.error(err);
    })
  })
}

// ------------------------ C O M P O R T A M I E N T O   I N P U T ------------------------ //

let busInput = document.getElementById("search");
let busBtn = document.getElementById("btn_search");
let mosSug = document.getElementById("sugResul");

busInput.addEventListener('keyup', function(){
  
  //Cambio de botón

  busBtn.setAttribute('class', 'busq_activa');
  mosSug.classList.remove("hiden");

  while (busBtn.hasChildNodes()) {
    busBtn.removeChild(busBtn.firstChild);
  }

  let x = document.createElement("IMG");
  let y = document.createTextNode("Buscar");

  x.setAttribute("src", "resources/img/lupa.svg");
  busBtn.appendChild(x);
  busBtn.appendChild(y);



});



function busqueda(){
  let val = document.getElementById("search").value;
  document.getElementById("valorBusq").innerText = val;
}

// ------------------------ L L A M A D O   A   A P I :  S U G E R I D O S ------------------------ //

window.onload = function(){
  let urlTrend = `http://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=cute&limit=4q=sakura`;

  fetch(urlTrend)
    .then(response => response.json() )
    .then(content => {
      //Comprobación de comunicación con la API
      console.log(content.data);
      console.log('META', content.meta);

      content.data.forEach(trend =>{

        let trendCont = document.getElementById("elemTrending");
        let trendDiv = document.createElement("div");
        trendDiv.setAttribute('class', 'sugg');
        trendCont.appendChild(trendDiv);

        let nameTrend = document.createElement("h2");
        trend.title.split(" ").forEach( e => {
          nameTrend.innerHTML += `<a class="hash">#${e} </a>`;
        })

        Array.prototype.forEach.call(document.getElementsByClassName("hash"), e =>{
          e.addEventListener("click", event =>{
          document.getElementById("search").value = event.target.innerText.substr(1);
          busqueda();
          })
        })

        trendDiv.appendChild(nameTrend);

        let imgTrend = document.createElement("img");
        imgTrend.src = trend.images.downsized_large.url;
        imgTrend.alt = trend.title;
        trendDiv.appendChild(imgTrend);

        let addBtn = document.createElement("button");
        addBtn.innerText = "Ver más...";
        addBtn.setAttribute = ('class', 'btn_mas');
        trendDiv.appendChild(addBtn);
      })
    })
    .catch(err =>{
      console.error(err);
    })

// ------------------------ L L A M A D O   A   A P I :  T R E N D I N G ------------------------ //

  let urlRandom = `http://api.giphy.com/v1/gifs/trending?api_key=${api_key}&limit=10`;

  fetch(urlRandom)
    .then(response => response.json() )
    .then(content => {
      //Comprobación de la comunicación con la API
      console.log(content.data);
      console.log('META', content.meta);

      let contenedor = document.createElement("div");
      contenedor.setAttribute('class', 'elem_resultado');

      content.data.forEach(gif => {
        let divImg = document.createElement("div");
        contenedor.appendChild(divImg);
        divImg.classList.add("prueba");

        let img = document.createElement("img");
        img.src = gif.images.downsized_large.url;
        img.alt = gif.title;

        divImg.appendChild(img);

        let txtImg = document.createElement("h2");
        divImg.appendChild(txtImg);
        txtImg.innerText = "#" + gif.title;

        let res = document.querySelector(".tendencias");
        res.insertAdjacentElement('beforeend', contenedor);
      })
    })
    .catch(err =>{
      console.error(err);
    })
};