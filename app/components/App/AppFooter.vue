<template>
  <footer class="bg-[var(--color-brand-footer)] border-t border-white/10">
    <!-- Instagram CTA block (per D-05, INSTA-02) -->
    <div class="max-w-6xl mx-auto px-6 pt-10 pb-6 text-center">
      <div class="flex flex-col items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" />
        </svg>
        <p class="text-white text-lg font-semibold">Acompanhe a Fly Up Milhas no Instagram</p>
        <p class="text-white/80 text-sm max-w-md">Dicas de milhas, destinos incriveis e bastidores da mentoria. Siga para nao perder nenhuma novidade!</p>
        <a
          href="https://www.instagram.com/flyupmilhas"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 text-sm font-medium transition-colors"
        >
          @flyupmilhas
        </a>
      </div>
    </div>

    <!-- Separator -->
    <div class="max-w-6xl mx-auto px-6">
      <hr class="border-white/10" />
    </div>

    <!-- Bottom bar: copyright + social links -->
    <div class="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <!-- Left: copyright + credit -->
      <div class="text-center md:text-left">
        <p class="text-white/80 text-sm">&copy; {{ new Date().getFullYear() }} Fly Up Milhas. Todos os direitos reservados.</p>
        <!-- TODO: Confirm Agência 201 URL -->
        <p class="text-white/80 text-sm mt-1">Desenvolvido por <a href="https://agencia201.com.br" target="_blank" rel="noopener noreferrer" class="text-white hover:text-brand-primary underline underline-offset-2 transition-colors">Agência 201</a></p>
      </div>
      <!-- Right: social links (WhatsApp + Instagram) -->
      <div class="flex items-center gap-4 justify-center md:justify-end">
        <!-- TODO: Replace 55XXXXXXXXXXX with Marcio's real WhatsApp number before launch -->
        <a
          href="https://wa.me/55XXXXXXXXXXX?text=Ola%2C%20quero%20saber%20mais%20sobre%20a%20mentoria%20Fly%20Up%20Milhas."
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-white/80 hover:text-brand-primary transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Fale pelo WhatsApp
        </a>
        <a
          href="https://www.instagram.com/flyupmilhas"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-white/80 hover:text-brand-primary transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" />
          </svg>
          Siga no Instagram
        </a>
      </div>
    </div>
  </footer>
</template>
