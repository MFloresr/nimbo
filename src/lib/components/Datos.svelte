<!-- Datos del momento: viento, humedad, UV, presión, amanecer y atardecer. -->
<script lang="ts">
	import type { Tiempo } from '$lib/meteo';

	let { tiempo }: { tiempo: Tiempo } = $props();

	const ICONOS = {
		viento: 'M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8',
		gota: 'M12 3c3.5 4.5 6 7.8 6 11a6 6 0 0 1-12 0c0-3.2 2.5-6.5 6-11z',
		uv: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5',
		presion: 'M4 16a8 8 0 1 1 16 0M12 16l4-5',
		amanecer: 'M4 19h16M7 19a5 5 0 0 1 10 0M12 5v6M9 8l3-3l3 3',
		atardecer: 'M4 19h16M7 19a5 5 0 0 1 10 0M12 5v6M9 8l3 3l3-3'
	};

	let datos = $derived([
		{ etiqueta: 'Viento', valor: String(tiempo.viento), unidad: `km/h ${tiempo.direccionViento}`, icono: ICONOS.viento },
		{ etiqueta: 'Humedad', valor: `${tiempo.humedad}%`, unidad: '', icono: ICONOS.gota },
		{ etiqueta: 'Índice UV', valor: String(tiempo.uv), unidad: tiempo.uvTexto, icono: ICONOS.uv },
		{ etiqueta: 'Presión', valor: String(tiempo.presion), unidad: 'hPa', icono: ICONOS.presion },
		{ etiqueta: 'Amanecer', valor: tiempo.amanecer, unidad: '', icono: ICONOS.amanecer },
		{ etiqueta: 'Atardecer', valor: tiempo.atardecer, unidad: '', icono: ICONOS.atardecer }
	]);
</script>

<section aria-label="Datos del momento">
	<dl class="row row-cols-2 row-cols-md-3 row-cols-xl-6 g-3 mb-0">
		{#each datos as x (x.etiqueta)}
			<div class="col">
				<div class="card dato h-100">
					<div class="card-body d-flex flex-column justify-content-between gap-2">
						<dt class="d-flex align-items-center gap-2 small fw-medium text-soft">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"><path d={x.icono} /></svg
							>
							{x.etiqueta}
						</dt>
						<dd class="d-flex align-items-baseline gap-2 m-0">
							<span class="display valor">{x.valor}</span>
							{#if x.unidad}<span class="small text-soft">{x.unidad}</span>{/if}
						</dd>
					</div>
				</div>
			</div>
		{/each}
	</dl>
</section>

<style>
	.dato {
		--bs-card-spacer-y: 1rem;
		--bs-card-spacer-x: 1.25rem;
		--bs-card-border-radius: 20px;
	}
	.valor {
		font-size: 26px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
</style>
