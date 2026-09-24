<!-- Tarjeta principal: lugar, temperatura actual y descripción del tiempo. -->
<script lang="ts">
	import { grados, type Lugar, type Tiempo } from '$lib/meteo';
	import { preferencias } from '$lib/unidad.svelte';
	import Ilustracion from './Ilustracion.svelte';

	let { lugar, tiempo }: { lugar: Lugar; tiempo: Tiempo } = $props();
	let u = $derived(preferencias.unidad);
</script>

<section class="card" aria-labelledby="lugar">
	<div
		class="card-body d-flex flex-column flex-sm-row align-items-center gap-4 text-center text-sm-start"
	>
		<div class="flex-grow-1 d-flex flex-column gap-1">
			<h1
				id="lugar"
				class="h5 m-0 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 fw-semibold"
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					><path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" /><circle
						cx="12"
						cy="10"
						r="2"
					/></svg
				>
				{lugar.nombre}
			</h1>
			{#if lugar.detalle}
				<div class="text-soft small">{lugar.detalle}</div>
			{/if}
			<div class="text-soft small">{tiempo.fecha} (hora local)</div>
			<div class="display temp mt-2">{grados(tiempo.temp, u)}</div>
			<div class="display fw-bold fs-2">{tiempo.descripcion}</div>
			<div class="text-soft">
				Máx. {grados(tiempo.max, u)} · Mín. {grados(tiempo.min, u)} · Sensación {grados(
					tiempo.sensacion,
					u
				)}
			</div>
		</div>
		<div class="ilustracion flex-shrink-0 order-first order-sm-0">
			<Ilustracion tipo={tiempo.icono} />
		</div>
	</div>
</section>

<style>
	.temp {
		font-size: clamp(88px, 12vw, 148px);
		line-height: 1;
		font-weight: 500;
		letter-spacing: -0.05em;
		font-variant-numeric: tabular-nums;
	}
	.ilustracion {
		width: clamp(140px, 22vw, 240px);
		aspect-ratio: 1;
		max-width: 100%;
	}
</style>
