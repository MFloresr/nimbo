<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { navigating } from '$app/state';
	import { enlaceLugar, grados } from '$lib/meteo';
	import { cargarUnidad } from '$lib/unidad.svelte';
	import Cabecera from '$lib/components/Cabecera.svelte';
	import Actual from '$lib/components/Actual.svelte';
	import Horas from '$lib/components/Horas.svelte';
	import Semana from '$lib/components/Semana.svelte';
	import Datos from '$lib/components/Datos.svelte';

	let { data } = $props();

	let avisoLocal = $state('');
	let reintentando = $state(false);

	const COLORES = {
		soleado: '#f6e7c8',
		nublado: '#dde2e7',
		lluvia: '#3b5566',
		noche: '#1c2438',
		nieve: '#ebf0f5'
	};

	let condicion = $derived(data.tiempo?.condicion ?? 'nublado');
	let titulo = $derived(
		data.tiempo
			? `${grados(data.tiempo.temp, 'C')} ${data.tiempo.descripcion.toLowerCase()} en ${data.lugar.nombre} · Nimbo`
			: 'Nimbo · El tiempo'
	);

	onMount(cargarUnidad);

	// Al cambiar de lugar se borra el aviso de ubicación anterior
	$effect(() => {
		void data.lugar;
		avisoLocal = '';
	});

	async function reintentar() {
		reintentando = true;
		await invalidateAll();
		reintentando = false;
	}
</script>

<svelte:head>
	<title>{titulo}</title>
	<meta
		name="description"
		content="Nimbo muestra el tiempo actual, las próximas horas y los próximos 7 días de cualquier ciudad, con colores que cambian según el tiempo."
	/>
	<meta name="theme-color" content={COLORES[condicion]} />
</svelte:head>

<div class="nimbo" data-cond={condicion}>
	<Cabecera busqueda={data.busqueda} onAviso={(t) => (avisoLocal = t)} />

	<main class="container-xxl pb-4" class:cargando={navigating.to !== null}>
		{#if data.aviso || avisoLocal}
			<div class="alert mb-4" role="status">{avisoLocal || data.aviso}</div>
		{/if}

		{#if data.alternativas.length > 0}
			<nav class="mb-4 small" aria-label="Otros lugares con ese nombre">
				<span class="text-soft me-1">¿Buscabas otro lugar?</span>
				{#each data.alternativas as alt (alt.lat + ',' + alt.lon)}
					<a class="alternativa" href={enlaceLugar(alt)}>
						{alt.nombre}{#if alt.detalle}<span class="text-soft">, {alt.detalle}</span>{/if}
					</a>
				{/each}
			</nav>
		{/if}

		{#if data.tiempo}
			<div class="row g-4">
				<div class="col-lg-8 d-flex flex-column gap-4">
					<Actual lugar={data.lugar} tiempo={data.tiempo} />
					<Horas horas={data.tiempo.horas} />
				</div>
				<div class="col-lg-4">
					<Semana dias={data.tiempo.dias} />
				</div>
			</div>
			<div class="mt-4">
				<Datos tiempo={data.tiempo} />
			</div>
		{:else}
			<section class="card">
				<div class="card-body d-flex flex-column align-items-start gap-3">
					<h1 class="h4 display fw-bold m-0">El tiempo no está disponible</h1>
					<p class="m-0">{data.error}</p>
					<button class="btn btn-nimbo px-4" type="button" onclick={reintentar} disabled={reintentando}>
						{reintentando ? 'Cargando…' : 'Volver a intentarlo'}
					</button>
				</div>
			</section>
		{/if}

		<footer class="d-flex flex-wrap justify-content-between gap-2 small text-soft mt-4">
			<span>
				Datos meteorológicos: <a href="https://open-meteo.com/">Open-Meteo.com</a> (CC BY 4.0)
			</span>
			<span>
				Hecho por <a href="https://mfloresr-portfolio.vercel.app">Mario Flores Rodríguez</a> ·
				<a href="https://github.com/MFloresr/nimbo">Código en GitHub</a>
			</span>
		</footer>
	</main>
</div>

<style>
	main {
		transition: opacity 0.2s ease;
	}
	main.cargando {
		opacity: 0.6;
	}
	.alternativa {
		display: inline-block;
		margin: 2px 4px;
		padding: 6px 12px;
		border: 1px solid var(--n-line);
		border-radius: 999px;
		background: var(--n-card);
		text-decoration: none;
	}
	.alternativa:hover {
		border-color: var(--n-soft);
	}
	@media (prefers-reduced-motion: reduce) {
		main {
			transition: none;
		}
	}
</style>
