//------------------------------------ D E F I N I C I Ó N - D E - V A R I A B L E S --------------------------------------- //

// Selectores de video y preview del gif
let video = document.querySelector('video');
let preview = document.getElementById("preview");

// Selector de Botones
const btnStartRecording = document.getElementById("btn-start-recording");
const btnStopRecording = document.getElementById("btn-stop-recording");
const btnCopyLink = document.getElementById("copiar_clipBoard");
const btnDownload = document.getElementById("desc_gifo");

// Contenedores o "Cards"
const startContainer = document.querySelector(".cont_start");
const stopContainer = document.querySelector(".cont_stop");
const txtCapture = document.getElementById("rec_txt");
let cardInstrucciones = document.getElementById("instrucciones");
let cardCheck = document.getElementById("check");
let cardVistaPrev = document.getElementById("prev");
let cardUploadStatus = document.getElementById("upload_card");
let cardFinStatus = document.getElementById("fin_card");
const misGifos = document.getElementById("mis_gifos");

// Estados de grabación
let recording = false;
let recorder;
let blob;

// Variables para cronómetro funcional
let chronometerCall;
let horas = `00`;
let minutos = `00`;
let segundos = `00`;
const chronometerDisplay = document.querySelector(".chrono");

// API request
let api_key = 'YW2975MP7wtGlGS7qrpq4z2v7KS58MMC';
let obtenerGifID;

let gif_url;
//------------------------------------ D E F I N I C I Ó N - D E - F U N C I O N E S --------------------------------------- //


// ~ O B T E N E R - L O S - P E R M I S O S - D E - L A - C Á M A R A ~ 

function inic(){
    document.querySelector(".start").addEventListener('click', ev =>{

        //Modificación del contenedor
        cardInstrucciones.classList.add("hiden");
        cardCheck.classList.remove("hiden");
        
        //Llamado a la función que accede a la cámara del dispositivo
        captureCam()
        
        console.log(ultimoGif);
    })
};

window.onload = inic();


// ~ I N I C I O - D E - L A - P R E V I S U A L I Z A C I Ó N - Y - C A P T U R A ~

function captureCam() {
    
    // Define el objeto que se recoge (en este caso sin audio)
    let videoObj = {
        audio: false,
        video: {
            height: { max: 480 }
        }
    };

    // Se obtienen los permisos del navegador para usar la cámara del dispositivo
    navigator.mediaDevices.getUserMedia(videoObj)
        .then(function(mediaStreamObj) {
            //conecta el video con la cámara
            if ("srcObject" in video) {
                video.srcObject = mediaStreamObj;
            }
            else {
            //para versiones antiguas de navegadores
                video.src = window.URL.createObjectURL(mediaStreamObj);
            }
            
            video.onloadedmetadata = function(ev) {
            //mostrar el video en pantalla
                video.play();
            };

            // Uso de la biblioteca RecordRTC y se genera una condición: Sí "recording" es "true", se obtiene un elemento gif, en caso contrario, se recoge el elemento para convertirlo en un Blob (revisar la función "helperStopRecording" para la captación de data).
            if (recording === true){
                recorder = RecordRTC(mediaStreamObj, {
                    type: 'gif',
                    framerate: 1,
                    quality: 10,
                    width: 360,
                    hidden: 240,
        
                    onGifPreview: function(gifURL) {
                        console.log('El elemento se creó correctamente');
                    }
                })

                recorder.startRecording();
                recorder.camera = mediaStreamObj;
            } else {
                if(recorder){
                    recorder.stopRecording(helperStopRecording);
                }
            }
        })

        .catch(function(err){
            console.error(err.name, err.message);
        });
};


// ~ C R E A R - E L - A R C H I V O - G I F ~

function helperStopRecording(){

    // Esta función ayuda a detener la grabación y a obtener el archivo Blob
    recorder.camera.stop();
    blob = recorder.getBlob();
    
    //Oculta el video y recoge el Blob para su presentación como Gif
    video.classList.add('hiden');
    preview.src = URL.createObjectURL(blob);
};


// ~ C R E A R - E L - C R O N Ó M E T R O ~

function chronometer(){
    segundos ++;

    if(segundos < 10) segundos = `0` + segundos;

    if(segundos > 59) {
        segundos = `00`;
        minutos ++;
        if (minutos < 10) minutos = `0` + minutos;
    }

    if (minutos > 59){
        minutos = `00`;
        horas ++;
        if (horas < 10) horas = `0` + horas;
    }

    chronometerDisplay.textContent = `${horas}:${minutos}:${segundos}`;
};


// ~ A N I M A C I Ó N - B A R R A -  D E - C A R G A - (o p c i o n a l)~

function load (){
    const x = document.querySelectorAll(".prev_progress");
    x.forEach(ev =>{
        ev.classList.add("prueba_bar");
    });
};


// ~ A N I M A C I Ó N - B A R R A -  D E - C A R G A ~

//23 elementos

let animInterval;

function tempo(){
    let animate = document.querySelectorAll(".up_progress");

    setTimeout(() =>{
        animate.forEach(ev =>{
            ev.classList.add("prueba");
            console.log("ok");
        })
    }, 1000)
};


// ~ A P R O B A C I Ó N - D E - L A - C A P T U R A ~

let upload = async () =>{
    // Obtener el documento
    let form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    console.log(form.get('file'));

    // Modificación del contenedor
    cardVistaPrev.classList.add("hiden");
    cardUploadStatus.classList.remove("hiden");

    await fetch('https://upload.giphy.com/v1/gifs' + '?api_key=' + api_key,{
        method: 'POST',
        body: form,
    })
    .then(response => response.json() )
    .then(content =>{
        obtenerGifID = content.data.id;
        console.log(obtenerGifID);

        localStorage.setItem('UltimoGifPublicado', obtenerGifID);
        guardarLocalStge(obtenerGifID);

    }).catch(err =>{
        console.error(err);
    });

    setTimeout(() => {
        cardUploadStatus.classList.add("hiden");
        cardFinStatus.classList.remove("hiden");
        ultimoGif()
    }, 9000);

    console.log(obtenerGifID);
};


// ~ R E P E T I R - L A - C A P T U R A ~

function reload(){

    // Modificación del contenedor
    cardVistaPrev.classList.add("hiden");
    cardCheck.classList.remove("hiden");
    txtCapture.innerHTML = "Un Chequeo Antes de Empezar";
    startContainer.classList.remove("hiden");
    stopContainer.classList.add("hiden");
    video.classList.remove('hiden');
    
    // Le retorna el estado de "true" a "recording" y elimina el objeto recorder para crear uno nuevo.
    recording = true;   
    recorder.destroy();
    recorder = null;

    // Redefine los valores del cronómetro
    horas = `00`;
    minutos = `00`;
    segundos = `00`;
    chronometerDisplay.textContent = `${horas}:${minutos}:${segundos}`;
};

// ~ A P R O B A D O - Y - F I N A L - D E - C A P T U R A ~

function finalReady(){
    // Modificación del contenedor
    cardFinStatus.classList.add("hiden");
    gifsPropios();
};


// ~ O B T E N E R - G I F - A C T U A L ~

function ultimoGif(){
    
    cardFinStatus.classList.remove("hiden");
    let gifGuardado = obtenerGifID;

    fetch(`https://api.giphy.com/v1/gifs/${gifGuardado}?api_key=${api_key}`)
    .then(res =>{
        return res.json();
    })
    .then(content => {
        const contenedorImg = document.getElementById("final_res");
        const secBtns = document.getElementById("botones_final");

        const imgGifo = document.createElement("img");
        // Definición de propiedades de la imagen
            imgGifo.src = content.data.images.downsized_large.url;
            imgGifo.alt = 'Gif creado con éxito';
        contenedorImg.insertBefore(imgGifo, secBtns);
        gif_url = content.data.images.downsized_large.url;
    })
    .catch( err => {
        console.error(err);
    })
};

// ~ O B T E N E R - G I F - A C T U A L ~

let guardarLocalStge = gifoId =>{
    let guardados = localStorage.getItem('ids');
    guardados != null ? localStorage.setItem('ids', `${guardados}, ${gifoId}`) : localStorage.setItem('ids', gifoId);
};

// ~ P R E S E N T A C I Ó N - D E - L O S - G I F S ~

function gifsPropios(){
    misGifos.classList.remove("hiden");
    let gif_id = localStorage.getItem("ids");

    fetch(`https://api.giphy.com/v1/gifs?ids=${gif_id}&api_key=${api_key}`)
    .then(res => res.json())
    .then(content =>{
        console.log(content.data);
        content.data.forEach(gifo =>{
            const divImg = document.createElement("div");
            const contGifos = document.getElementById("pres_gifos");

            contGifos.appendChild(divImg);
            
            let imgGifOs = document.createElement("img");
            imgGifOs.src = gifo.images.downsized_large.url;
            imgGifOs.alt = gifo.title;

            divImg.appendChild(imgGifOs);
        });
    })
};
//------------------------------------ D E F I N I C I Ó N - D E - E V E N T O S --------------------------------------- //

// ~ E V E N T O - Q U E - I N I C I A - L A - G R A B A C I Ó N ~

btnStartRecording.addEventListener('click', ev =>{
    
    //Modificación del contenedor
    txtCapture.innerHTML = "Capturando Tu Guifo";
    startContainer.classList.add("hiden");
    stopContainer.classList.remove("hiden");

    //Se modifica el estado de "recording" a "true" para aprovechar la cohersión.
    recording = true;
    captureCam();

    //Se llama a la función del cronómetro y se le indica el tiempo de inicio.
    chronometerCall = setInterval(chronometer, 1000);
});


// ~ E V E N T O - Q U E - F I N A L I Z A - L A - G R A B A C I Ó N ~

btnStopRecording.addEventListener('click', ev =>{

    //Modificación del contenedor
    btnStopRecording.classList.add("hiden");
    cardCheck.classList.add("hiden");
    cardVistaPrev.classList.remove("hiden");


    //Se modifica el estado de "recording" a "false" para aprovechar detener la grabación y obtener el blob.
    recording = false;
    captureCam();
    
    //Detiene el contador y entrega el resultado a la siguiente card.
    clearInterval(chronometerCall);
    const finalCronometro = document.getElementById("prueba_cronom");
    finalCronometro.textContent = `${horas}:${minutos}:${segundos}`;
});

// ~ E V E N T O -  Q U E - C O P I A - E L - L I N K - A L - P O R T A P A P E L E S ~

btnCopyLink.addEventListener('click', ev =>{
    navigator.clipboard.writeText(gif_url);
    alert("¡Link copiado al portapapeles!");
});

// ~ E V E N T O - Q U E - D E S C A R G A - E L - G I F ~

btnDownload.addEventListener('click', ev =>{
    invokeSaveAsDialog(blob, "MyGif.gif");
});

