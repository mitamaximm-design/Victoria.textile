/* ===== IMAGE MAP ===== */
const IMGS = {
  'product-1.jpg':     'img/product-1.jpg',
  'product-2.jpg':     'img/product-2.jpg',
  'product-3.jpg':     'img/product-3.jpg',
  'product-4.jpg':     'img/product-4.jpg',
  'product-5.jpg':     'img/product-5.jpg',
  'product-6.jpg':     'img/product-6.jpg',
  'product-7.jpg':     'img/product-7.jpg',
  'product-8.jpg':     'img/product-8.jpg',
  'product-9.jpg':     'img/product-9.jpg',
  'carousel-1.jpg':    'img/carousel-1.jpg',
  'carousel-2.jpg':    'img/carousel-2.jpg',
  'carousel-3.jpg':    'img/carousel-3.jpg',
  'cat-1.jpg':         'img/cat-1.jpg',
  'cat-2.jpg':         'img/cat-2.jpg',
  'cat-3.jpg':         'img/cat-3.jpg',
  'cat-4.jpg':         'img/cat-4.jpg',
  'offer-1.jpg':       'img/offer-1.jpg',
  'offer-2.jpg':       'img/offer-2.jpg',
  'testimonial-1.jpg': 'img/testimonial-1.jpg',
  'testimonial-2.jpg': 'img/testimonial-2.jpg',
  'testimonial-3.jpg': 'img/testimonial-3.jpg',
  'testimonial-4.jpg': 'img/testimonial-4.jpg',
  'about.jpg':         'img/about.jpg',
  'payments.png':      'img/payments.png',
};

function imgSrc(key) { return IMGS[key]; }

/* ===== HERO SLIDER (index) ===== */
let cur = 0;
const slides = document.querySelectorAll('.hslide');
const dots   = document.querySelectorAll('.hdot');

function goSlide(n) {
  if (!slides.length) return;
  slides[cur]?.classList.remove('act');
  dots[cur]?.classList.remove('act');
  cur = ((n % slides.length) + slides.length) % slides.length;
  slides[cur]?.classList.add('act');
  dots[cur]?.classList.add('act');
}
function chSlide(d) { goSlide(cur + d); }
if (slides.length) setInterval(() => chSlide(1), 5500);

/* ===== BACK TO TOP ===== */
window.addEventListener('scroll', () => {
  document.getElementById('btop')?.classList.toggle('sh', window.scrollY > 400);
});
document.getElementById('btop')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== NOTIFICATION ===== */
function showNotif(msg) {
  const n = document.getElementById('notif');
  if (!n) return;
  n.textContent = msg;
  n.classList.add('sh');
  setTimeout(() => n.classList.remove('sh'), 3200);
}

/* ===== CART STORAGE ===== */
function loadCart() {
  try { return JSON.parse(sessionStorage.getItem('vic_cart') || '[]'); }
  catch { return []; }
}
function saveCart(c) {
  sessionStorage.setItem('vic_cart', JSON.stringify(c));
}
let cart = loadCart();

/* ===== CART SIDEBAR ===== */
function toggleCart() {
  document.getElementById('csid')?.classList.toggle('op');
  document.getElementById('covrl')?.classList.toggle('op');
}
function closeCart() {
  document.getElementById('csid')?.classList.remove('op');
  document.getElementById('covrl')?.classList.remove('op');
}

/* ===== ADD / REMOVE / CHANGE QTY ===== */
function addToCart(name, price, cat, imgKey, e) {
  if (e) e.preventDefault();
  const ex = cart.find(i => i.name === name);
  if (ex) ex.qty++;
  else cart.push({ name, price, cat, imgKey, qty: 1 });
  saveCart(cart);
  renderCart();
  showNotif('✓ ' + name + ' adăugat în coș!');
  // open sidebar
  document.getElementById('csid')?.classList.add('op');
  document.getElementById('covrl')?.classList.add('op');
}

function rmCart(i) {
  cart.splice(i, 1);
  saveCart(cart);
  renderCart();
  renderCartPage();     // refresh table if on cart.html
  renderCheckoutSummary(); // refresh if on checkout.html
}

function chQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart(cart);
  renderCart();
}

/* ===== RENDER SIDEBAR CART ===== */
function renderCart() {
  const badge = document.getElementById('cbadge');
  const items = document.getElementById('citems');
  const cmt   = document.getElementById('cmt');
  const ftr   = document.getElementById('cftr');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);

  if (!cart.length) {
    if (cmt)   cmt.style.display  = 'block';
    if (items) items.innerHTML    = '';
    if (ftr)   ftr.style.display  = 'none';
    return;
  }

  if (cmt)  cmt.style.display = 'none';
  if (ftr)  ftr.style.display = 'block';

  if (items) {
    items.innerHTML = cart.map((it, idx) => `
      <div class="citem">
        <img src="${imgSrc(it.imgKey)}" alt="${it.name}">
        <div class="cii">
          <h6>${it.name}</h6>
          <div class="cp">${it.price} lei</div>
          <div class="cqty">
            <button class="qbtn" onclick="chQty(${idx},-1)">-</button>
            <span class="qv">${it.qty}</span>
            <button class="qbtn" onclick="chQty(${idx},1)">+</button>
          </div>
        </div>
        <button class="crm" onclick="rmCart(${idx})">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>`).join('');
  }

  const tel = document.getElementById('ctotal');
  if (tel) tel.textContent = total + ' lei';
}

/* ===== CART PAGE TABLE ===== */
function renderCartPage() {
  const tbody = document.querySelector('#cart-tbl tbody');
  if (!tbody) return;

  const sub   = document.getElementById('sb-sub');
  const tot   = document.getElementById('sb-tot');
  const badge = document.getElementById('cbadge');
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);

  if (!cart.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="padding:40px;text-align:center;color:#999;font-size:15px">
      Coșul tău este gol. <a href="shop.html" style="color:var(--cr)">Continuă cumpărăturile →</a>
    </td></tr>`;
    if (sub) sub.textContent = '0 lei';
    if (tot) tot.textContent = '0 lei';
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (sub) sub.textContent = total + ' lei';
  if (tot) tot.textContent = total + ' lei';

  tbody.innerHTML = cart.map((it, idx) => `
    <tr style="border-bottom:1px solid var(--bd)">
      <td style="padding:16px 12px">
        <div style="display:flex;align-items:center;gap:14px">
          <img src="${imgSrc(it.imgKey)}" alt="${it.name}"
               style="width:72px;height:72px;object-fit:cover;flex-shrink:0">
          <div>
            <div style="font-weight:600;font-size:14px;margin-bottom:4px">${it.name}</div>
            <div style="font-size:12px;color:var(--mu)">${it.cat || ''}</div>
          </div>
        </div>
      </td>
      <td style="padding:16px 12px;text-align:center;font-weight:600;color:var(--cr)">${it.price} lei</td>
      <td style="padding:16px 12px;text-align:center">
        <div style="display:flex;align-items:center;justify-content:center;gap:6px">
          <button onclick="chQtyPage(${idx},-1)"
            style="width:28px;height:28px;border:1px solid var(--bd);background:white;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">−</button>
          <input type="number" value="${it.qty}" min="1"
            style="width:44px;text-align:center;border:1px solid var(--bd);padding:4px;font-size:13px"
            onchange="setQtyPage(${idx},this.value)">
          <button onclick="chQtyPage(${idx},1)"
            style="width:28px;height:28px;border:1px solid var(--bd);background:white;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">+</button>
        </div>
      </td>
      <td style="padding:16px 12px;text-align:center;font-weight:600">${it.price * it.qty} lei</td>
      <td style="padding:16px 12px;text-align:center">
        <button onclick="rmCartPage(${idx})"
          style="background:none;border:none;color:var(--cr);cursor:pointer;font-size:16px">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>`).join('');
}

function chQtyPage(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart(cart);
  renderCart();
  renderCartPage();
}
function setQtyPage(i, v) {
  cart[i].qty = Math.max(1, parseInt(v) || 1);
  saveCart(cart);
  renderCart();
  renderCartPage();
}
function rmCartPage(i) {
  cart.splice(i, 1);
  saveCart(cart);
  renderCart();
  renderCartPage();
}

/* ===== CHECKOUT SUMMARY ===== */
function renderCheckoutSummary() {
  const el    = document.getElementById('checkout-items');
  const subEl = document.getElementById('co-sub');
  const totEl = document.getElementById('co-tot');
  const badge = document.getElementById('cbadge');

  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
  if (!el) return;

  if (!cart.length) {
    el.innerHTML = `<div style="padding:20px;text-align:center;color:#999;font-size:14px">
      Coșul tău este gol. <a href="shop.html" style="color:var(--cr)">Adaugă produse →</a>
    </div>`;
    if (subEl) subEl.textContent = '0 lei';
    if (totEl) totEl.textContent = '0 lei';
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (subEl) subEl.textContent = total + ' lei';
  if (totEl) totEl.textContent = total + ' lei';

  el.innerHTML = cart.map(it => `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;
                padding-bottom:12px;border-bottom:1px solid var(--bd)">
      <img src="${imgSrc(it.imgKey)}" alt="${it.name}"
           style="width:56px;height:56px;object-fit:cover;flex-shrink:0">
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;line-height:1.3">${it.name}</div>
        <div style="font-size:12px;color:var(--mu)">x${it.qty}</div>
      </div>
      <div style="font-weight:700;color:var(--cr);white-space:nowrap">${it.price * it.qty} lei</div>
    </div>`).join('');
}

/* ===== ORDER MODAL ===== */
function openOrderCart() {
  closeCart();
  buildSummary(null);
  document.getElementById('movrl')?.classList.add('op');
  const mform = document.getElementById('mform');
  const sbox  = document.getElementById('sbox');
  if (mform) mform.style.display = 'block';
  if (sbox)  sbox.style.display  = 'none';
}

function openOrder(name, price, cat, e) {
  if (e) e.preventDefault();
  buildSummary({ name, price, cat });
  document.getElementById('movrl')?.classList.add('op');
  const mform = document.getElementById('mform');
  const sbox  = document.getElementById('sbox');
  if (mform) mform.style.display = 'block';
  if (sbox)  sbox.style.display  = 'none';
}

function closeOrder() {
  document.getElementById('movrl')?.classList.remove('op');
}

function buildSummary(prod) {
  let html = '', total = 0;
  if (prod) {
    html  = `<div class="osi"><span>${prod.name}</span><span>${prod.price} lei</span></div>`;
    total = prod.price;
  } else if (cart.length) {
    html  = cart.map(i => `<div class="osi"><span>${i.name} x${i.qty}</span><span>${i.price * i.qty} lei</span></div>`).join('');
    total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  }
  const si = document.getElementById('osmitems');
  const st = document.getElementById('osmtotal');
  if (si) si.innerHTML   = html;
  if (st) st.textContent = total + ' lei';
}

/* ===== PLACE ORDER (modal) ===== */
function placeOrder() {
  const req = [['fn','Prenume'],['ln','Nume'],['em','Email'],['ph','Telefon'],['ad','Adresa'],['ct','Oras']];
  for (const [id, label] of req) {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      if (el) { el.style.borderColor = 'var(--cr)'; el.focus(); }
      showNotif('Completează: ' + label);
      return;
    }
    if (el) el.style.borderColor = 'var(--bd)';
  }
  if (!cart.length) { showNotif('Coșul este gol!'); return; }

  const btn = document.querySelector('#mform .bord');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:6px"></i>Se trimite...'; }

  const items = cart.map(i => `${i.name} x${i.qty} = ${i.price * i.qty} lei`).join('\n');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  fetch('https://formcarry.com/s/FmI42pbUoyI', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      prenume:      document.getElementById('fn')?.value  || '',
      nume:         document.getElementById('ln')?.value  || '',
      email:        document.getElementById('em')?.value  || '',
      telefon:      document.getElementById('ph')?.value  || '',
      adresa:       document.getElementById('ad')?.value  || '',
      oras:         document.getElementById('ct')?.value  || '',
      judet:        document.getElementById('jd')?.value  || '',
      metoda_plata: document.getElementById('pay')?.value || '',
      mesaj:        document.getElementById('msg')?.value || '',
      produse: items,
      total:   total + ' lei'
    })
  })
  .then(r => r.json())
  .then(() => {
    const mform = document.getElementById('mform');
    const sbox  = document.getElementById('sbox');
    if (mform) mform.style.display = 'none';
    if (sbox)  sbox.style.display  = 'block';
    cart = []; saveCart(cart); renderCart(); renderCartPage(); renderCheckoutSummary();
  })
  .catch(() => {
    showNotif('Eroare de rețea. Încearcă din nou.');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-check-circle" style="margin-right:6px"></i>Confirmă Comanda'; }
  });
}

/* ===== SUBMIT CHECKOUT (checkout.html direct form) ===== */
function submitCheckout() {
  const req = [['fn','Prenume'],['ln','Nume'],['em','Email'],['ph','Telefon'],['ad','Adresa'],['ct','Oras']];
  for (const [id, label] of req) {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      if (el) { el.style.borderColor = 'var(--cr)'; el.focus(); }
      showNotif('Completează: ' + label);
      return;
    }
    if (el) el.style.borderColor = 'var(--bd)';
  }
  if (!cart.length) { showNotif('Coșul este gol!'); return; }

  const btn  = document.querySelector('.checkout-submit-btn');
  const payV = document.querySelector('input[name="pay"]:checked')?.value || 'ramburs';
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px"></i>Se procesează...'; }

  const items = cart.map(i => `${i.name} x${i.qty} = ${i.price * i.qty} lei`).join('\n');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  fetch('https://formcarry.com/s/FmI42pbUoyI', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      prenume:      document.getElementById('fn')?.value || '',
      nume:         document.getElementById('ln')?.value || '',
      email:        document.getElementById('em')?.value || '',
      telefon:      document.getElementById('ph')?.value || '',
      adresa:       document.getElementById('ad')?.value || '',
      oras:         document.getElementById('ct')?.value || '',
      judet:        document.getElementById('jd')?.value || '',
      metoda_plata: payV,
      mesaj:        document.getElementById('co-msg')?.value || '',
      produse: items,
      total:   total + ' lei'
    })
  })
  .then(r => r.json())
  .then(() => {
    const succ = document.getElementById('co-succ');
    if (succ) succ.classList.add('op');
    cart = []; saveCart(cart); renderCart(); renderCheckoutSummary();
  })
  .catch(() => {
    showNotif('Eroare de rețea. Încearcă din nou.');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-lock" style="margin-right:8px"></i>Confirmă și Plătește'; }
  });
}

/* ===== CONTACT FORM ===== */
function sendMsg(btn) {
  const prenume = document.getElementById('c-fn')?.value?.trim() || '';
  const email   = document.getElementById('c-em')?.value?.trim() || '';
  const mesaj   = document.getElementById('c-msg')?.value?.trim() || '';
  const nume    = document.getElementById('c-ln')?.value?.trim() || '';
  const telefon = document.getElementById('c-ph')?.value?.trim() || '';
  const subiect = document.getElementById('c-sub')?.value || '';

  if (!prenume || !email || !mesaj) { showNotif('Completează câmpurile obligatorii!'); return; }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px"></i>Se trimite...';

  fetch('https://formcarry.com/s/FmI42pbUoyI', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ prenume, nume, email, telefon, subiect, mesaj, tip: 'contact' })
  })
  .then(r => r.json())
  .then(() => {
    const ok = document.getElementById('form-ok');
    if (ok) ok.style.display = 'block';
    btn.innerHTML = '<i class="fas fa-check" style="margin-right:8px"></i>Mesaj Trimis!';
    btn.style.background = '#28a745';
    showNotif('Mesajul a fost trimis cu succes!');
  })
  .catch(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:8px"></i>Trimite Mesajul';
    showNotif('Eroare la trimitere. Încearcă din nou.');
  });
}

/* ===== SHOP FILTER ===== */
function applyFilters() {
  const catRadio = document.querySelector('input[name="cat"]:checked');
  const selCat   = catRadio ? catRadio.value : 'Toate';

  const selPrices = [];
  document.querySelectorAll('#price-filter input[type="checkbox"]').forEach(cb => {
    if (cb.checked) selPrices.push(cb.value);
  });

  const cards = document.querySelectorAll('#prod-grid .pcard');
  let visible = 0;

  cards.forEach(card => {
    const cat   = card.dataset.cat   || '';
    const price = parseInt(card.dataset.price) || 0;
    const showCat = selCat === 'Toate' || cat === selCat;
    let   showPrice = true;

    if (selPrices.length > 0) {
      showPrice = selPrices.some(p => {
        if (p === '0-50')    return price <= 50;
        if (p === '50-100')  return price > 50  && price <= 100;
        if (p === '100-200') return price > 100 && price <= 200;
        if (p === '200-300') return price > 200 && price <= 300;
        if (p === '300+')    return price > 300;
        return false;
      });
    }

    const show = showCat && showPrice;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  const countEl = document.getElementById('prod-count-num');
  const pagEl   = document.getElementById('pagination');
  if (countEl) countEl.textContent = visible;
  if (pagEl)   pagEl.style.display = visible > 9 ? 'flex' : 'none';
}

function goPage(n, btn) {
  document.querySelectorAll('.pgbtn').forEach(b => b.classList.remove('act'));
  btn.classList.add('act');
}

/* ===== INIT ===== */
document.querySelectorAll('input[name="cat"]').forEach(r => r.addEventListener('change', applyFilters));
document.querySelectorAll('#price-filter input[type="checkbox"]')
.forEach(cb => cb.addEventListener('change', applyFilters));
applyFilters();

renderCart();
renderCartPage();
renderCheckoutSummary();

/* ===== ESC KEY ===== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeOrder();
    document.getElementById('csid')?.classList.remove('op');
    document.getElementById('covrl')?.classList.remove('op');
  }
});

/* ===== MOBILE NAV (HAMBURGER) ===== */
function toggleMobileNav() {
  const nav = document.getElementById("mobileNav");
  const overlay = document.getElementById("mobOverlay");

  nav.classList.toggle("open");
  overlay.classList.toggle("show");
}

function closeMobileNav() {
  const nav = document.getElementById("mobileNav");
  const overlay = document.getElementById("mobOverlay");

  nav.classList.remove("open");
  overlay.classList.remove("show");
}