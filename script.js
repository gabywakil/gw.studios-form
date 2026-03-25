// ── GW STUDIOS — FORM SCRIPT ──
const FORMSPREE_URL = 'https://formspree.io/f/xjgpbekl';

// ── CHIPS: toggle selection and sync to hidden input ──
document.querySelectorAll('.chips-group').forEach(group => {
  const targetId = group.getAttribute('data-target');
  const hiddenInput = document.getElementById(targetId);

  group.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      syncChips(group, hiddenInput);
    });
  });
});

function syncChips(group, hiddenInput) {
  const selected = [...group.querySelectorAll('.chip.selected')]
    .map(c => c.getAttribute('data-value'));
  hiddenInput.value = selected.join(', ');
}

// ── FORM SUBMIT ──
const form = document.getElementById('gwForm');
const submitBtn = form.querySelector('.submit-btn');
const errorMsg = document.getElementById('errorMsg');
const thankYou = document.getElementById('thankYou');
const submitArea = document.getElementById('submitArea');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic validation — nombre required
  const nombre = document.getElementById('nombre').value.trim();
  if (!nombre) {
    errorMsg.classList.add('visible');
    document.getElementById('nombre').focus();
    return;
  }

  errorMsg.classList.remove('visible');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  // Collect all form data
  const formData = new FormData(form);

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      // Show thank you, hide form
      form.style.display = 'none';
      thankYou.style.display = 'block';
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      const data = await response.json();
      const msg = data?.errors?.map(e => e.message).join(', ') || 'Hubo un error al enviar. Intenta de nuevo.';
      showError(msg);
    }
  } catch (err) {
    showError('No se pudo enviar. Verifica tu conexión e intenta de nuevo.');
  }
});

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.add('visible');
  submitBtn.disabled = false;
  submitBtn.textContent = 'Enviar formulario';
}
