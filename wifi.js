const el = {
  net: document.getElementById("net"),
  week: document.getElementById("week"),
  pw: document.getElementById("pw"),
  copy: document.getElementById("copy"),
  connect: document.getElementById("connect"),
  updated: document.getElementById("updated"),
  toast: document.getElementById("toast"),
  overlay: document.getElementById("overlay"),
  card: document.querySelector(".card"),
};

let current = null;
let revealed = false;

function toast(msg) {
  el.toast.textContent = msg;
  el.toast.classList.add("show");
  setTimeout(() => el.toast.classList.remove("show"), 2000);
}

function render(data) {
  current = data;
  const ready = data && data.password && data.password !== "PENDIENTE";
  el.net.textContent = data.ssid || "—";
  el.week.textContent = data.week ? data.week : "";
  el.pw.textContent = data.password;
  el.pw.classList.toggle("pending", !ready);
  if (data.updatedAt) {
    const d = new Date(data.updatedAt);
    el.updated.textContent = "Actualizado: " + d.toLocaleString("es", { timeZone: "America/Guayaquil" });
  }
  el.copy.disabled = !ready;
  el.connect.disabled = !ready;
}

el.copy.addEventListener("click", async () => {
  if (!current || !current.password) return;
  try {
    await navigator.clipboard.writeText(current.password);
    toast("Contraseña copiada");
  } catch {
    toast("Copia manual: " + current.password);
  }
});

function isReady() {
  return !!current && !!current.password && current.password !== "PENDIENTE";
}

function tryConnect() {
  if (!isReady()) return;
  const uri = `WIFI:S:${current.ssid};T:WPA;P:${current.password};;`;
  try { window.location.href = uri; } catch (e) {}
}

function reveal() {
  if (revealed) return;
  revealed = true;
  el.card.hidden = false;
  el.overlay.classList.add("gone");
}

el.connect.addEventListener("click", tryConnect);

fetch("wifi.json", { cache: "no-store" })
  .then((r) => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then(render)
  .catch(() => render({ ssid: "Rojas-Rosero", password: "No disponible", week: "", updatedAt: null }))
  .finally(() => {
    if (isReady()) {
      tryConnect();
      setTimeout(reveal, 2500);
    } else {
      reveal();
    }
  });
