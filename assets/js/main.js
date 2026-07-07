document.addEventListener("DOMContentLoaded", () => {
  /* ─── STATE MANAGEMENT ────────────────────────────────── */
  let lang = "ar";
  let theme = "light";

  /* ─── DOM ELEMENTS ─────────────────────────────────────── */
  const htmlEl = document.documentElement;
  const navbar = document.querySelector(".navbar");
  const bttButton = document.querySelector(".btt");
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const toast = document.querySelector(".toast");
  const contactForm = document.querySelector("#contact-form");
  const serviceSelect = document.querySelector("#f-service");
  const locationSelect = document.querySelector("#f-location");

  /* ─── INITIALIZATION ───────────────────────────────────── */
  const savedLang = localStorage.getItem("lang");
  const savedTheme = localStorage.getItem("theme");

  if (savedLang === "ar" || savedLang === "en") {
    lang = savedLang;
  } else {
    const browserLang = navigator.language.substring(0, 2);
    lang = browserLang === "en" ? "en" : "ar";
  }

  if (savedTheme === "light" || savedTheme === "dark") {
    theme = savedTheme;
  } else {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme = systemDark ? "dark" : "light";
  }

  applyLanguage(lang);
  applyTheme(theme);

  /* ─── SCROLL MONITORING ───────────────────────────────── */
  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    if (scrollY > 400) {
      bttButton.classList.add("show");
    } else {
      bttButton.classList.remove("show");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  bttButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ─── MOBILE HAMBURGER MENU ────────────────────────────── */
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  document.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    });
  });

  /* ─── LANGUAGE SWITCHER ───────────────────────────────── */
  function applyLanguage(selectedLang) {
    lang = selectedLang;
    htmlEl.setAttribute("lang", lang);
    htmlEl.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("lang", lang);

    document.querySelectorAll("[data-placeholder-ar]").forEach(el => {
      el.placeholder = lang === "ar"
        ? el.getAttribute("data-placeholder-ar")
        : el.getAttribute("data-placeholder-en");
    });

    updateSelectOptionsText();

    document.querySelectorAll(".lang-toggle-btn-text").forEach(el => {
      el.textContent = lang === "ar" ? "English" : "عربي";
    });
  }

  function updateSelectOptionsText() {
    const serviceDefault = serviceSelect.options[0];
    serviceDefault.textContent = lang === "ar"
      ? serviceSelect.getAttribute("data-default-ar")
      : serviceSelect.getAttribute("data-default-en");

    const locationDefault = locationSelect.options[0];
    locationDefault.textContent = lang === "ar"
      ? locationSelect.getAttribute("data-default-ar")
      : locationSelect.getAttribute("data-default-en");
  }

  document.querySelectorAll(".lang-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      applyLanguage(lang === "ar" ? "en" : "ar");
    });
  });

  /* ─── THEME SWITCHER ──────────────────────────────────── */
  function applyTheme(selectedTheme) {
    theme = selectedTheme;
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    document.querySelectorAll(".theme-toggle").forEach(btn => {
      const sunIcon = btn.querySelector(".sun-icon");
      const moonIcon = btn.querySelector(".moon-icon");
      if (theme === "light") {
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
      } else {
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
      }
    });
  }

  document.querySelectorAll(".theme-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      applyTheme(theme === "light" ? "dark" : "light");
    });
  });

  /* ─── INTERACTION: BOOK SERVICE ────────────────────────── */
  function bookService(serviceKey) {
    serviceSelect.value = serviceKey;
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  }
  // يبقى معرّض على window للتوافق الرجعي فقط إذا بقي أي onclick قديم في HTML
  window.bookService = bookService;

  // الطريقة الآمنة والمفضّلة: أزرار عليها data-book-service بدل onclick المضمّن
  document.querySelectorAll("[data-book-service]").forEach(btn => {
    btn.addEventListener("click", () => bookService(btn.dataset.bookService));
  });

  /* ─── MODAL CONTROLS ───────────────────────────────────── */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  }
  window.openModal = openModal;
  window.closeModal = closeModal;

  document.querySelectorAll("[data-modal-open]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.modalOpen));
  });

  document.querySelectorAll("[data-modal-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal-backdrop");
      if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
      }
    });
  });

  // إغلاق المودال بالضغط على المفتاح Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop").forEach(modal => {
        if (modal.style.display === "flex") {
          modal.style.display = "none";
          document.body.style.overflow = "";
        }
      });
    }
  });

  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.style.display = "none";
        document.body.style.overflow = "";
      }
    });
  });

  /* ─── FORM SUBMISSION (WHATSAPP REDIRECT) ──────────────── */
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector("#f-name").value;
    const phone = document.querySelector("#f-phone").value;
    const service = serviceSelect.value || "غير محدد / Unspecified";
    const city = locationSelect.value || "غير محدد / Unspecified";
    const msg = document.querySelector("#f-msg").value || "لا توجد تفاصيل / No details";

    const whatsappMessage = lang === "ar"
      ? `مرحباً مؤسسة محمد أحمد ادخيل للمقاولات،
لدي طلب خدمة جديد من الموقع الإلكتروني:

*الاسم:* ${name}
*رقم الجوال:* ${phone}
*الخدمة المطلوبة:* ${service}
*المدينة / الحي:* ${city}

*تفاصيل المشروع:*
${msg}`
      : `Hello Mohammed Ahmad Adkhil General Contracting,
I have a new service request from the website:

*Name:* ${name}
*Phone:* ${phone}
*Service Required:* ${service}
*City / Location:* ${city}

*Project Details:*
${msg}`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappNumber = "966508900022";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // إصلاح أمني: إضافة noopener,noreferrer لمنع هجوم Reverse Tabnabbing
    // (بدونها تقدر صفحة wa.me تتحكم بـ window.opener وتعيد توجيه تبويب موقعك الأصلي)
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    toast.classList.add("show");
    contactForm.reset();
    serviceSelect.value = "";

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  });

  /* ─── SCROLL REVEAL (INTERSECTION OBSERVER) ───────────── */
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }
});
