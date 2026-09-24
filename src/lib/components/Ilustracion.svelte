<!-- Dibujo grande del tiempo actual, con los colores del tema. -->
<script lang="ts">
	import type { Icono } from '$lib/meteo';

	let { tipo }: { tipo: Icono } = $props();

	const NUBE = 'M58 150h88a34 34 0 0 0 4-67.8a46 46 0 0 0-88.6 8.6A30 30 0 0 0 58 150z';
	const NUBE_BAJA = 'M58 126h88a34 34 0 0 0 4-67.8a46 46 0 0 0-88.6 8.6A30 30 0 0 0 58 126z';
	const RAYOS =
		'M100 16v22M100 162v22M16 100h22M162 100h22M40.6 40.6l15.6 15.6M143.8 143.8l15.6 15.6M40.6 159.4l15.6-15.6M143.8 56.2l15.6-15.6';
</script>

<svg width="100%" height="100%" viewBox="0 0 200 200" aria-hidden="true">
	{#if tipo === 'sol'}
		<circle cx="100" cy="100" r="44" fill="var(--n-art)" />
		<path d={RAYOS} stroke="var(--n-art)" stroke-width="10" stroke-linecap="round" />
	{:else if tipo === 'luna'}
		<path d="M130 146A56 56 0 1 1 112 46A51 51 0 0 0 130 146z" fill="var(--n-art)" />
		<circle cx="150" cy="54" r="4" fill="var(--n-art)" />
		<circle cx="166" cy="96" r="3" fill="var(--n-art)" />
		<circle cx="140" cy="164" r="3" fill="var(--n-art)" />
	{:else if tipo === 'lluvia'}
		<path d={NUBE_BAJA} fill="var(--n-art)" />
		<path
			d="M76 148l-8 22M104 148l-8 22M132 148l-8 22M90 176l-5 14M118 176l-5 14"
			stroke="var(--n-accent)"
			stroke-width="8"
			stroke-linecap="round"
		/>
	{:else if tipo === 'tormenta'}
		<path d={NUBE_BAJA} fill="var(--n-art)" />
		<path
			d="M108 136l-18 28h24l-16 28"
			fill="none"
			stroke="var(--n-accent)"
			stroke-width="9"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{:else if tipo === 'nieve'}
		<path d={NUBE_BAJA} fill="var(--n-art)" />
		<circle cx="72" cy="152" r="6" fill="var(--n-accent)" />
		<circle cx="100" cy="164" r="6" fill="var(--n-accent)" />
		<circle cx="128" cy="152" r="6" fill="var(--n-accent)" />
		<circle cx="86" cy="184" r="5" fill="var(--n-accent)" />
		<circle cx="116" cy="186" r="5" fill="var(--n-accent)" />
	{:else if tipo === 'niebla'}
		<path
			d="M58 110h88a34 34 0 0 0 4-67.8a46 46 0 0 0-88.6 8.6A30 30 0 0 0 58 110z"
			fill="var(--n-art)"
		/>
		<path
			d="M36 138h128M52 164h96M68 188h64"
			stroke="var(--n-accent)"
			stroke-width="8"
			stroke-linecap="round"
		/>
	{:else}
		<circle cx="134" cy="70" r="26" fill="var(--n-accent)" opacity="0.35" />
		<path d={NUBE} fill="var(--n-art)" />
	{/if}
</svg>
