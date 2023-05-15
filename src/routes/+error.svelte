<script>
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>{$page.status}: {$page.error?.message}</title>
</svelte:head>

<div class="flex h-screen justify-center items-center">
  <div class="text-center">
    <p class="text-base font-semibold text-blue-600">{$page.status}</p>
    <h1
      class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl"
    >
      {$page.error?.message}
    </h1>
    {#if $page.status === 404}
      <p class="mt-6 text-base leading-7 text-gray-600">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
    {/if}
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a href="/" class="text-sm font-semibold text-gray-900"
        >Go Home <span aria-hidden="true">&rarr;</span></a
      >
    </div>
  </div>
</div>
