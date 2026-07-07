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
  
  // Modals
  const privacyModal = document.querySelector("#privacy-modal");
  const termsModal = document.querySelector("#terms-modal");

  /* ─── INITIALIZATION ───────────────────────────────────── */
  const savedLang = localStorage.getItem("lang");
  const savedTheme = localStorage.getItem("theme");

  // Determine starting language
  if (savedLang === "ar" || savedLang === "en") {
    lang = savedLang;
  } else {
    const browserLang = navigator.language.substring(0, 2);
    lang = browserLang === "en" ? "en" : "ar";
  }

  // Determine starting theme
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
    
    // Navbar background transition
    if (scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Back to top button visibility
    if (scrollY > 400) {
      bttButton.classList.add("show");
    } else {
      bttButton.classList.remove("show");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Run immediately

  // Back to top click handler
  bttButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ─── MOBILE HAMBURGER MENU ────────────────────────────── */
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  // Close mobile menu when links are clicked
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

    // Update form placeholders dynamically based on attributes
    document.querySelectorAll("[data-placeholder-ar]").forEach(el => {
      el.placeholder = lang === "ar" 
        ? el.getAttribute("data-placeholder-ar") 
        : el.getAttribute("data-placeholder-en");
    });

    // Update select option labels
    updateSelectOptionsText();

    // Toggle button active labels in UI
    document.querySelectorAll(".lang-toggle-btn-text").forEach(el => {
      el.textContent = lang === "ar" ? "English" : "عربي";
    });
  }

  function updateSelectOptionsText() {
    // Service Select placeholders
    const serviceDefault = serviceSelect.options[0];
    serviceDefault.textContent = lang === "ar" 
      ? serviceSelect.getAttribute("data-default-ar") 
      : serviceSelect.getAttribute("data-default-en");

    // Location Select placeholders
    const locationDefault = locationSelect.options[0];
    locationDefault.textContent = lang === "ar" 
      ? locationSelect.getAttribute("data-default-ar") 
      : locationSelect.getAttribute("data-default-en");
  }

  // Bind click handlers to language toggles
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

    // Update theme toggle icons (show moon for light theme, sun for dark theme)
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

  // Bind click handlers to theme toggles
  document.querySelectorAll(".theme-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      applyTheme(theme === "light" ? "dark" : "light");
    });
  });

  /* ─── INTERACTION: BOOK SERVICE ────────────────────────── */
  window.bookService = (serviceKey) => {
    serviceSelect.value = serviceKey;
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ─── MODAL CONTROLS ───────────────────────────────────── */
  window.openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
    }
  };

  window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  };

  // Close modals when clicking backdrop
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

    // Format WhatsApp message template based on current language
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

    // Open WhatsApp redirect in new tab
    window.open(whatsappUrl, "_blank");

    // Display localized redirection toast
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
