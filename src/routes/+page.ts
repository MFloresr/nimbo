import {
	LUGAR_INICIAL,
	buscarLugares,
	obtenerTiempo,
	type Lugar,
	type Tiempo
} from '$lib/meteo';
import type { PageLoad } from './$types';

/**
 * Decide el lugar a partir de la URL y pide su previsión:
 *  - ?q=texto        busca el lugar y usa el primer resultado (los demás se ofrecen como alternativas)
 *  - ?lat=&lon=      coordenadas exactas (enlaces de resultados o ubicación del navegador)
 *  - sin parámetros  Madrid
 */
export const load: PageLoad = async ({ fetch, url, setHeaders }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	let lugar: Lugar = LUGAR_INICIAL;
	let alternativas: Lugar[] = [];
	let aviso = '';

	try {
		if (q) {
			const encontrados = await buscarLugares(fetch, q);
			if (encontrados.length > 0) {
				[lugar, ...alternativas] = encontrados;
			} else {
				aviso = `No hemos encontrado «${q}». Prueba con otro nombre o añade el país.`;
			}
		} else {
			const lat = Number(url.searchParams.get('lat'));
			const lon = Number(url.searchParams.get('lon'));
			const valido =
				url.searchParams.has('lat') &&
				url.searchParams.has('lon') &&
				Number.isFinite(lat) &&
				Number.isFinite(lon) &&
				Math.abs(lat) <= 90 &&
				Math.abs(lon) <= 180;
			if (valido) {
				lugar = {
					nombre: url.searchParams.get('lugar')?.slice(0, 80) || 'Lugar elegido',
					detalle: url.searchParams.get('detalle')?.slice(0, 120) ?? '',
					lat,
					lon
				};
			}
		}

		const tiempo: Tiempo = await obtenerTiempo(fetch, lugar);
		// Open-Meteo actualiza cada 15 minutos: la CDN de Vercel guarda la página 10
		setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=300' });
		return { lugar, tiempo, alternativas, busqueda: q, aviso, error: '' };
	} catch {
		return {
			lugar,
			tiempo: null,
			alternativas,
			busqueda: q,
			aviso,
			error: 'No hemos podido cargar el tiempo ahora mismo. Vuelve a intentarlo en unos segundos.'
		};
	}
};
