<script lang="ts">
  import { makeContribGraph } from '$lib/data';

  const grid = makeContribGraph(11);
  const months = ['M','J','J','A','S','O','N','D','J','F','M','A'];
</script>

<div class="cd-contrib">
  <div class="cd-contrib-grid">
    {#each grid as col}
      <div class="cd-contrib-col">
        {#each col as lvl}
          <div class="cd-contrib-cell cd-lvl-{lvl}"></div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="cd-contrib-foot">
    <div class="cd-contrib-months">
      {#each months as m}<span>{m}</span>{/each}
    </div>
    <div class="cd-contrib-legend">
      <span>less</span>
      {#each [0,1,2,3,4] as l}
        <span class="cd-contrib-cell cd-lvl-{l}"></span>
      {/each}
      <span>more</span>
    </div>
  </div>
</div>
