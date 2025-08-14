

/* ---------- Configurações iniciais ---------- */
/* Substitua pelo número do WhatsApp no formato internacional sem sinais, por exemplo: 55XXXXXXXXXXX */
const WHATSAPP_NUMBER = "5500000000000"; // TODO: colocar número exato (DDI+DDD+Número) sem sinais

/* Mensagem padrão do WhatsApp (vai preencher com dados do formulário) */
function buildWhatsappMessage(data) {
  const assunto = data.assunto || "Contato pelo site";
  // encodeURIComponent usado nas partes de texto livres
  const lines = [
    `*${assunto}*`,
    `Nome: ${data.nome || ""}`,
    `E-mail: ${data.email || ""}`,
    `Telefone: ${data.telefone || ""}`,
    `Mensagem: ${data.mensagem || ""}`
  ];
  // unir por %0A para quebra de linha na URL
  return encodeURIComponent(lines.join("\n"));
}

/* ---------- Nav mobile toggle ---------- */
(function setupNavToggle(){
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  toggle.addEventListener('click', ()=> {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', (!expanded).toString());
    menu.classList.toggle('show');
  });

  // Fechar menu ao clicar em link (melhora UX mobile)
  menu.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=> {
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded','false');
    });
  });
})();

/* ---------- Carousel simples ---------- */
(function carouselSetup(){
  const track = document.querySelector('.carousel-track');
  if(!track) return;
  const items = Array.from(track.querySelectorAll('.carousel-item'));
  let index = 0;

  function show(i){
    // limitar
    index = (i + items.length) % items.length;
    const w = items[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${index * w}px)`;
  }

  // controles
  const prev = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');
  if(prev) prev.addEventListener('click', ()=> show(index - 1));
  if(next) next.addEventListener('click', ()=> show(index + 1));

  // adaptação ao redimensionar (recalcula largura)
  window.addEventListener('resize', ()=> show(index));

  // autoplay leve (opcional)
  let auto = setInterval(()=> show(index + 1), 5000);
  // pausa no hover
  track.addEventListener('mouseenter', ()=> clearInterval(auto));
  track.addEventListener('mouseleave', ()=> auto = setInterval(()=> show(index + 1), 5000));
})();

/* ---------- Formulário: validação e envio por "simulação" / WhatsApp ---------- */
(function contactForm(){
  const form = document.getElementById('contactForm');
  const messageBox = document.getElementById('formMessage');
  const btnWa = document.getElementById('btnWa');
  const waHeader = document.getElementById('whatsappHeader');

  // Atualiza link do header WhatsApp (útil caso queira abrir direto)
  function updateWaHeaderLink(){
    const url = `https://wa.me/${WHATSAPP_NUMBER}`;
    if(waHeader) waHeader.href = url;
  }
  updateWaHeaderLink();

  // Envio via formulário (aqui apenas simula o envio por backend e abre WhatsApp)
  form.addEventListener('submit', function(e){
    e.preventDefault();
    // validação simples
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    if(!data.nome || !data.email || !data.mensagem){
      messageBox.textContent = "Por favor, preencha nome, e-mail e mensagem.";
      return;
    }
    // Aqui você poderia enviar para um backend via fetch() -> exemplo comentado:
    /*
    fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    }).then(r=>{ ... })
    */
    messageBox.textContent = "Mensagem preparada. Abrindo WhatsApp...";
    // Abrir WhatsApp com mensagem
    const text = buildWhatsappMessage(data);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, '_blank', 'noopener');
  });

  // Botão "Enviar pelo WhatsApp" usa os valores do formulário
  btnWa.addEventListener('click', ()=>{
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const text = buildWhatsappMessage(data);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, '_blank', 'noopener');
  });
})();

/* ---------- Footer year automático ---------- */
(function setYear(){
  const el = document.getElementById('currentYear');
  if(el) el.textContent = new Date().getFullYear();
})();

/* ---------- Acessibilidade: Skip link & focus management (simples) ---------- */
/* Poderia ser estendido conforme necessidade */
