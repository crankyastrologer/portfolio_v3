<script lang="ts">
  import { NOTES } from '$lib/data';
</script>

<div class="cd-panel">
  <div class="cd-panel-head">
    <span class="cd-panel-title">notes/</span>
    <span class="cd-dim">{NOTES.length} entries</span>
  </div>
  <div class="cd-notes">
    {#each NOTES as n}
      <!-- svelte-ignore a11y_invalid_attribute -->
      <a class="cd-note" href="#">
        <span class="cd-dim cd-note-t">{n.t}</span>
        <span class="cd-note-title">{n.title}</span>
        <span class="cd-tag">{n.tag}</span>
        <span class="cd-note-arr">→</span>
      </a>
    {/each}
  </div>
</div>
