
// ==========================================
// 1. 資料區 (Data Definitions)
// ==========================================

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
        title: "校園黑客松 Hackathon",
        award: "最佳創意獎",
        date: "2023-10",
        image: "https://images.unsplash.com/photo-1504384308090-c54be3852f9d?auto=format&fit=crop&q=80&w=800",
        description: "要在 24 小時內做出一個完整的 App 原型真的很有挑戰性！我們做了一個解決校園剩食問題的 App。",
        tags: ["App開發", "React Native", "急中生智"]
    },
    {
        id: 3,
        title: "國際網頁設計大賽",
        award: "優勝",
        date: "2023-08",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800",
        description: "運用了最新的 CSS Grid 與視差滾動效果。第一次嘗試將 3D 模型嵌入網頁中，雖然效能調校花了很多時間，但最終效果非常驚艷。",
        tags: ["Web Design", "Three.js", "UI/UX"]
    },
    {
        id: 4,
        title: "大專盃程式設計",
        award: "銀牌",
        date: "2023-05",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
        description: "這是一場純演算法的競賽。在動態規劃（DP）的題目上卡關了很久，但也因此發現自己對圖論演算法比較熟悉。",
        tags: ["C++", "Algorithm", "邏輯思考"]
    },
    {
        id: 5,
        title: "AI 生成藝術展",
        award: "入圍",
        date: "2023-03",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
        description: "嘗試使用 Stable Diffusion 訓練自己的 LoRA 模型，生成具有台灣傳統風格的賽博龐克圖像。",
        tags: ["AI Art", "Stable Diffusion", "設計"]
    },
    {
        id: 6,
        title: "開源軟體貢獻獎",
        award: "年度貢獻者",
        date: "2022-12",
        image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=800",
        description: "持續為知名開源專案修復 Bug 並撰寫文件。雖然不是傳統的比賽，但獲得社群認可是最大的獎勵。",
        tags: ["Open Source", "GitHub", "社群"]
    }
];

const PROJECT_DATA = [
    {
        id: 101,
        title: "股票網站網站",
        award: "Side Project",
        date: "2024-01",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        description: "能用你就偷笑吧，<a href='invest_calendar.html' target='_blank' style='color: #60a5fa; text-decoration: underline;'>點此瀏覽</a>",
        tags: ["HTML", "CSS", "RWD"]
    },
    {
        id: 102,
        title: "Discord 音樂機器人",
        award: "開源專案",
        date: "2023-11",
        image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=800",
        description: "使用 Discord.js 開發的音樂機器人，支援 YouTube 和 Spotify 連結播放。目前已在超過 50 個伺服器中使用。",
        tags: ["Node.js", "Discord API", "Backend"]
    },
    {
        id: 103,
        title: "記帳小幫手 App",
        award: "實用工具",
        date: "2023-09",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
        description: "一個簡單直覺的記帳軟體，結合了圖表分析功能，讓使用者能一目了然每月的消費狀況。",
        tags: ["Flutter", "Dart", "Firebase"]
    },
    {
        id: 104,
        title: "校園二手書平台",
        award: "期末專題",
        date: "2023-06",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
        description: "為了解決學長姐教科書浪費的問題，搭建了一個校內專用的二手書媒合平台。",
        tags: ["Vue.js", "MySQL", "PHP"]
    },
    {
        id: 105,
        title: "不知道",
        award: "佈佈佈",
        date: "2023-04",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
        description: "為了解決你。",
        tags: ["Vue.js", "MySQL", "PHP"]
    }
];

const WORKSHOP_DATA = [
    {
        id: 201,
        title: "AWS 雲端從業人員培訓",
        award: "研習證書",
        date: "2023-08",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        description: "參加為期三天的 AWS 雲端服務密集培訓，學習了 EC2、S3、Lambda 等核心服務的基礎應用。",
        tags: ["AWS", "Cloud", "DevOps"]
    },
    {
        id: 202,
        title: "資訊安全攻防營",
        award: "結業",
        date: "2023-07",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
        description: "學習基礎的滲透測試與漏洞防護，了解常見的 SQL Injection 與 XSS 攻擊原理及防禦方式。",
        tags: ["Security", "CTF", "Ethical Hacking"]
    },
    {
        id: 203,
        title: "Google 開發者大會",
        award: "參訪",
        date: "2023-06",
        image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=800",
        description: "參與 Google I/O Extended 台北場，聆聽最新的 Web 技術趨勢與 Android 開發新功能。",
        tags: ["Conference", "Tech", "Community"]
    },
    {
        id: 204,
        title: "APCS 檢定衝刺班",
        award: "助教",
        date: "2023-02",
        image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
        description: "擔任高中生 APCS 程式設計檢定的解題助教，協助學員理解 C++ 語法與基礎演算法。",
        tags: ["Teaching", "C++", "APCS"]
    }
];

// ==========================================
// 2. 狀態與變數 (State & Variables)
// ==========================================

const carouselState = {
    contest: 0,
    project: 0,
    workshop: 0
};

let activeGridSection = null;

let modalImages = [];
let modalImageIndex = 0;

const modalOverlay = document.getElementById('modalOverlay');

// ==========================================
// 3. 初始化 (Initialization)
// ==========================================

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

// ==========================================
// 4. 渲染邏輯 (Rendering)
// ==========================================

function createCardHTML(item, isSlide = false) {
    const wrapperClass = isSlide ? "carousel-item" : "";
    const coverImage = item.images && item.images.length > 0 ? item.images[0] : item.image;
    const delay = (item.id % 5) * 0.1;
    const animationStyle = `animation-delay: ${delay}s`;

    let cleanDesc = item.description.replace(/<[^>]*>?/gm, '');
    let displayDesc = cleanDesc.length > 100 ? cleanDesc.substring(0, 100) + '...' : cleanDesc;

    const cardContent = `
        <div class="card slide-up" style="${animationStyle}" onclick="openModal(${item.id})">
            <div class="card-img-wrapper">
                <img src="${coverImage}" alt="${item.title}" class="card-img">
                
                <div class="card-badge">
                    <i data-lucide="award"></i>
                    ${item.award}
                </div>
                
                ${item.images && item.images.length > 1 ? `
                <div style="position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.6); padding:2px 6px; border-radius:4px; font-size:10px; color:#ccc; display:flex; align-items:center; gap:4px; border:1px solid rgba(255,255,255,0.1);">
                    <i data-lucide="images" style="width:12px; height:12px;"></i>
                    ${item.images.length}
                </div>
                ` : ''}
            </div>

            <div class="card-content">
                <div class="card-meta">${item.date}</div>
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

// ==========================================
// 5. 輪播控制邏輯 (Carousel Logic)
// ==========================================

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

// ==========================================
// ✨ 顯示全部 / 切換回輪播 的邏輯 (包含自動平滑捲動與移除空白)
// ==========================================
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

// ==========================================
// 6. Modal 彈窗邏輯 (Modal Logic)
// ==========================================

function openModal(id) {
    const ALL_DATA = [...CONTEST_DATA, ...PROJECT_DATA, ...WORKSHOP_DATA];
    const item = ALL_DATA.find(d => d.id === id);

    if (!item) return;

    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalAward').querySelector('span').textContent = item.award;
    document.getElementById('modalDate').textContent = item.date;
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

// ==========================================
// 7. 打字機特效 (Typewriter)
// ==========================================

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