/**
 * 2C = Two of Clubs
 * 2D = Two of Diamonds
 * 2H = Two of Hearts
 * 2S = Two of Spades
 */

//patron modulo
const miModulo = (() => {
    'use strict'
    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];
    let puntosJugadores = [];


    //referencias del html
    const btnPedir = document.querySelector('#btnPedir'),  //boton pedir
        btnDetener = document.querySelector('#btnDetener'),
        btnNuevoJuego = document.querySelector('#btnNuevo');

    const puntosHTML = document.querySelectorAll('small'),
    divCartasJugadores = document.querySelectorAll('.divCartas');

    //iniciar juego, el utlimo jugador siempre es la computadora
    const iniciarJuego = (numJugadores = 2) => {        
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
        puntosHTML.forEach( elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');
        btnPedir.disabled = false;
        btnDetener.disabled = false;

    }

    // Esta función crea un nuevo deck
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }
        return _.shuffle(deck);
    }

    // Esta función me permite tomar una carta
    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        return deck.shift();
    }

    //funcion para obtener el valor de una carta
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor) == false) ? valor * 1 : (valor === 'A') ? 11 : 10;
    }

    //turno 0 = 1er jugador ... ultimo es la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    //Funcion para agregar las imagenes de las cartas al HTML
    const crearCarta = (carta, turno) => {
            // <img class="carta" src="assets/cartas/2C.png">
            const imgCarta = document.createElement('img');
            imgCarta.src = `assets/cartas/${carta}.png`;
            imgCarta.classList.add('carta');
            divCartasJugadores[turno].append(imgCarta);
    }
    
    const determinarGanador = () => {
        const [ puntosMinimos, puntosComputadora] = puntosJugadores;
        setTimeout(() => {
            //verificar ganador
            if (puntosComputadora === puntosMinimos) {
                alert('Empate...');
            } else if (puntosMinimos > 21) {
                alert('Ganador: Computadora...');
            } else if (puntosComputadora > 21) {
                alert('Ganador: Jugador...');
            } else {
                alert('Ganador: Computadora...');
            }
        }, 400);
    }
    //logica de la computadora, igualar o superar el valor de puntos del usuario
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0; 
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta,puntosJugadores.length-1);
            crearCarta(carta,puntosJugadores.length-1);
        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));
        determinarGanador();
    }

    //eventos
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta,0);
        crearCarta(carta,0);
    
        //controlar los puntos si se pasa de 21 terminar 
        if (puntosJugador > 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            console.warn('Perdiste');
            turnoComputadora(puntosJugador);

        } else if (puntosJugador === 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            console.warn('Llegaste a 21...turno computadora');
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {
        //desactivar los otros botones y llamar al turno de la computador
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevoJuego.addEventListener('click', () => {
        iniciarJuego();
    });

    return {
        nuevoJuego: iniciarJuego
    };
})();

