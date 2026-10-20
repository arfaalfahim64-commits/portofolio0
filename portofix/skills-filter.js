/**
 * Skills Category Filter & Interactive Cards
 * Portofolio - Arfa Alfahim
 */

document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-modern-card');

    if (!filterBtns.length || !skillCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update active state pada tombol
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Filter kartu skill dengan animasi transisi
            skillCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    // Re-trigger animation
                    card.classList.remove('skill-card-hidden');
                    card.classList.add('skill-card-visible');
                } else {
                    card.classList.remove('skill-card-visible');
                    card.classList.add('skill-card-hidden');
                    setTimeout(() => {
                        if (card.classList.contains('skill-card-hidden')) {
                            card.style.display = 'none';
                        }
                    }, 200);
                }
            });
        });
    });
});
