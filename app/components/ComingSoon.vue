<script setup lang="ts">
import logoImg from '~/assets/img/logo-fly-up-milhas.webp'
</script>

<template>
  <div class="coming-soon">
    <!-- Ambient glow layers -->
    <div class="glow glow--primary" aria-hidden="true" />
    <div class="glow glow--secondary" aria-hidden="true" />

    <!-- Content -->
    <div class="content">
      <img
        :src="logoImg"
        alt="Fly Up Milhas"
        width="220"
        height="72"
        class="logo"
        fetchpriority="high"
      >

      <span class="eyebrow">Algo novo está decolando</span>

      <h1 class="headline">
        Em&nbsp;breve.
      </h1>

      <p class="sub">
        Uma nova forma de voar mais alto — com menos.
      </p>

      <div class="divider" aria-hidden="true" />

      <p class="footer-note">
        @flyupmilhas
      </p>
    </div>
  </div>
</template>

<style scoped>
.coming-soon {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at top, rgba(29, 78, 216, 0.22) 0%, transparent 55%),
    radial-gradient(ellipse at bottom, rgba(14, 116, 144, 0.14) 0%, transparent 60%),
    linear-gradient(180deg, #0F172A 0%, #020617 100%);
  overflow: hidden;
  color: white;
  padding: 2rem 1.5rem;
  font-family: inherit;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.55;
  pointer-events: none;
}

.glow--primary {
  width: 520px;
  height: 520px;
  background: #1D4ED8;
  top: -180px;
  left: 50%;
  transform: translateX(-50%);
  animation: drift-primary 14s ease-in-out infinite alternate;
}

.glow--secondary {
  width: 380px;
  height: 380px;
  background: #0E7490;
  bottom: -120px;
  left: 20%;
  animation: drift-secondary 18s ease-in-out infinite alternate;
}

@keyframes drift-primary {
  0%   { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.55; }
  100% { transform: translateX(-50%) translateY(30px) scale(1.1); opacity: 0.75; }
}

@keyframes drift-secondary {
  0%   { transform: translateY(0) scale(1); opacity: 0.45; }
  100% { transform: translateY(-40px) scale(1.15); opacity: 0.65; }
}

.content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  max-width: 36rem;
  animation: fade-in 0.9s ease-out both;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.logo {
  height: 56px;
  width: auto;
  filter: drop-shadow(0 4px 20px rgba(29, 78, 216, 0.4));
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  padding: 0.4rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
}

.headline {
  font-size: clamp(2.75rem, 8vw, 4.5rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
  margin: 0;
  background: linear-gradient(180deg, #ffffff 40%, rgba(255, 255, 255, 0.55) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sub {
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.5;
  margin: 0;
  max-width: 28rem;
}

.divider {
  width: 2rem;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  margin-top: 0.5rem;
}

.footer-note {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.1em;
  margin: 0;
}

@media (min-width: 768px) {
  .logo { height: 64px; }
}
</style>
