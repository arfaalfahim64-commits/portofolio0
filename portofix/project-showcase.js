/**
 * Project Showcase & Detail Modal
 * Portofolio - Arfa Alfahim
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. DATA DETAIL PROYEK
    // =========================================================================
    const projectData = [
        {
            id: 1,
            category: 'Web Application',
            title: 'Jam Digital',
            urlMock: 'project.arfa.dev/jam-digital',
            desc: 'Aplikasi Jam Digital interaktif berbasis web yang dibangun dengan JavaScript murni. Menampilkan penunjuk waktu secara presisi dan real-time dengan tampilan modern, adaptif terhadap mode visual, serta responsif di berbagai perangkat.',
            tech: ['HTML5', 'CSS3', 'JavaScript'],
            img: 'sertif/project1.png',
            features: [
                'Penunjuk waktu akurat dan real-time (jam, menit, detik)',
                'Format tampilan waktu 12 jam dan 24 jam fleksibel',
                'Sinkronisasi kalender dan hari otomatis secara real-time',
                'Desain antarmuka bersih, adaptif, dan responsif di smartphone'
            ],
            solution: 'Mengoptimalkan interval perbaruan tampilan waktu tanpa membebani memori browser dengan timer DOM yang efisien dan hemat daya.',
            status: 'Completed'
        },
        {
            id: 2,
            category: 'Web Application',
            title: 'Sistem Inventaris',
            urlMock: 'project.arfa.dev/sistem-inventaris',
            desc: 'Aplikasi pengelolaan inventaris terpadu berbasis framework Laravel. Menyediakan solusi komprehensif untuk pencatatan barang masuk dan keluar, manajemen kategori, kontrol stok, serta pelaporan data inventaris yang akurat.',
            tech: ['PHP', 'Laravel', 'MySQL', 'Bootstrap'],
            img: 'sertif/project2.png',
            features: [
                'Manajemen lengkap data barang & kategori produk (CRUD)',
                'Kalkulasi dan pemantauan stok barang secara otomatis',
                'Fitur pencarian dan filter data barang secara efisien',
                'Sistem autentikasi aman bagi administrator inventaris'
            ],
            solution: 'Mengimplementasikan relasi basis data menggunakan Eloquent ORM Laravel untuk menjaga konsistensi data stok barang dan mempermudah pelacakan mutasi inventaris.',
            status: 'Completed'
        },
        {
            id: 3,
            category: 'Game Development',
            title: 'Roblox Game',
            urlMock: 'roblox.com/games/parkour-obby',
            desc: 'Game platformer rintangan (obstacle course / obby) interaktif di platform Roblox. Dirancang dengan variasi rintangan bertahap yang menguji kelincahan pemain serta menyajikan visual panggung yang menarik dan menyenangkan.',
            tech: ['Roblox Studio', 'Lua Scripting', '3D Level Design'],
            img: 'sertif/project3.png',
            features: [
                'Tantangan bertingkat dengan mekanik parkour dinamis',
                'Sistem checkpoint otomatis saat pemain menyelesaikan stage',
                'Efek visual dan animasi rintangan interaktif',
                'Level design 3D yang intuitif dan menantang'
            ],
            solution: 'Merancang scripting Lua untuk logika checkpoint dan hazard blocks yang responsif, serta melakukan penyesuaian fisika rintangan agar seimbang dan adil bagi pemain.',
            status: 'Completed'
        }
    ];

    let currentProjectIndex = 0;
    const totalProjects = projectData.length;

    // Elements Showcase
    const tabs = document.querySelectorAll('.project-pill-tab');
    const mainCard = document.getElementById('projectMainCard');
    const categoryBadgeText = document.querySelector('#projectCategoryBadge .badge-text');
    const titleEl = document.getElementById('projectTitle');
    const descEl = document.getElementById('projectDesc');
    const techContainer = document.getElementById('projectTechChips');
    const previewImg = document.getElementById('projectPreviewImg');
    const previewFrame = document.getElementById('projectPreviewFrame');
    const browserUrlBar = document.getElementById('browserUrlBar');
    const seeMoreBtn = document.getElementById('projectSeeMoreBtn');

    const prevBtn = document.getElementById('projPrevBtn');
    const nextBtn = document.getElementById('projNextBtn');
    const activeNumEl = document.getElementById('projActiveNum');
    const totalNumEl = document.getElementById('projTotalNum');

    // Elements Modal
    const modal = document.getElementById('projectDetailModal');
    const modalBackdrop = document.getElementById('projectModalBackdrop');
    const modalCloseBtn = document.getElementById('projectModalCloseBtn');
    const modalCatBadge = document.getElementById('modalCatBadge');
    const modalTitle = document.getElementById('modalProjectTitle');
    const modalImg = document.getElementById('modalProjectImg');
    const modalOverview = document.getElementById('modalProjectOverview');
    const modalFeatures = document.getElementById('modalProjectFeatures');
    const modalTech = document.getElementById('modalProjectTech');
    const modalSolution = document.getElementById('modalProjectSolution');

    if (totalNumEl) {
        totalNumEl.textContent = totalProjects < 10 ? `0${totalProjects}` : `${totalProjects}`;
    }

    // =========================================================================
    // 2. FUNGSI UPDATE TAMPILAN PROYEK
    // =========================================================================
    function switchProject(index, animate = true) {
        if (index < 0) index = totalProjects - 1;
        if (index >= totalProjects) index = 0;

        currentProjectIndex = index;
        const project = projectData[currentProjectIndex];
        if (!project) return;

        // Update Tabs Active State
        tabs.forEach((tab, idx) => {
            if (idx === currentProjectIndex) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        // Update Counter
        if (activeNumEl) {
            activeNumEl.textContent = currentProjectIndex + 1 < 10 ? `0${currentProjectIndex + 1}` : `${currentProjectIndex + 1}`;
        }

        if (animate && mainCard) {
            mainCard.classList.add('switching');
            setTimeout(() => {
                applyProjectContent(project);
                mainCard.classList.remove('switching');
            }, 180);
        } else {
            applyProjectContent(project);
        }
    }

    function applyProjectContent(project) {
        if (categoryBadgeText) categoryBadgeText.textContent = project.category;
        if (titleEl) titleEl.textContent = project.title;
        if (descEl) descEl.textContent = project.desc;
        if (browserUrlBar) browserUrlBar.textContent = project.urlMock;

        // Update Tech Chips
        if (techContainer) {
            techContainer.innerHTML = '';
            project.tech.forEach(tech => {
                const span = document.createElement('span');
                span.className = 'tech-chip';
                span.textContent = tech;
                techContainer.appendChild(span);
            });
        }

        // Update Preview Image
        if (previewImg) {
            previewImg.src = project.img;
            previewImg.alt = `Preview ${project.title}`;
        }

        if (window.feather) {
            feather.replace();
        }
    }

    // =========================================================================
    // 3. EVENT LISTENERS TAB & NAVIGASI
    // =========================================================================
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const index = parseInt(tab.getAttribute('data-project'), 10);
            if (!isNaN(index) && index !== currentProjectIndex) {
                switchProject(index, true);
            }
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            switchProject(currentProjectIndex - 1, true);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            switchProject(currentProjectIndex + 1, true);
        });
    }

    // Keyboard navigation di area showcase
    const showcaseSection = document.getElementById('project');
    if (showcaseSection) {
        showcaseSection.addEventListener('keydown', (e) => {
            if (modal && modal.classList.contains('active')) return;
            if (e.key === 'ArrowLeft') {
                switchProject(currentProjectIndex - 1, true);
            } else if (e.key === 'ArrowRight') {
                switchProject(currentProjectIndex + 1, true);
            }
        });
    }

    // =========================================================================
    // 4. MODAL DETAIL PROYEK
    // =========================================================================
    function openProjectModal(project) {
        if (!modal) return;

        if (modalCatBadge) modalCatBadge.textContent = project.category;
        if (modalTitle) modalTitle.textContent = project.title;
        if (modalImg) {
            modalImg.src = project.img;
            modalImg.alt = `Detail ${project.title}`;
        }
        if (modalOverview) modalOverview.textContent = project.desc;

        // Render Features
        if (modalFeatures) {
            modalFeatures.innerHTML = '';
            project.features.forEach(feat => {
                const li = document.createElement('li');
                li.innerHTML = `<i data-feather="check"></i> <span>${feat}</span>`;
                modalFeatures.appendChild(li);
            });
        }

        // Render Tech Tags
        if (modalTech) {
            modalTech.innerHTML = '';
            project.tech.forEach(tech => {
                const chip = document.createElement('span');
                chip.className = 'modal-tech-badge';
                chip.textContent = tech;
                modalTech.appendChild(chip);
            });
        }

        if (modalSolution) modalSolution.textContent = project.solution;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('proj-modal-open');

        if (window.feather) {
            feather.replace();
        }
    }

    function closeProjectModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('proj-modal-open');
    }

    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', () => {
            openProjectModal(projectData[currentProjectIndex]);
        });
    }

    if (previewFrame) {
        previewFrame.addEventListener('click', () => {
            openProjectModal(projectData[currentProjectIndex]);
        });

        previewFrame.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectModal(projectData[currentProjectIndex]);
            }
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });

    // Inisialisasi awal
    applyProjectContent(projectData[0]);
});
