/* 資料區 */
const CONTEST_DATA = [
    {
        id: 1,
        title: "全國技能競賽「網路安全」北區賽",
        award: "金牌獎",
        date: "2023-12",
        images: [
            "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
            "image/performance/001_01.png",
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
        ],
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
        description: "這次比賽主要針對 AI 影像辨識進行研究。在過程中我們遇到了模型準確度不足的問題，後來透過資料增強（Data Augmentation）技術解決了。\n\n我們團隊一共三人，歷時三個月開發，最終很榮幸能獲得評審的青睞。",
        tags: ["AI", "Python", "團體賽"]
    },
    {
        id: 2,
        title: "施工中",
        award: "無",
        date: "0000-00",
        image: "assets/image/icon/constructing.png",
        description: "",
        tags: [""],
        customImgStyle: "object-fit: contain; padding: 1rem; background: #222;"
    }
];

const PROJECT_DATA = [
    {
        id: 101,
        title: "股票損益日程表",
        date: "2025-06",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        description: "<a href='invest_calendar.html' target='_blank' style='color: #60a5fa; text-decoration: underline;'>點此瀏覽</a>",
        tags: ["長期持有","股票"]
    },
    {
        id: 102,
        title: "黑膠唱片機",
        date: "2025-12",
        image: "assets/image/icon/black.jpg",
        description: "<a href='black7.html' target='_blank' style='color: #60a5fa; text-decoration: underline;'>點此瀏覽</a>",
        tags: ["可背景撥放"]
    },
    {
        id: 103,
        title: "個人日程表",
        date: "2025-08",
        image: "assets/image/icon/schemdule.png",
        description: "<a href='schemdule.html' target='_blank' style='color: #60a5fa; text-decoration: underline;'>點此瀏覽</a>",
        tags: ["規律"]
    },
    {
        id: 104,
        title: "合併 pdf",
        date: "2026-01",
        image: "assets/image/icon/pdf_mix.jpg",
        description: "<a href='https://github.com/borui0312/borui0312.github.io/blob/main/project/mix_pdf.rar' target='_blank' style='color: #60a5fa; text-decoration: underline;'>點此瀏覽</a>",
        tags: ["Python"],
        customImgStyle: "object-fit: contain; padding: 1rem; background: #222;"
    }
];

const WORKSHOP_DATA = [
    {
        id: 201,
        title: "施工中",
        award: "無",
        date: "0000-00",
        image: "assets/image/icon/constructing.png",
        description: "",
        tags: [""],
        customImgStyle: "object-fit: contain; padding: 1rem; background: #222;"
    }
];

const carouselState = {
    contest: 0,
    project: 0,
    workshop: 0
};

let activeGridSection = null;

let modalImages = [];
let modalImageIndex = 0;

const modalOverlay = document.getElementById('modalOverlay');

function init() {
    renderAllSections();

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    setupAllCarousels();
    setupToggleButtons();

    setTimeout(() => {
        document.querySelectorAll('.carousel-view').forEach(el => el.style.opacity = '1');
    }, 100);
}

function createCardHTML(item, isSlide = false) {
    const wrapperClass = isSlide ? "carousel-item" : "";
    const coverImage = item.images && item.images.length > 0 ? item.images[0] : item.image;
    const delay = (item.id % 5) * 0.1;
    const animationStyle = `animation-delay: ${delay}s`;

    let cleanDesc = item.description.replace(/<[^>]*>?/gm, '');
    let displayDesc = cleanDesc.length > 100 ? cleanDesc.substring(0, 100) + '...' : cleanDesc;

    // ✨ 判斷是否有 award，有才顯示右上角標籤
    const awardHTML = item.award ? `
        <div class="card-badge">
            <i data-lucide="award"></i>
            ${item.award}
        </div>` : '';

    // ✨ 判斷是否有 date，有才顯示日期
    const dateHTML = item.date ? `<div class="card-meta">${item.date}</div>` : '';

    const cardContent = `
        <div class="card slide-up" style="${animationStyle}" onclick="openModal(${item.id})">
            <div class="card-img-wrapper">
                <img src="${coverImage}" alt="${item.title}" class="card-img" ${item.customImgStyle ? `style="${item.customImgStyle}"` : ''}>
                
                ${awardHTML}
                
                ${item.images && item.images.length > 1 ? `
                <div style="position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.6); padding:2px 6px; border-radius:4px; font-size:10px; color:#ccc; display:flex; align-items:center; gap:4px; border:1px solid rgba(255,255,255,0.1);">
                    <i data-lucide="images" style="width:12px; height:12px;"></i>
                    ${item.images.length}
                </div>
                ` : ''}
            </div>

            <div class="card-content">
                ${dateHTML}
                <h3 class="card-title">${item.title}</h3>
                <p class="card-desc">${displayDesc}</p>
                
                <div class="card-footer">
                    查看詳情 <i data-lucide="external-link" style="width:14px; margin-left:4px;"></i>
                </div>
            </div>
        </div>
    `;

    if (isSlide) return `<div class="${wrapperClass}">${cardContent}</div>`;
    return cardContent;
}

function renderAllSections() {
    const sections = [
        { data: CONTEST_DATA, trackId: 'carouselTrack', gridId: 'gridView' },
        { data: PROJECT_DATA, trackId: 'projectTrack', gridId: 'projectGrid' },
        { data: WORKSHOP_DATA, trackId: 'workshopTrack', gridId: 'workshopGrid' }
    ];

    sections.forEach(sec => {
        const track = document.getElementById(sec.trackId);
        const grid = document.getElementById(sec.gridId);
        if (track) track.innerHTML = sec.data.map(item => createCardHTML(item, true)).join('');
        if (grid) grid.innerHTML = sec.data.map(item => createCardHTML(item, false)).join('');
    });
}

function updateCarousel(type, data, trackId, prevBtnId, nextBtnId) {
    let itemsPerScreen = window.innerWidth < 640 ? 2 : 4;
    const track = document.getElementById(trackId);
    const prev = document.getElementById(prevBtnId);
    const next = document.getElementById(nextBtnId);

    if (track && track.children.length > 0) {
        const itemWidth = track.children[0].offsetWidth;
        const moveAmountPx = carouselState[type] * itemWidth;
        track.style.transform = `translateX(-${moveAmountPx}px)`;
    }

    if (prev) prev.disabled = carouselState[type] === 0;
    if (next) next.disabled = carouselState[type] >= data.length - itemsPerScreen;
}

function setupAllCarousels() {
    const configs = [
        { type: 'contest', data: CONTEST_DATA, track: 'carouselTrack', prev: 'prevBtn', next: 'nextBtn' },
        { type: 'project', data: PROJECT_DATA, track: 'projectTrack', prev: 'projectPrev', next: 'projectNext' },
        { type: 'workshop', data: WORKSHOP_DATA, track: 'workshopTrack', prev: 'workshopPrev', next: 'workshopNext' }
    ];

    configs.forEach(cfg => {
        const prevBtn = document.getElementById(cfg.prev);
        const nextBtn = document.getElementById(cfg.next);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (carouselState[cfg.type] > 0) {
                    carouselState[cfg.type]--;
                    updateCarousel(cfg.type, cfg.data, cfg.track, cfg.prev, cfg.next);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let itemsPerScreen = window.innerWidth < 640 ? 2 : 4;
                if (carouselState[cfg.type] < cfg.data.length - itemsPerScreen) {
                    carouselState[cfg.type]++;
                    updateCarousel(cfg.type, cfg.data, cfg.track, cfg.prev, cfg.next);
                }
            });
        }

        // 初始狀態更新
        updateCarousel(cfg.type, cfg.data, cfg.track, cfg.prev, cfg.next);
    });
}

window.addEventListener('resize', () => {
    const configs = [
        { type: 'contest', data: CONTEST_DATA, track: 'carouselTrack', prev: 'prevBtn', next: 'nextBtn' },
        { type: 'project', data: PROJECT_DATA, track: 'projectTrack', prev: 'projectPrev', next: 'projectNext' },
        { type: 'workshop', data: WORKSHOP_DATA, track: 'workshopTrack', prev: 'workshopPrev', next: 'workshopNext' }
    ];
    configs.forEach(cfg => {
        carouselState[cfg.type] = 0;
        updateCarousel(cfg.type, cfg.data, cfg.track, cfg.prev, cfg.next);
    });
});

/* 顯示全部 */
function setupToggleButtons() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    toggleBtns.forEach(btn => {
        const sectionType = btn.getAttribute('data-section');
        
        // 動態顯示數量
        const dataCounts = {
            'contest': CONTEST_DATA.length,
            'project': PROJECT_DATA.length,
            'workshop': WORKSHOP_DATA.length
        };
        const initSpan = btn.querySelector('span');
        if (initSpan && sectionType && dataCounts[sectionType]) {
            initSpan.textContent = `顯示全部 (${dataCounts[sectionType]})`;
        }

        btn.addEventListener('click', function() {
            const currentSectionType = this.getAttribute('data-section');
            
            const allHeaders = document.querySelectorAll('.section-header');
            const allCarousels = document.querySelectorAll('.carousel-view');
            const allGrids = document.querySelectorAll('.grid-view');
            const allSpacers = document.querySelectorAll('.section-spacer');

            const iconGrid = this.querySelector('.icon-grid');
            const iconLayout = this.querySelector('.icon-layout');
            const textSpan = this.querySelector('span'); 
            
            // 抓取當前點擊按鈕所在的 section-header
            const currentHeader = this.closest('.section-header');

            if (activeGridSection !== currentSectionType) {
                // 切換為「格狀顯示 (專注模式)」
                activeGridSection = currentSectionType;
                
                allHeaders.forEach(el => el.style.display = 'none');
                allSpacers.forEach(el => el.style.display = 'none');
                allGrids.forEach(el => el.style.display = 'none');

                // ✨ 關鍵修復點：不僅隱藏輪播圖，更要徹底隱藏外層那個會造成空白的 400px 隱形容器！
                allCarousels.forEach(el => {
                    el.classList.add('hidden');
                    if (el.parentElement) {
                        el.parentElement.style.display = 'none';
                    }
                });
                
                const targetGridId = currentSectionType === 'contest' ? 'gridView' : `${currentSectionType}Grid`;
                const targetGrid = document.getElementById(targetGridId);
                
                if (currentHeader) currentHeader.style.display = '';
                if (targetGrid) {
                    // 把目標網格所屬的外層容器顯示回來
                    if (targetGrid.parentElement) {
                        targetGrid.parentElement.style.display = '';
                    }
                    targetGrid.style.display = 'grid';
                }
                
                if (textSpan) textSpan.textContent = '切換回輪播';
                if (iconGrid) iconGrid.classList.add('hidden');
                if (iconLayout) iconLayout.classList.remove('hidden');

                // ✨ 畫面完全沒空白了，只要瞬間回到最上方即可！
                window.scrollTo({ top: 0, behavior: 'smooth' });

            } else {
                // 切換回「輪播模式」
                activeGridSection = null;
                
                allHeaders.forEach(el => el.style.display = '');
                allSpacers.forEach(el => el.style.display = '');
                allGrids.forEach(el => el.style.display = 'none');

                // 恢復所有的外層容器與輪播圖
                allCarousels.forEach(el => {
                    el.classList.remove('hidden');
                    if (el.parentElement) {
                        el.parentElement.style.display = '';
                    }
                });
                
                if (textSpan) textSpan.textContent = `顯示全部 (${dataCounts[currentSectionType]})`;
                if (iconLayout) iconLayout.classList.add('hidden');
                if (iconGrid) iconGrid.classList.remove('hidden');
                
                carouselState[currentSectionType] = 0;
                
                const configs = [
                    { type: 'contest', data: CONTEST_DATA, track: 'carouselTrack', prev: 'prevBtn', next: 'nextBtn' },
                    { type: 'project', data: PROJECT_DATA, track: 'projectTrack', prev: 'projectPrev', next: 'projectNext' },
                    { type: 'workshop', data: WORKSHOP_DATA, track: 'workshopTrack', prev: 'workshopPrev', next: 'workshopNext' }
                ];
                configs.forEach(cfg => updateCarousel(cfg.type, cfg.data, cfg.track, cfg.prev, cfg.next));

                // 切換回來時，自動捲動回這個區塊原本的位置
                setTimeout(() => {
                    if (currentHeader) {
                        const navHeight = 95; 
                        const offset = navHeight + 35;
                        const topPos = currentHeader.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top: topPos, behavior: 'smooth' });
                    }
                }, 50);
            }
        });
    });
}

/* 彈窗 */
function openModal(id) {
    const ALL_DATA = [...CONTEST_DATA, ...PROJECT_DATA, ...WORKSHOP_DATA];
    const item = ALL_DATA.find(d => d.id === id);

    if (!item) return;

    document.getElementById('modalTitle').textContent = item.title;
    
    // ✨ 動態隱藏或顯示 Modal 內的 Award
    const modalAward = document.getElementById('modalAward');
    if (item.award) {
        modalAward.style.display = 'inline-flex';
        modalAward.querySelector('span').textContent = item.award;
    } else {
        modalAward.style.display = 'none';
    }

    // ✨ 動態隱藏或顯示 Modal 內的 Date (包含它外層的 icon)
    const modalDate = document.getElementById('modalDate');
    if (item.date) {
        modalDate.parentElement.style.display = 'flex';
        modalDate.textContent = item.date;
    } else {
        modalDate.parentElement.style.display = 'none';
    }

    document.getElementById('modalDescription').innerHTML = item.description;

    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = item.tags.map(tag =>
        `<span class="tech-tag">#${tag}</span>`
    ).join('');

    modalImages = item.images && item.images.length > 0 ? item.images : [item.image];
    modalImageIndex = 0;
    updateModalImageDisplay();

    const controls = document.getElementById('modalImgControls');
    if (modalImages.length > 1) {
        controls.classList.remove('hidden');
        renderModalDots();
    } else {
        controls.classList.add('hidden');
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

function changeModalImage(direction) {
    modalImageIndex += direction;
    if (modalImageIndex < 0) modalImageIndex = modalImages.length - 1;
    if (modalImageIndex >= modalImages.length) modalImageIndex = 0;
    updateModalImageDisplay();
    renderModalDots();
}

function setModalImage(index) {
    modalImageIndex = index;
    updateModalImageDisplay();
    renderModalDots();
}

function updateModalImageDisplay() {
    const img = document.getElementById('modalImage');
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = modalImages[modalImageIndex];
        img.style.opacity = '1';
    }, 150);
}

function renderModalDots() {
    const dotsContainer = document.getElementById('modalImgDots');
    dotsContainer.innerHTML = modalImages.map((_, index) => `
        <button onclick="event.stopPropagation(); setModalImage(${index})" 
            class="dot ${index === modalImageIndex ? 'active' : ''}">
        </button>
    `).join('');
}


const textElement = document.getElementById('typing-text');
const texts = ['Software Dev', 'AI Technology', 'Cyber Security', 'Stock Analysis'];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';
let isDeleting = false;

(function type() {
    if (!textElement) return;

    if (count === texts.length) {
        count = 0;
    }
    currentText = texts[count];

    if (isDeleting) {
        letter = currentText.slice(0, --index);
    } else {
        letter = currentText.slice(0, ++index);
    }

    textElement.textContent = letter;

    let typeSpeed = 100;
    if (isDeleting) {
        typeSpeed = 50;
    }

    if (!isDeleting && letter.length === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
        isDeleting = false;
        count++;
        typeSpeed = 500;
    }
    setTimeout(type, typeSpeed);
}());

init();