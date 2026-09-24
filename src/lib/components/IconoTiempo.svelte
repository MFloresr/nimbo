<!-- Icono de línea para un tipo de tiempo (horas, días). Toma el color del texto. -->
<script lang="ts">
	import type { Icono } from '$lib/meteo';

	let { tipo, tam = 32 }: { tipo: Icono; tam?: number } = $props();

	const NUBE = 'M58 150h88a34 34 0 0 0 4-67.8a46 46 0 0 0-88.6 8.6A30 30 0 0 0 58 150z';
	const NUBE_BAJA = 'M58 126h88a34 34 0 0 0 4-67.8a46 46 0 0 0-88.6 8.6A30 30 0 0 0 58 126z';

	const TRAZOS: Record<Icono, string> = {
		sol: 'M100 62a38 38 0 1 0 0 76a38 38 0 1 0 0-76M100 18v18M100 164v18M18 100h18M164 100h18M42 42l13 13M145 145l13 13M42 158l13-13M145 55l13-13',
		nube: NUBE,
		lluvia: NUBE_BAJA + 'M76 152l-8 22M104 152l-8 22M132 152l-8 22',
		luna: 'M130 146A56 56 0 1 1 112 46A51 51 0 0 0 130 146z',
		nieve: NUBE_BAJA + 'M72 158v1M100 172v1M128 158v1',
		niebla: 'M58 104h88a34 34 0 0 0 4-67.8a46 46 0 0 0-88.6 8.6A30 30 0 0 0 58 104zM36 136h128M52 166h96',
		tormenta: NUBE_BAJA + 'M108 140l-18 28h24l-16 26'
	};
</script>

<svg
	width={tam}
	height={tam}
	viewBox="0 0 200 200"
	fill="none"
	stroke="currentColor"
	stroke-width="12"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d={TRAZOS[tipo]} />
</svg>
