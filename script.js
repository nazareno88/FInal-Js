let listaZapatillas = [
{id:8 , nombre:"Adidas Campus", marca: "Adidas", rutaImagen:"adidas-campus.jpg", precio:172000, stock:6 },
{id:12, nombre:"Jordan 3 Lucky Green" ,marca:"Nike" ,rutaImagen:"Jordan-3.png" ,precio:360000 ,stock:8},
{id:22, nombre:"Jordan 6 Tinker (2018)",marca:"Nike", rutaImagen:"jordan-6-2.jpg", precio:450000, stock:3},
{id:87, nombre:"Vans Knu Skool" ,marca:"Vans",rutaImagen:"vans.jpg", precio:190000, stock:12 },
{id:9, nombre:"Suade XL", marca:"Puma", rutaImagen:"suadexl.jpg", precio:160000, stock:9 },
{id:11, nombre:"Yezzy 350" ,marca:"Adidas", rutaImagen:"yezzy.jpg", precio:300000, stock:6 },
{id:24, nombre:"Dunk SB",marca:"Nike", rutaImagen:"nike-dunk.webp", precio:190000, stock:3 },  
];

principal(listaZapatillas);

/*Funcion Principal*/
function principal(zapatillas){
   let carrito = obtenerCarritoLS();

    const botonBuscar = document.querySelector("#boton-buscar");
    botonBuscar.addEventListener("click", (e)=> filtrarYCrearContainer(zapatillas));
    crearContainerZapatillas(zapatillas);
    
    let botonComprar = document.getElementById("boton-comprar");
    botonComprar.addEventListener("click",finalizarCompra);
    
    let botonVaciarCarrito = document.getElementById("boton-vc");
    botonVaciarCarrito.addEventListener("click",vaciarCarrito);
    
   
    let verCarrito = document.getElementById("ver-carrito");
    verCarrito.addEventListener("click", mostrarCarrito);

};

function mostrarCarrito(e){
    let contenedorProductos = document.getElementById("productos-container");
    let contenedorCarrito = document.getElementById("carrito-container");
    let botonComprar = document.getElementById("boton-comprar");
    let botonVaciarCarrito = document.getElementById("boton-vc");

    contenedorProductos.classList.toggle("ocultar-productos");
    contenedorCarrito.classList.toggle("ocultar");
    botonComprar.classList.toggle("ocultar");
    botonVaciarCarrito.classList.toggle("ocultar");
};

function obtenerCarritoLS(){
    let carrito = [];
    let carritoLS = JSON.parse(localStorage.getItem("carrito"));
    if(carritoLS){
       carrito = carritoLS
    };
    return carrito
};

function finalizarCompra(){
localStorage.removeItem("carrito")
const contenedorCarrito = document.getElementById("carrito-container");
    contenedorCarrito.innerHTML = "";
};

function vaciarCarrito(){
    localStorage.removeItem("carrito")
    const contenedorCarrito = document.getElementById("carrito-container");
        contenedorCarrito.innerHTML = "";
    };
    

/*Funcion Filtrar y Crear Container*/
function filtrarYCrearContainer(zapatillas){
    let zapatillasFiltradas = filtrarZapatillas(zapatillas);
    crearContainerZapatillas(zapatillasFiltradas);
};

/*Funcion Crear Container*/
function crearContainerZapatillas(zapatillas){
    let carrito = obtenerCarritoLS();
    let contenedorProductos= document.getElementById("productos-container");
    contenedorProductos.innerHTML = "";
    
    zapatillas.forEach(zapatilla =>{
        let tarjetaProducto = document.createElement("div");
        tarjetaProducto.className = ("card-producto");
        
        tarjetaProducto.innerHTML = 
        `<h3>${zapatilla.nombre}</h3>
        <img src="./assets/images/${zapatilla.rutaImagen}"/>
        <p>Precio:${zapatilla.precio}</p>
        <button id=${zapatilla.id}>Agregar al carrito</button>`
        
        
        contenedorProductos.appendChild(tarjetaProducto);
      
        
        let botonCarrito = document.getElementById(zapatilla.id);
        botonCarrito.addEventListener("click", (e)=>agregarAlCarrito(e,zapatillas));

    });
};

/* Funcion Filtrar Zapatillas*/ 
function filtrarZapatillas(zapatillas){
    let inputBusqueda = document.getElementById("input-busqueda").value.toLowerCase();
    return zapatillas.filter(zapatilla=>zapatilla.nombre.toLowerCase().includes(inputBusqueda)|| zapatilla.marca.toLowerCase().includes(inputBusqueda));                                      
};


/*Funcion Agregar Al Carrito*/
function agregarAlCarrito(e,zapatillas){
    let carrito = obtenerCarritoLS();
  let idZapatilla = Number(e.target.id);

  let zapatillaEnCarrito = carrito.findIndex(zapatilla=>zapatilla.id === idZapatilla);
  let zapatillaBuscada = zapatillas.find(zapatilla => zapatilla.id === idZapatilla);
  
  if(zapatillaEnCarrito !== -1){
    carrito[zapatillaEnCarrito].unidades++;
    carrito[zapatillaEnCarrito].subtotal = carrito[zapatillaEnCarrito].precio*carrito[zapatillaEnCarrito].unidades;
  }else{
    carrito.push({
        id:zapatillaBuscada.id,
        nombre:zapatillaBuscada.nombre,
        precio:zapatillaBuscada.precio,
        unidades: 1,
        subtotal: zapatillaBuscada.precio
    });
  };

  generarCarrito(carrito);
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

/*Funcion Generar Carrito */
function generarCarrito(carrito){
    let contenedorCarrito =  document.getElementById("carrito-container");
    contenedorCarrito.innerHTML="";
    carrito.forEach(zapatilla=>{
        let cardCarrito = document.createElement("div");
        cardCarrito.className = "carrito-box";
        cardCarrito.innerHTML = `
        <p>${zapatilla.nombre}</p>
        <p>${zapatilla.precio}</p>
        <div class="unidades">
        <button id=dec${zapatilla.id}>-</button>
        <p>${zapatilla.unidades}</p>
        <button id=inc${zapatilla.id}>+</button>
        </div>
        <p>${zapatilla.subtotal}</p>
        <button id=eliminar${zapatilla.id}>Eliminar</button>`
        contenedorCarrito.appendChild(cardCarrito);

        let botonDec = document.getElementById("dec"+zapatilla.id);
        botonDec.addEventListener("click", decrementarUnidades)

        let botonEliminar = document.getElementById("eliminar"+ zapatilla.id);
            botonEliminar.addEventListener("click", eliminarProductoCarrito);

         let botonInc = document.getElementById("inc"+zapatilla.id);
        botonInc.addEventListener("click", incrementarUnidades);
    });
};

function eliminarProductoCarrito(e){
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(8));
    carrito = carrito.filter(zapatilla=>zapatilla.id!==id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    e.target.parentElement.remove();
    generarCarrito(carrito)
};

function decrementarUnidades(e){
    let carrito = obtenerCarritoLS();
    let id = Number(e.target.id.substring(3));
    let productoEnCarrito = carrito.findIndex(zapatilla=>zapatilla.id===id);

if(carrito[productoEnCarrito].unidades===1){
    carrito.splice(productoEnCarrito,1);
}else{
    carrito[productoEnCarrito].unidades--;
    carrito[productoEnCarrito].subtotal = carrito[productoEnCarrito].unidades * carrito[productoEnCarrito].precio;
};
localStorage.setItem("carrito",JSON.stringify(carrito));
generarCarrito(carrito);
};

function incrementarUnidades(e){
    let carrito = obtenerCarritoLS();
    let id = Number(e.target.id.substring(3));
    let productoEnCarrito = carrito.findIndex(zapatilla=>zapatilla.id===id);

    carrito[productoEnCarrito].unidades++;
    carrito[productoEnCarrito].subtotal = carrito[productoEnCarrito].unidades * carrito[productoEnCarrito].precio;

localStorage.setItem("carrito",JSON.stringify(carrito));
generarCarrito(carrito);

};