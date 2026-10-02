<script setup lang="ts">
defineProps<{ contacts: Array<{ label: string; href: string }> }>();
</script>

<template>
  <section class="contacts-section" aria-labelledby="contacts-heading">
    <h2 id="contacts-heading" class="section-heading">保持联系</h2>
    <div class="contact-links">
      <a v-for="contact in contacts" :key="contact.label" :href="contact.href" target="_blank" rel="noopener noreferrer" class="contact-link"><span>{{ contact.label }}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg></a>
      <RouterLink to="/board" class="contact-link"><span>留言</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg></RouterLink>
    </div>
  </section>
</template>

<style scoped>
.contacts-section { margin-top: 44px; }
.section-heading { margin: 0 2px 14px; }
.contact-links { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 26px; }
.contact-link { display: inline-flex; align-items: center; gap: 9px; min-height: 44px; padding: 8px 0; border-radius: 6px; background: transparent; color: var(--body); text-decoration: none; font-size: 13px; line-height: 1.6; transition: transform var(--duration-exit) var(--ease-out), background-color var(--duration-exit) var(--ease-out); }
.contact-link svg { width: 15px; height: 15px; color: var(--muted); opacity: .55; transition: transform var(--duration-enter) var(--ease-out); }
.contact-link:active { transform: scale(.96); }
@media (hover: hover) and (pointer: fine) { .contact-link:hover { color: var(--ink); } .contact-link:hover svg { transform: translate(1px, -1px); } }
@media (max-width: 600px) { .contacts-section { margin-top: 34px; } }
</style>
