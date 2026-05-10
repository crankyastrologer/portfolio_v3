<script lang="ts">
  let { data, color = '' }: { data: number[]; color?: string } = $props();

  const BLOCKS = ['▁','▂','▃','▄','▅','▆','▇','█'];

  let chars = $derived(() => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    return data.map(v => {
      const norm = (v - min) / Math.max(1, max - min);
      return BLOCKS[Math.min(7, Math.floor(norm * 7))];
    });
  });
</script>

<span class="cd-spark" style={color ? `color: ${color}` : ''}>
  {#each chars() as ch}{ch}{/each}
</span>
