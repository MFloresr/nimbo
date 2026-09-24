/**
 * Unidad de temperatura elegida (°C o °F), compartida por toda la página y
 * recordada en el navegador. En el servidor siempre es °C.
 */
export type Unidad = 'C' | 'F';

const CLAVE = 'nimbo-unidad';

export const preferencias = $state<{ unidad: Unidad }>({ unidad: 'C' });

export function cargarUnidad() {
	try {
		const guardada = localStorage.getItem(CLAVE);
		if (guardada === 'C' || guardada === 'F') preferencias.unidad = guardada;
	} catch {
		// Navegador sin almacenamiento: se queda en °C
	}
}

export function cambiarUnidad(unidad: Unidad) {
	preferencias.unidad = unidad;
	try {
		localStorage.setItem(CLAVE, unidad);
	} catch {
		// Sin almacenamiento: la elección dura hasta recargar
	}
}
