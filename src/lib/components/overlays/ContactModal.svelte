<script lang="ts">
  import { PUBLIC_WEB3FORMS_KEY } from '$env/static/public';

  let { open, onClose }: { open: boolean; onClose: () => void } = $props();

  let name    = $state('');
  let email   = $state('');
  let message = $state('');
  let botcheck = $state(''); // honeypot — must stay empty

  type Status = 'idle' | 'sending' | 'success' | 'error';
  let status  = $state<Status>('idle');
  let errMsg  = $state('');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (botcheck) return; // silently drop bot submissions
    status = 'sending';
    errMsg = '';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: PUBLIC_WEB3FORMS_KEY,
          subject:    `hey ansh — from ${name}`,
          from_name:  name,
          name,
          email,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        status = 'success';
        setTimeout(() => {
          status = 'idle';
          name = ''; email = ''; message = '';
          onClose();
        }, 2200);
      } else {
        throw new Error(data.message ?? 'submission failed');
      }
    } catch (err: any) {
      status = 'error';
      errMsg = err?.message ?? 'something went wrong — try emailing directly.';
    }
  }

  function reset() { status = 'idle'; errMsg = ''; }
</script>

{#if open}
  <div class="cd-detail-overlay" role="presentation" onclick={onClose}>
    <div class="cd-detail" role="dialog" aria-modal="true" onclick={(e) => e.stopPropagation()}>
      <div class="cd-detail-head">
        <div class="cd-detail-bcrumb">
          <span class="cd-dim">ansh / </span>
          <span>contact.md</span>
        </div>
        <button class="cd-detail-close" onclick={onClose}>esc ✕</button>
      </div>

      <div class="cd-detail-body cd-contact-body">

        {#if status === 'success'}
          <!-- ── Success ── -->
          <div class="cd-contact-state">
            <span class="cd-contact-state-icon cd-contact-ok">✓</span>
            <p class="cd-contact-state-msg">message sent — i'll get back to you soon.</p>
          </div>

        {:else if status === 'error'}
          <!-- ── Error ── -->
          <div class="cd-contact-state">
            <span class="cd-contact-state-icon cd-contact-err">✕</span>
            <p class="cd-contact-state-msg">{errMsg}</p>
            <button class="cd-cta cd-cta-primary" onclick={reset}>try again</button>
          </div>

        {:else}
          <!-- ── Form ── -->
          <div class="cd-detail-tag">// get in touch · response within 24h</div>
          <h2 class="cd-detail-h">say hello.</h2>
          <p class="cd-contact-intro">
            Drop a line about anything — projects, roles, ideas, or just to say hi.
            I read everything.
          </p>

          <form class="cd-contact-form" onsubmit={handleSubmit}>
            <!-- honeypot — hidden from real users -->
            <input
              type="checkbox"
              name="botcheck"
              bind:checked={botcheck as any}
              style="display:none"
              tabindex="-1"
              autocomplete="off"
            />

            <label class="cd-contact-field">
              <span class="cd-contact-label"><span class="cd-accent">›</span> name</span>
              <input
                class="cd-contact-input"
                type="text"
                bind:value={name}
                placeholder="your name"
                required
                autocomplete="name"
                disabled={status === 'sending'}
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
                disabled={status === 'sending'}
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
                disabled={status === 'sending'}
              ></textarea>
            </label>

            <div class="cd-detail-cta">
              <button
                type="submit"
                class="cd-cta cd-cta-primary"
                disabled={status === 'sending'}
              >
                {#if status === 'sending'}
                  <span class="cd-contact-spinner"></span> sending…
                {:else}
                  send message <span class="cd-arr">↗</span>
                {/if}
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
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
