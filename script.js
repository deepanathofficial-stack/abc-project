// ABC Consultant — frontend behaviour
// Handles the enquiry tabs and submits the form to the Python backend.

document.getElementById("year").textContent = new Date().getFullYear();

// -------------------------------------------------------------
// Point this at your running Flask backend (see backend/app.py)
// -------------------------------------------------------------
const API_BASE = "http://localhost:5000";

/* ---------------- Enquiry field tabs ---------------- */

const tabs = document.querySelectorAll(".field-tab");
const panels = document.querySelectorAll(".field-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.target));
});

function activateTab(targetId) {
  tabs.forEach((t) => {
    const active = t.dataset.target === targetId;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
  panels.forEach((p) => p.classList.toggle("is-active", p.id === targetId));
}

/* ---------------- Enquiry form submission ---------------- */

const form = document.getElementById("enquiry-form");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("form-status");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

function setError(fieldId, tabId, message) {
  document.getElementById(fieldId).classList.toggle("has-error", !!message);
  document.getElementById("err-" + fieldId).textContent = message || "";
  document.querySelector(`.field-tab[data-target="${tabId}"]`)
    .classList.toggle("has-error", !!message);
}

function validate() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();

  let firstInvalid = null;

  setError("name", "tab-name", name ? "" : "Please enter your name.");
  if (!name) firstInvalid = firstInvalid || "tab-name";

  let phoneErr = "";
  if (!phone) phoneErr = "Please enter a phone number.";
  else if (!PHONE_RE.test(phone)) phoneErr = "Enter a valid phone number.";
  setError("phone", "tab-phone", phoneErr);
  if (phoneErr) firstInvalid = firstInvalid || "tab-phone";

  let emailErr = "";
  if (!email) emailErr = "Please enter an email id.";
  else if (!EMAIL_RE.test(email)) emailErr = "Enter a valid email id.";
  setError("email", "tab-email", emailErr);
  if (emailErr) firstInvalid = firstInvalid || "tab-email";

  return { valid: !firstInvalid, firstInvalid, name, phone, email };
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  statusEl.className = "form-status";

  const { valid, firstInvalid, name, phone, email } = validate();
  if (!valid) {
    activateTab(firstInvalid);
    return;
  }

  const message = document.getElementById("message").value.trim();

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";

  try {
    const res = await fetch(`${API_BASE}/api/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, message }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      statusEl.textContent = "Thanks — we've received your enquiry and will be in touch soon.";
      statusEl.classList.add("success");
      form.reset();
      activateTab("tab-name");
    } else {
      statusEl.textContent = "Something went wrong. Please check your details and try again.";
      statusEl.classList.add("error");
    }
  } catch (err) {
    statusEl.textContent = "Could not reach the server. Is the backend running?";
    statusEl.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit enquiry";
  }
});
