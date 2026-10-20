/**
 * Contact Form Handler (AJAX Email Submission & Validation)
 * Portofolio - Arfa Alfahim
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const statusBox = document.getElementById('contactStatusBox');

    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    // Helper: Validasi format email regex
    function isValidEmail(email) {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
        return re.test(String(email).trim());
    }

    // Helper: Tampilkan status notifikasi
    function showStatus(type, title, message) {
        if (!statusBox) return;

        statusBox.className = `contact-status-box status-${type}`;
        statusBox.innerHTML = `
            <div class="status-icon">
                <i data-feather="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
            </div>
            <div class="status-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;
        statusBox.style.display = 'flex';

        if (window.feather) {
            feather.replace();
        }

        // Scroll halus jika di mobile
        if (window.innerWidth < 768) {
            statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function clearStatus() {
        if (!statusBox) return;
        statusBox.style.display = 'none';
        statusBox.className = 'contact-status-box';
        statusBox.innerHTML = '';
    }

    // Helper: Set / Clear input error
    function setError(input, errorEl, message) {
        if (input) input.classList.add('input-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    function clearError(input, errorEl) {
        if (input) input.classList.remove('input-error');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
    }

    // Real-time error clearing saat user mengetik
    [
        [nameInput, nameError],
        [emailInput, emailError],
        [subjectInput, subjectError],
        [messageInput, messageError]
    ].forEach(([inp, err]) => {
        if (inp) {
            inp.addEventListener('input', () => {
                if (inp.value.trim() !== '') {
                    clearError(inp, err);
                }
            });
        }
    });

    // Validasi saat submit
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearStatus();

        let isValid = true;

        // Validasi Nama
        const nameVal = nameInput ? nameInput.value.trim() : '';
        if (!nameVal) {
            setError(nameInput, nameError, 'Nama wajib diisi.');
            isValid = false;
        } else if (nameVal.length < 2) {
            setError(nameInput, nameError, 'Nama minimal 2 karakter.');
            isValid = false;
        } else {
            clearError(nameInput, nameError);
        }

        // Validasi Email
        const emailVal = emailInput ? emailInput.value.trim() : '';
        if (!emailVal) {
            setError(emailInput, emailError, 'Email wajib diisi.');
            isValid = false;
        } else if (!isValidEmail(emailVal)) {
            setError(emailInput, emailError, 'Format email tidak valid (contoh: nama@domain.com).');
            isValid = false;
        } else {
            clearError(emailInput, emailError);
        }

        // Validasi Subjek
        const subjectVal = subjectInput ? subjectInput.value.trim() : '';
        if (!subjectVal) {
            setError(subjectInput, subjectError, 'Subjek pesan wajib diisi.');
            isValid = false;
        } else {
            clearError(subjectInput, subjectError);
        }

        // Validasi Pesan
        const messageVal = messageInput ? messageInput.value.trim() : '';
        if (!messageVal) {
            setError(messageInput, messageError, 'Pesan wajib diisi.');
            isValid = false;
        } else if (messageVal.length < 10) {
            setError(messageInput, messageError, 'Pesan terlalu singkat (minimal 10 karakter).');
            isValid = false;
        } else {
            clearError(messageInput, messageError);
        }

        if (!isValid) return;

        // Siapkan Payload Pengiriman
        const targetEmail = 'arfaalfahim64@gmail.com';
        const endpoint = `https://formsubmit.co/ajax/${targetEmail}`;

        const payload = {
            name: nameVal,
            email: emailVal,
            _subject: `[Portfolio Arfa] ${subjectVal}`,
            message: messageVal,
            _template: 'table',
            _captcha: 'false'
        };

        // Loading State pada Tombol
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="btn-spinner"></span>
            <span>Mengirim Pesan...</span>
        `;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && (data.success === 'true' || data.success === true)) {
                // Sukses terkirim!
                showStatus(
                    'success',
                    'Pesan Berhasil Terkirim!',
                    'Terima kasih telah menghubungi saya. Pesan Anda telah masuk ke email saya dan akan segera saya balas.'
                );
                // Kosongkan form setelah sukses
                contactForm.reset();
            } else {
                // Respons dari service tidak sukses
                const errorMsg = data.message || 'Gagal mengirim pesan melalui server email.';
                showStatus(
                    'error',
                    'Pengiriman Terkendala',
                    `${errorMsg} Silakan coba lagi atau kirimkan langsung ke arfaalfahim64@gmail.com.`
                );
            }
        } catch (err) {
            console.error('Contact Form Network Error:', err);
            showStatus(
                'error',
                'Gagal Terhubung',
                'Terjadi gangguan jaringan saat mengirim pesan. Pastikan koneksi internet Anda aktif lalu coba kembali.'
            );
            // Form TIDAK direset agar isi ketikan user tidak hilang
        } finally {
            // Kembalikan tombol ke state normal
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
            if (window.feather) {
                feather.replace();
            }
        }
    });

    // Salin email cepat
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'arfaalfahim64@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                const originalText = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = '<i data-feather="check"></i> <span>Tersalin!</span>';
                if (window.feather) feather.replace();
                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalText;
                    if (window.feather) feather.replace();
                }, 2000);
            }).catch(() => {
                window.location.href = `mailto:${email}`;
            });
        });
    }
});
