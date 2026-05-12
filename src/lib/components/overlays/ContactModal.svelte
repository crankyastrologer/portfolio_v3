<script lang="ts">
  let { open, onClose }: { open: boolean; onClose: () => void } = $props();

  let name = $state('');
  let email = $state('');
  let message = $state('');
  let sent = $state(false);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`hey ansh — from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} <${email}>`);
    window.open(`mailto:ansh0verma@gmail.com?subject=${subject}&body=${body}`);
    sent = true;
    setTimeout(() => { sent = false; name = ''; email = ''; message = ''; onClose(); }, 1800);
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="cd-detail-overlay" onclick={onClose}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="cd-detail" onclick={(e) => e.stopPropagation()}>
      <div class="cd-detail-head">
        <div class="cd-detail-bcrumb">
          <span class="cd-dim">ansh / </span>
          <span>contact.md</span>
        </div>
        <button class="cd-detail-close" onclick={onClose}>esc ✕</button>
      </div>

      <div class="cd-detail-body cd-contact-body">
        {#if sent}
          <div class="cd-contact-sent">
            <span class="cd-accent">✓</span> opening your mail client…
          </div>
        {:else}
          <div class="cd-detail-tag">// get in touch · response within 24h</div>
          <h2 class="cd-detail-h">say hello.</h2>
          <p class="cd-contact-intro">
            Drop a line about anything — projects, roles, ideas, or just to say hi.
            I read everything.
          </p>

          <form class="cd-contact-form" onsubmit={handleSubmit}>
            <label class="cd-contact-field">
              <span class="cd-contact-label"><span class="cd-accent">›</span> name</span>
              <input
                class="cd-contact-input"
                type="text"
                bind:value={name}
                placeholder="your name"
                required
                autocomplete="name"
              />
            </label>
            <label class="cd-contact-field">
              <span class="cd-contact-label"><span class="cd-accent">›</span> email</span>
              <input
                class="cd-contact-input"
                type="email"
                bind:value={email}
                placeholder="you@example.com"
                required
                autocomplete="email"
              />
            </label>
            <label class="cd-contact-field">
              <span class="cd-contact-label"><span class="cd-accent">›</span> message</span>
              <textarea
                class="cd-contact-input cd-contact-ta"
                bind:value={message}
                placeholder="what's on your mind?"
                required
                rows="5"
              ></textarea>
            </label>
            <div class="cd-detail-cta">
              <button type="submit" class="cd-cta cd-cta-primary">
                send message <span class="cd-arr">↗</span>
              </button>
              <button type="button" class="cd-cta" onclick={onClose}>← back</button>
            </div>
          </form>

          <div class="cd-detail-section-h">// reach me at</div>
          <div class="cd-contact-links">
            <a href="mailto:ansh0verma@gmail.com" class="cd-contact-link">
              <span class="cd-dim">mail</span> ansh0verma@gmail.com
            </a>
            <a href="https://github.com/crankyastrologer" target="_blank" rel="noreferrer" class="cd-contact-link">
              <span class="cd-dim">gh  </span> github.com/crankyastrologer
            </a>
            <a href="https://www.linkedin.com/in/ansh-vermaai/" target="_blank" rel="noreferrer" class="cd-contact-link">
              <span class="cd-dim">li  </span> linkedin/ansh-vermaai
            </a>
            <a href="https://chat.ansh.site" target="_blank" rel="noreferrer" class="cd-contact-link">
              <span class="cd-dim">chat</span> chat.ansh.site
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
