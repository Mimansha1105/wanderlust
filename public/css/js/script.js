(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });

  const themeToggle = document.getElementById("themeToggle");
  const setThemeIcon = (isDark) => {
    if (!themeToggle) return;
    themeToggle.innerHTML = isDark
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  };

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    document.documentElement.setAttribute("data-bs-theme", "dark");
    setThemeIcon(true);
  } else {
    document.documentElement.setAttribute("data-bs-theme", "light");
    setThemeIcon(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      document.documentElement.setAttribute(
        "data-bs-theme",
        isDark ? "dark" : "light"
      );
      localStorage.setItem("theme", isDark ? "dark" : "light");
      setThemeIcon(isDark);
    });
  }
})();
