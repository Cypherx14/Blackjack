/**
 * 2C = Two of Clubs
 * 2D = Two of Diamonds
 * 2H = Two of Hearts
 * 2S = Two of Spades
 */

//patron modulo
(() => {
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
        divCartasJugador = document.querySelector('#jugador-cartas'),
        divCartasComputadora = document.querySelector('#computadora-cartas');

    //iniciar juego, el utlimo jugador siempre es la computadora
    const iniciarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
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
    const acumularPuntos = (turno, carta) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    //logica de la computadora, igualar o superar el valor de puntos del usuario
    const turnoComputadora = (puntosMinimos) => {
        do {
            const carta = pedirCarta();
            acumularPuntos(puntosJugadores.length-1,carta);

            //agregar las imagenes de las cartas
            // <img class="carta" src="assets/cartas/2C.png">
            const imgCarta = document.createElement('img');
            imgCarta.src = `assets/cartas/${carta}.png`;
            imgCarta.classList.add('carta');
            divCartasComputadora.append(imgCarta);
            if (puntosMinimos > 21) {
                break;
            }
        } while ((puntosComputadora <= puntosMinimos) && (puntosMinimos <= 21));

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



    //eventos
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(0,carta);
        
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugador.append(imgCarta);
        //controlar los puntos si se pasa de 21 terminar 
        if (puntosJugador > 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            console.warn('Perdiste');
            btnPedir.disabled = true;
            turnoComputadora(puntosJugador);

        } else if (puntosJugador === 21) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            console.warn('Llegaste a 21...turno computadora');
            turnoComputadora(puntosJugador);
            //verificar si la computadora le empata

        }
    });

    btnDetener.addEventListener('click', () => {
        //desactivar los otros botones y llamar al turno de la computador
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugador);
    });

    btnNuevoJuego.addEventListener('click', () => {
        //resetear el deck 
        deck = [];
        crearDeck();
        puntosJugador = 0;
        puntosComputadora = 0;
        puntosHTML[0].innerText = 0;
        puntosHTML[1].innerText = 0;

        //eliminar las imagenes
        divCartasComputadora.innerHTML = ''
        divCartasJugador.innerHTML = ''

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    });
})

