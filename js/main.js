/* =========================================================
   HEADER SCROLL STATE
   ========================================================= */

const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
});

/* =========================================================
   CUSTOM SELECT
   ========================================================= */

document.querySelectorAll(".custom-select").forEach((select) => {
    const trigger = select.querySelector(".custom-select-trigger");
    const dropdown = select.querySelector(".custom-select-dropdown");
    const input = select.querySelector('input[type="hidden"]');

    // Toggle dropdown
    trigger.addEventListener("click", () => {
        select.classList.toggle("open");
    });

    // Select option
    dropdown.querySelectorAll("li").forEach((item) => {
        item.addEventListener("click", () => {
            trigger.querySelector("span").textContent = item.textContent;
            input.value = item.dataset.value;
            select.classList.remove("open");
        });
    });

    // Close on outside click
    document.addEventListener("click", (event) => {
        if (!select.contains(event.target)) {
            select.classList.remove("open");
        }
    });
});

/* =========================================================
   FORM VALIDATION + TELEGRAM REDIRECT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".consultation-form");
    if (!form) return;

    const requiredFields = form.querySelectorAll("[required]");

    /* ---------- SUBMIT ---------- */

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let hasErrors = false;

        requiredFields.forEach((field) => {
            const group = field.closest(".form-group");
            clearError(group);

            if (!field.value.trim()) {
                showError(group, field);
                hasErrors = true;
            }
        });

        if (hasErrors) return;

        /* ---------- COLLECT DATA ---------- */

        const name =
            form.querySelector('input[placeholder="Алишер"]')?.value.trim() ||
            "—";

        const telegram =
            form
                .querySelector('input[placeholder="@your_username"]')
                ?.value.trim() || "—";

        const subject =
            form
                .querySelector('input[placeholder="Экономика / История..."]')
                ?.value.trim() || "—";

        const details = form.querySelector("textarea")?.value.trim() || "—";

        const workType =
            form.querySelector('input[name="work_type"]')?.value || "—";

        /* ---------- FORMAT MESSAGE ---------- */

        const message = `📝 Заявка с сайта Flayzex UniHelp

👤 Имя: ${name}
📬 Telegram: ${telegram}
📚 Тип работы: ${workType}
📖 Предмет / Тема: ${subject}
🗒 Дополнительные детали:
${details}`;

        /* ---------- TELEGRAM REDIRECT ---------- */

        const telegramUsername = "demetri0us";
        const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(
            message
        )}`;

        window.open(telegramUrl, "_blank");
    });

    /* ---------- LIVE ERROR CLEAR ---------- */

    requiredFields.forEach((field) => {
        field.addEventListener("input", () => {
            const group = field.closest(".form-group");
            clearError(group);
        });
    });

    /* =====================================================
       HELPERS
       ===================================================== */

    function showError(group, field) {
        group.classList.add("is-error");

        const error = document.createElement("div");
        error.className = "error-text";

        if (field.tagName === "SELECT") {
            error.textContent = "Выберите тип работы";
        } else if (field.name === "telegram") {
            error.textContent = "Telegram Username обязателен";
        } else {
            error.textContent = "Это поле обязательно";
        }

        group.appendChild(error);
    }

    function clearError(group) {
        if (!group) return;

        group.classList.remove("is-error");
        const error = group.querySelector(".error-text");
        if (error) error.remove();
    }
});
