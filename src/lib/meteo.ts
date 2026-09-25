/**
 * Acceso a Open-Meteo (previsión y buscador de lugares) y conversión de su
 * respuesta al formato que pinta la interfaz. Sin clave de API.
 * Datos: Open-Meteo.com, licencia CC BY 4.0.
 */

export type Condicion = 'soleado' | 'nublado' | 'lluvia' | 'noche' | 'nieve';
export type Icono = 'sol' | 'nube' | 'lluvia' | 'luna' | 'nieve' | 'niebla' | 'tormenta';

export interface Lugar {
	nombre: string;
	detalle: string;
	lat: number;
	lon: number;
}

export interface Hora {
	etiqueta: string;
	temp: number;
	probLluvia: number;
	icono: Icono;
}

export interface Dia {
	etiqueta: string;
	max: number;
	min: number;
	icono: Icono;
}

export interface Tiempo {
	condicion: Condicion;
	icono: Icono;
	descripcion: string;
	fecha: string;
	temp: number;
	sensacion: number;
	max: number;
	min: number;
	viento: number;
	direccionViento: string;
	humedad: number;
	uv: number;
	uvTexto: string;
	presion: number;
	amanecer: string;
	atardecer: string;
	horas: Hora[];
	dias: Dia[];
}

/** Madrid, el lugar que se muestra si no se elige otro. */
export const LUGAR_INICIAL: Lugar = {
	nombre: 'Madrid',
	detalle: 'Comunidad de Madrid, España',
	lat: 40.4165,
	lon: -3.7026
};

const PREVISION = 'https://api.open-meteo.com/v1/forecast';
const GEOCODIFICACION = 'https://geocoding-api.open-meteo.com/v1/search';

/** Descripción en castellano de cada código WMO que usa Open-Meteo. */
const DESCRIPCIONES: Record<number, string> = {
	0: 'Despejado',
	1: 'Casi despejado',
	2: 'Parcialmente nublado',
	3: 'Nublado',
	45: 'Niebla',
	48: 'Niebla con escarcha',
	51: 'Llovizna débil',
	53: 'Llovizna',
	55: 'Llovizna intensa',
	56: 'Llovizna helada',
	57: 'Llovizna helada intensa',
	61: 'Lluvia débil',
	63: 'Lluvia moderada',
	65: 'Lluvia fuerte',
	66: 'Lluvia helada',
	67: 'Lluvia helada fuerte',
	71: 'Nevadas débiles',
	73: 'Nevadas',
	75: 'Nevadas fuertes',
	77: 'Granizo fino',
	80: 'Chubascos débiles',
	81: 'Chubascos',
	82: 'Chubascos fuertes',
	85: 'Chubascos de nieve',
	86: 'Chubascos de nieve fuertes',
	95: 'Tormenta',
	96: 'Tormenta con granizo',
	99: 'Tormenta con granizo fuerte'
};

export function descripcion(codigo: number): string {
	return DESCRIPCIONES[codigo] ?? 'Tiempo variable';
}

function esNieve(codigo: number): boolean {
	return (codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86;
}

function esLluvia(codigo: number): boolean {
	return (codigo >= 51 && codigo <= 67) || (codigo >= 80 && codigo <= 82) || codigo >= 95;
}

/** Tema de colores de la página según el tiempo actual. */
export function condicion(codigo: number, esDeDia: boolean): Condicion {
	if (esNieve(codigo)) return 'nieve';
	if (esLluvia(codigo)) return 'lluvia';
	if (!esDeDia) return 'noche';
	if (codigo <= 1) return 'soleado';
	return 'nublado';
}

/** Dibujo que representa un código WMO, de día o de noche. */
export function icono(codigo: number, esDeDia = true): Icono {
	if (codigo >= 95) return 'tormenta';
	if (esNieve(codigo)) return 'nieve';
	if (esLluvia(codigo)) return 'lluvia';
	if (codigo === 45 || codigo === 48) return 'niebla';
	if (codigo <= 1) return esDeDia ? 'sol' : 'luna';
	return 'nube';
}

const PUNTOS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];

/** Grados (0 = norte) a punto cardinal en castellano. */
export function puntoCardinal(grados: number): string {
	const i = Math.round((((grados % 360) + 360) % 360) / 45) % 8;
	return PUNTOS[i];
}

export function textoUV(uv: number): string {
	if (uv < 3) return 'Bajo';
	if (uv < 6) return 'Moderado';
	if (uv < 8) return 'Alto';
	if (uv < 11) return 'Muy alto';
	return 'Extremo';
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = [
	'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
	'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

/**
 * Open-Meteo devuelve la hora local del lugar sin zona ("2026-09-25T15:40").
 * Se lee a mano para no mezclarla con la zona horaria del servidor o del navegador.
 */
function partes(iso: string) {
	const [fecha, hora = '00:00'] = iso.split('T');
	const [a, m, d] = fecha.split('-').map(Number);
	const diaSemana = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
	return { a, m, d, diaSemana, hora: hora.slice(0, 5) };
}

export function fechaLarga(iso: string): string {
	const p = partes(iso);
	const dia = DIAS[p.diaSemana];
	return `${dia[0].toUpperCase()}${dia.slice(1)}, ${p.d} de ${MESES[p.m - 1]} · ${p.hora}`;
}

/** Forma de la respuesta de Open-Meteo que usa la app. */
export interface RespuestaPrevision {
	current: {
		time: string;
		temperature_2m: number;
		apparent_temperature: number;
		relative_humidity_2m: number;
		is_day: number;
		weather_code: number;
		wind_speed_10m: number;
		wind_direction_10m: number;
		pressure_msl: number;
		uv_index: number;
	};
	hourly: {
		time: string[];
		temperature_2m: number[];
		precipitation_probability: (number | null)[];
		weather_code: number[];
		is_day: number[];
	};
	daily: {
		time: string[];
		weather_code: number[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
		sunrise: string[];
		sunset: string[];
	};
}

/** Convierte la respuesta de Open-Meteo en lo que pinta la interfaz. */
export function convertir(r: RespuestaPrevision): Tiempo {
	const c = r.current;
	const deDia = c.is_day === 1;

	// Próximas 8 horas empezando por la hora en curso
	const horaActual = c.time.slice(0, 13) + ':00';
	let inicio = r.hourly.time.indexOf(horaActual);
	if (inicio < 0) inicio = 0;
	const horas: Hora[] = [];
	for (let i = inicio; i < Math.min(inicio + 8, r.hourly.time.length); i++) {
		horas.push({
			etiqueta: i === inicio ? 'Ahora' : partes(r.hourly.time[i]).hora,
			temp: i === inicio ? c.temperature_2m : r.hourly.temperature_2m[i],
			probLluvia: r.hourly.precipitation_probability[i] ?? 0,
			// "Ahora" usa el dato actual, igual que la tarjeta principal
			icono:
				i === inicio
					? icono(c.weather_code, deDia)
					: icono(r.hourly.weather_code[i], r.hourly.is_day[i] === 1)
		});
	}

	const dias: Dia[] = r.daily.time.map((t, i) => ({
		etiqueta: i === 0 ? 'Hoy' : DIAS_CORTOS[partes(t).diaSemana],
		max: r.daily.temperature_2m_max[i],
		min: r.daily.temperature_2m_min[i],
		icono: icono(r.daily.weather_code[i])
	}));

	return {
		condicion: condicion(c.weather_code, deDia),
		icono: icono(c.weather_code, deDia),
		descripcion: descripcion(c.weather_code),
		fecha: fechaLarga(c.time),
		temp: c.temperature_2m,
		sensacion: c.apparent_temperature,
		max: r.daily.temperature_2m_max[0],
		min: r.daily.temperature_2m_min[0],
		viento: Math.round(c.wind_speed_10m),
		direccionViento: puntoCardinal(c.wind_direction_10m),
		humedad: Math.round(c.relative_humidity_2m),
		uv: Math.round(c.uv_index),
		uvTexto: textoUV(c.uv_index),
		presion: Math.round(c.pressure_msl),
		amanecer: partes(r.daily.sunrise[0]).hora,
		atardecer: partes(r.daily.sunset[0]).hora,
		horas,
		dias
	};
}

type Fetch = typeof fetch;

export async function obtenerTiempo(f: Fetch, lugar: Lugar): Promise<Tiempo> {
	const q = new URLSearchParams({
		latitude: String(lugar.lat),
		longitude: String(lugar.lon),
		current: [
			'temperature_2m', 'apparent_temperature', 'relative_humidity_2m', 'is_day',
			'weather_code', 'wind_speed_10m', 'wind_direction_10m', 'pressure_msl', 'uv_index'
		].join(','),
		hourly: 'temperature_2m,precipitation_probability,weather_code,is_day',
		daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
		timezone: 'auto',
		forecast_days: '7',
		forecast_hours: '48'
	});
	const res = await f(`${PREVISION}?${q}`);
	if (!res.ok) throw new Error(`Open-Meteo respondió ${res.status}`);
	return convertir(await res.json());
}

interface ResultadoGeo {
	name: string;
	latitude: number;
	longitude: number;
	country?: string;
	admin1?: string;
}

/** Busca lugares por nombre (hasta 6 resultados, en castellano). */
export async function buscarLugares(f: Fetch, texto: string): Promise<Lugar[]> {
	const q = new URLSearchParams({ name: texto, count: '6', language: 'es', format: 'json' });
	const res = await f(`${GEOCODIFICACION}?${q}`);
	if (!res.ok) throw new Error(`Open-Meteo respondió ${res.status}`);
	const datos: { results?: ResultadoGeo[] } = await res.json();
	return (datos.results ?? []).map((r) => ({
		nombre: r.name,
		detalle: [r.admin1, r.country].filter(Boolean).join(', '),
		lat: r.latitude,
		lon: r.longitude
	}));
}

/** Enlace de la página para un lugar (así se puede compartir o guardar). */
export function enlaceLugar(l: Lugar): string {
	const q = new URLSearchParams({
		lat: l.lat.toFixed(4),
		lon: l.lon.toFixed(4),
		lugar: l.nombre,
		detalle: l.detalle
	});
	return `/?${q}`;
}

/** Temperatura redondeada en la unidad elegida, con el símbolo de grado. */
export function grados(celsius: number, unidad: 'C' | 'F'): string {
	const v = unidad === 'F' ? (celsius * 9) / 5 + 32 : celsius;
	return `${Math.round(v)}°`;
}
