import { describe, expect, it } from 'vitest';
import {
	condicion,
	convertir,
	enlaceLugar,
	fechaLarga,
	grados,
	icono,
	puntoCardinal,
	textoUV,
	type RespuestaPrevision
} from './meteo';

describe('condicion (tema de colores)', () => {
	it('despejado de día es soleado y de noche es noche', () => {
		expect(condicion(0, true)).toBe('soleado');
		expect(condicion(0, false)).toBe('noche');
	});
	it('nubes de día es nublado', () => {
		expect(condicion(3, true)).toBe('nublado');
		expect(condicion(45, true)).toBe('nublado');
	});
	it('lluvia, chubascos y tormenta usan el tema de lluvia a cualquier hora', () => {
		expect(condicion(63, true)).toBe('lluvia');
		expect(condicion(81, false)).toBe('lluvia');
		expect(condicion(95, true)).toBe('lluvia');
	});
	it('nieve usa el tema de nieve', () => {
		expect(condicion(73, true)).toBe('nieve');
		expect(condicion(86, false)).toBe('nieve');
	});
});

describe('icono', () => {
	it('elige sol o luna según la hora', () => {
		expect(icono(1, true)).toBe('sol');
		expect(icono(1, false)).toBe('luna');
	});
	it('distingue niebla y tormenta', () => {
		expect(icono(48)).toBe('niebla');
		expect(icono(99)).toBe('tormenta');
	});
});

describe('utilidades', () => {
	it('convierte grados a punto cardinal', () => {
		expect(puntoCardinal(0)).toBe('N');
		expect(puntoCardinal(44)).toBe('NE');
		expect(puntoCardinal(225)).toBe('SO');
		expect(puntoCardinal(350)).toBe('N');
		expect(puntoCardinal(-90)).toBe('O');
	});
	it('describe el índice UV', () => {
		expect(textoUV(1)).toBe('Bajo');
		expect(textoUV(5.9)).toBe('Moderado');
		expect(textoUV(9)).toBe('Muy alto');
		expect(textoUV(12)).toBe('Extremo');
	});
	it('muestra la temperatura en °C o °F', () => {
		expect(grados(21.4, 'C')).toBe('21°');
		expect(grados(0, 'F')).toBe('32°');
		expect(grados(-0.3, 'C')).toBe('0°');
	});
	it('lee la fecha local sin cambiar de zona horaria', () => {
		expect(fechaLarga('2026-09-23T15:40')).toBe('Miércoles, 23 de septiembre · 15:40');
		expect(fechaLarga('2026-01-01T00:15')).toBe('Jueves, 1 de enero · 00:15');
	});
	it('crea el enlace de un lugar', () => {
		const enlace = enlaceLugar({ nombre: 'Lleida', detalle: 'Cataluña, España', lat: 41.61674, lon: 0.62218 });
		expect(enlace).toBe('/?lat=41.6167&lon=0.6222&lugar=Lleida&detalle=Catalu%C3%B1a%2C+Espa%C3%B1a');
	});
});

describe('convertir', () => {
	const horas = Array.from({ length: 48 }, (_, i) => {
		const d = new Date(Date.UTC(2026, 8, 23, i));
		return d.toISOString().slice(0, 13) + ':00';
	});
	const respuesta: RespuestaPrevision = {
		current: {
			time: '2026-09-23T15:30',
			temperature_2m: 30.6,
			apparent_temperature: 32.2,
			relative_humidity_2m: 28,
			is_day: 1,
			weather_code: 0,
			wind_speed_10m: 11.6,
			wind_direction_10m: 45,
			pressure_msl: 1016.4,
			uv_index: 6.2
		},
		hourly: {
			time: horas,
			temperature_2m: horas.map((_, i) => 20 + (i % 10)),
			precipitation_probability: horas.map((_, i) => (i === 17 ? null : i)),
			weather_code: horas.map(() => 0),
			is_day: horas.map((h) => (Number(h.slice(11, 13)) >= 8 && Number(h.slice(11, 13)) < 20 ? 1 : 0))
		},
		daily: {
			time: ['2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27', '2026-09-28', '2026-09-29'],
			weather_code: [0, 3, 61, 0, 71, 45, 95],
			temperature_2m_max: [34, 32, 28, 30, 5, 22, 25],
			temperature_2m_min: [19, 18, 16, 17, -2, 14, 15],
			sunrise: ['2026-09-23T08:02', '', '', '', '', '', ''],
			sunset: ['2026-09-23T20:11', '', '', '', '', '', '']
		}
	};
	const t = convertir(respuesta);

	it('toma el tiempo actual', () => {
		expect(t.condicion).toBe('soleado');
		expect(t.descripcion).toBe('Despejado');
		expect(t.temp).toBe(30.6);
		expect(t.viento).toBe(12);
		expect(t.direccionViento).toBe('NE');
		expect(t.presion).toBe(1016);
		expect(t.uvTexto).toBe('Alto');
		expect(t.amanecer).toBe('08:02');
		expect(t.atardecer).toBe('20:11');
		expect(t.fecha).toBe('Miércoles, 23 de septiembre · 15:30');
	});
	it('empieza las próximas horas en la hora en curso', () => {
		expect(t.horas).toHaveLength(8);
		expect(t.horas[0]).toMatchObject({ etiqueta: 'Ahora', temp: 30.6, probLluvia: 15 });
		expect(t.horas[1].etiqueta).toBe('16:00');
		expect(t.horas[2].probLluvia).toBe(0);
		expect(t.horas[5].icono).toBe('luna');
	});
	it('nombra los días de la semana', () => {
		expect(t.dias.map((d) => d.etiqueta)).toEqual(['Hoy', 'Jue', 'Vie', 'Sáb', 'Dom', 'Lun', 'Mar']);
		expect(t.dias.map((d) => d.icono)).toEqual(['sol', 'nube', 'lluvia', 'sol', 'nieve', 'niebla', 'tormenta']);
	});
});
