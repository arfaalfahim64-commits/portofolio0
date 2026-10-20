/**
 * Certificate Slider & Interactive Zoom Lightbox
 * Portofolio - Arfa Alfahim
 */

document.addEventListener('DOMContentLoaded', () => {
    // Render initial feather icons jika tersedia
    if (window.feather) {
        feather.replace();
    }

    // =========================================================================
    // 1. DATA SERTIFIKAT
    // =========================================================================
    const certCards = document.querySelectorAll('.cert-slide');
    if (!certCards.length) return;

    const certData = Array.from(certCards).map((slide, index) => {
        const img = slide.querySelector('.certificate-image img');
        const titleEl = slide.querySelector('.certificate-info h3');
        const descEl = slide.querySelector('.certificate-info p');
        const badgeEl = slide.querySelector('.cert-badge');

        if (img) {
            img.setAttribute('draggable', 'false');
            img.ondragstart = (e) => e.preventDefault();
        }

        return {
            index,
            src: img ? img.getAttribute('src') : '',
            alt: img ? img.getAttribute('alt') : `Sertifikat ${index + 1}`,
            title: titleEl ? titleEl.textContent.trim() : `Sertifikat ${index + 1}`,
            desc: descEl ? descEl.textContent.trim() : '',
            badge: badgeEl ? badgeEl.textContent.trim() : `0${index + 1}`
        };
    });

    const totalSlides = certData.length;
    let currentIndex = 0;

    // Elements Slider
    const sliderContainer = document.getElementById('certSliderContainer');
    const sliderTrack = document.getElementById('certSliderTrack');
    const prevBtn = document.getElementById('certPrevBtn');
    const nextBtn = document.getElementById('certNextBtn');
    const dotsContainer = document.getElementById('certDots');
    const currentNumEl = document.querySelector('.cert-current-num');
    const totalNumEl = document.querySelector('.cert-total-num');

    // =========================================================================
    // 2. INISIALISASI DOTS & COUNTER
    // =========================================================================
    if (totalNumEl) {
        totalNumEl.textContent = totalSlides < 10 ? `0${totalSlides}` : `${totalSlides}`;
    }

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `cert-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('type', 'button');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Lihat ${certData[i].title}`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    }

    // =========================================================================
    // 3. FUNGSI NAVIGASI SLIDER
    // =========================================================================
    function updateSlidePosition(smooth = true) {
        if (!sliderContainer || !sliderTrack) return;

        const slides = sliderTrack.querySelectorAll('.cert-slide');
        if (!slides.length) return;

        const containerWidth = sliderContainer.offsetWidth;
        const currentSlide = slides[currentIndex];
        const slideWidth = currentSlide.offsetWidth;

        // Gap antar slide dari CSS computed style
        const trackStyle = window.getComputedStyle(sliderTrack);
        const gap = parseFloat(trackStyle.gap) || 20;

        // Menghitung offset agar slide aktif berada tepat di tengah (center peeking)
        let slideOffsetLeft = 0;
        for (let i = 0; i < currentIndex; i++) {
            slideOffsetLeft += slides[i].offsetWidth + gap;
        }

        const centerOffset = (containerWidth - slideWidth) / 2;
        const targetTranslateX = centerOffset - slideOffsetLeft;

        sliderTrack.style.transition = smooth ? 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        sliderTrack.style.transform = `translateX(${targetTranslateX}px)`;

        // Update class active & aria
        slides.forEach((s, idx) => {
            if (idx === currentIndex) {
                s.classList.add('active');
                s.setAttribute('aria-hidden', 'false');
            } else {
                s.classList.remove('active');
                s.setAttribute('aria-hidden', 'true');
            }
        });

        // Update Dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.cert-dot');
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-selected', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.setAttribute('aria-selected', 'false');
                }
            });
        }

        // Update Counter
        if (currentNumEl) {
            const numStr = currentIndex + 1 < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`;
            currentNumEl.textContent = numStr;
        }

        // Update tooltip tombol Prev / Next
        if (prevBtn) {
            prevBtn.setAttribute('title', `Ke ${certData[(currentIndex - 1 + totalSlides) % totalSlides].title}`);
        }
        if (nextBtn) {
            nextBtn.setAttribute('title', `Ke ${certData[(currentIndex + 1) % totalSlides].title}`);
        }
    }

    function goToSlide(index, smooth = true) {
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        updateSlidePosition(smooth);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(currentIndex + 1);
        });
    }

    // Window resize handler untuk repositioning responsif
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateSlidePosition(false);
        }, 100);
    });

    // =========================================================================
    // 4. GESTUR SWIPE & DRAG MOUSE / TOUCH PADA SLIDER
    // =========================================================================
    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDraggingHorizontally = false;
    let dragThresholdPassed = false;
    let initialTranslateX = 0;

    function getTrackCurrentTranslateX() {
        const style = window.getComputedStyle(sliderTrack);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }

    sliderContainer.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button')) return;

        isPointerDown = true;
        startX = e.clientX;
        startY = e.clientY;
        currentX = e.clientX;
        isDraggingHorizontally = false;
        dragThresholdPassed = false;
        initialTranslateX = getTrackCurrentTranslateX();

        sliderTrack.style.transition = 'none';
    });

    window.addEventListener('pointermove', (e) => {
        if (!isPointerDown) return;

        currentX = e.clientX;
        const diffX = currentX - startX;
        const diffY = e.clientY - startY;

        // Deteksi arah gestur: horizontal vs scroll vertikal
        if (!dragThresholdPassed) {
            if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
                dragThresholdPassed = true;
                if (Math.abs(diffX) >= Math.abs(diffY)) {
                    isDraggingHorizontally = true;
                } else {
                    isDraggingHorizontally = false;
                    isPointerDown = false; // Biarkan scrolling halaman browser berlangsung normal
                    updateSlidePosition(true);
                    return;
                }
            }
        }

        if (isDraggingHorizontally) {
            e.preventDefault();
            sliderTrack.style.transform = `translateX(${initialTranslateX + diffX}px)`;
        }
    }, { passive: false });

    const handlePointerEnd = (e) => {
        if (!isPointerDown) return;
        isPointerDown = false;

        if (isDraggingHorizontally) {
            const diffX = currentX - startX;
            const swipeThreshold = 45; // pixel minimal untuk trigger ganti slide

            if (diffX < -swipeThreshold) {
                goToSlide(currentIndex + 1);
            } else if (diffX > swipeThreshold) {
                goToSlide(currentIndex - 1);
            } else {
                updateSlidePosition(true);
            }
        } else {
            updateSlidePosition(true);
        }
        isDraggingHorizontally = false;
    };

    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);

    // Keyboard navigation di slider saat slider dalam fokus
    sliderContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToSlide(currentIndex + 1);
        }
    });

    // Klik card non-aktif untuk langsung menuju ke slide tersebut
    certCards.forEach((slide, idx) => {
        slide.addEventListener('click', (e) => {
            if (dragThresholdPassed && isDraggingHorizontally) return;
            if (idx !== currentIndex) {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(idx);
            }
        });
    });

    // Klik pada image card untuk buka modal lightbox (hanya jika slide aktif dan bukan sedang drag)
    const certImageWrappers = document.querySelectorAll('.certificate-image');
    certImageWrappers.forEach((wrapper, idx) => {
        wrapper.addEventListener('click', (e) => {
            if (dragThresholdPassed && isDraggingHorizontally) return;
            if (idx === currentIndex) {
                openLightbox(idx);
            } else {
                goToSlide(idx);
            }
        });

        wrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(idx);
            }
        });
    });

    // Inisialisasi posisi awal slider
    setTimeout(() => {
        updateSlidePosition(false);
    }, 60);

    // =========================================================================
    // 5. LIGHTBOX & INTERACTIVE ZOOM / PAN MODAL
    // =========================================================================
    const lightbox = document.getElementById('certificateLightbox');
    if (!lightbox) return;

    const lightboxBackdrop = document.getElementById('certLightboxBackdrop');
    const lightboxTitle = document.getElementById('certLightboxTitle');
    const lightboxSubtitle = document.getElementById('certLightboxSubtitle');
    const lightboxImg = document.getElementById('certLightboxImg');
    const lightboxViewport = document.getElementById('certLightboxViewport');
    const zoomLevelBadge = document.getElementById('certZoomLevel');

    const zoomInBtn = document.getElementById('certZoomInBtn');
    const zoomOutBtn = document.getElementById('certZoomOutBtn');
    const zoomResetBtn = document.getElementById('certZoomResetBtn');
    const closeBtn = document.getElementById('certCloseBtn');

    const modalPrevBtn = document.getElementById('certModalPrevBtn');
    const modalNextBtn = document.getElementById('certModalNextBtn');

    let activeModalIndex = 0;
    let zoomScale = 1;
    const minScale = 1;
    const maxScale = 4.5;
    const scaleStep = 0.35;

    let panX = 0;
    let panY = 0;
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;

    let initialTouchDistance = 0;
    let initialScaleOnPinch = 1;

    function applyImageTransform(smooth = true) {
        if (!lightboxImg) return;
        lightboxImg.style.transition = smooth ? 'transform 0.22s ease-out' : 'none';
        lightboxImg.style.transform = `translate3d(${panX}px, ${panY}px, 0px) scale(${zoomScale})`;

        if (zoomLevelBadge) {
            zoomLevelBadge.textContent = `${Math.round(zoomScale * 100)}%`;
        }

        if (zoomScale > 1) {
            lightboxImg.classList.add('can-pan');
            if (isPanning) {
                lightboxImg.classList.add('is-panning');
            } else {
                lightboxImg.classList.remove('is-panning');
            }
        } else {
            lightboxImg.classList.remove('can-pan', 'is-panning');
        }

        if (zoomOutBtn) zoomOutBtn.disabled = zoomScale <= minScale;
        if (zoomInBtn) zoomInBtn.disabled = zoomScale >= maxScale;
    }

    function resetZoom(smooth = true) {
        zoomScale = 1;
        panX = 0;
        panY = 0;
        applyImageTransform(smooth);
    }

    function setZoom(newScale, centerX, centerY, smooth = true) {
        const clampedScale = Math.min(Math.max(newScale, minScale), maxScale);

        if (clampedScale === minScale) {
            panX = 0;
            panY = 0;
        } else if (centerX !== undefined && centerY !== undefined && lightboxImg) {
            const rect = lightboxImg.getBoundingClientRect();
            const ratio = clampedScale / zoomScale;

            const offsetX = centerX - (rect.left + rect.width / 2);
            const offsetY = centerY - (rect.top + rect.height / 2);

            panX -= offsetX * (ratio - 1) * 0.5;
            panY -= offsetY * (ratio - 1) * 0.5;
        }

        zoomScale = clampedScale;
        applyImageTransform(smooth);
    }

    function loadCertificateToModal(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        activeModalIndex = index;
        const cert = certData[activeModalIndex];
        if (!cert) return;

        resetZoom(false);

        lightboxImg.style.opacity = '0';
        lightboxImg.src = cert.src;
        lightboxImg.alt = cert.alt;

        if (lightboxTitle) lightboxTitle.textContent = cert.title;
        if (lightboxSubtitle) lightboxSubtitle.textContent = cert.desc;

        lightboxImg.onload = () => {
            lightboxImg.style.opacity = '1';
        };

        // Sinkronkan slider ke card terkait
        goToSlide(activeModalIndex, false);
    }

    function openLightbox(index) {
        loadCertificateToModal(index);

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('cert-modal-open');

        if (window.feather) {
            feather.replace();
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('cert-modal-open');
        resetZoom(false);
    }

    // Expose fungsi ke global untuk kompatibilitas
    window.openCertificate = function (imageSrc) {
        const foundIdx = certData.findIndex(c => c.src === imageSrc || imageSrc.includes(c.src));
        if (foundIdx !== -1) {
            openLightbox(foundIdx);
        } else {
            openLightbox(0);
        }
    };

    window.closeCertificate = closeLightbox;

    // =========================================================================
    // 6. EVENT LISTENER LIGHTBOX KONTROL
    // =========================================================================
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    if (lightboxViewport) {
        lightboxViewport.addEventListener('click', (e) => {
            if (e.target === lightboxViewport && zoomScale === 1 && !isPanning) {
                closeLightbox();
            }
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            setZoom(zoomScale + scaleStep);
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            setZoom(zoomScale - scaleStep);
        });
    }

    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', () => {
            resetZoom(true);
        });
    }

    if (modalPrevBtn) {
        modalPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            loadCertificateToModal(activeModalIndex - 1);
        });
    }

    if (modalNextBtn) {
        modalNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            loadCertificateToModal(activeModalIndex + 1);
        });
    }

    // Double-click gambar untuk toggle zoom (1x <-> 2.2x)
    if (lightboxImg) {
        lightboxImg.addEventListener('dblclick', (e) => {
            e.preventDefault();
            if (zoomScale > 1) {
                resetZoom(true);
            } else {
                setZoom(2.2, e.clientX, e.clientY, true);
            }
        });
    }

    // Mouse wheel zoom
    if (lightboxViewport) {
        lightboxViewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? scaleStep : -scaleStep;
            setZoom(zoomScale + delta, e.clientX, e.clientY, false);
        }, { passive: false });
    }

    // Mouse & Touch Pan (Drag saat di-zoom)
    if (lightboxViewport) {
        lightboxViewport.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button')) return;

            if (zoomScale > 1) {
                isPanning = true;
                panStartX = e.clientX - panX;
                panStartY = e.clientY - panY;
                lightboxImg.setPointerCapture?.(e.pointerId);
                applyImageTransform(false);
            }
        });

        window.addEventListener('pointermove', (e) => {
            if (!isPanning || zoomScale <= 1) return;

            panX = e.clientX - panStartX;
            panY = e.clientY - panStartY;

            // Batasi jarak panning agar gambar tetap proporsional dalam layar
            const limitX = (window.innerWidth * (zoomScale - 0.7)) / 2;
            const limitY = (window.innerHeight * (zoomScale - 0.7)) / 2;
            panX = Math.max(-limitX, Math.min(limitX, panX));
            panY = Math.max(-limitY, Math.min(limitY, panY));

            applyImageTransform(false);
        });

        const endPan = (e) => {
            if (isPanning) {
                isPanning = false;
                applyImageTransform(true);
            }
        };

        window.addEventListener('pointerup', endPan);
        window.addEventListener('pointercancel', endPan);
    }

    // Touch Pinch to Zoom
    if (lightboxViewport) {
        lightboxViewport.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                initialTouchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                initialScaleOnPinch = zoomScale;
            }
        }, { passive: false });

        lightboxViewport.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialTouchDistance > 0) {
                e.preventDefault();
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const currentDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                const scaleFactor = currentDistance / initialTouchDistance;
                const newScale = initialScaleOnPinch * scaleFactor;

                const midX = (t1.clientX + t2.clientX) / 2;
                const midY = (t1.clientY + t2.clientY) / 2;

                setZoom(newScale, midX, midY, false);
            }
        }, { passive: false });

        lightboxViewport.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                initialTouchDistance = 0;
            }
        });
    }

    // Keyboard Shortcuts Global saat modal terbuka
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case '+':
            case '=':
                setZoom(zoomScale + scaleStep);
                break;
            case '-':
            case '_':
                setZoom(zoomScale - scaleStep);
                break;
            case '0':
            case 'r':
            case 'R':
                resetZoom(true);
                break;
            case 'ArrowLeft':
                loadCertificateToModal(activeModalIndex - 1);
                break;
            case 'ArrowRight':
                loadCertificateToModal(activeModalIndex + 1);
                break;
            default:
                break;
        }
    });
});
