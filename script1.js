/**
 * 完整整合版 JS (適用於獨立的 experience.html)
 * 包含：比賽/專案/研習資料、多組輪播邏輯、Modal 彈窗、打字機特效
 */

// ==========================================
// 1. 資料區 (Data Definitions)
// ==========================================

const CONTEST_DATA = [
    {
        id: 1,
        title: "全國資訊專題競賽",
        award: "金牌獎",
        date: "2023-12",
        images: [
            "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&q=80&w=800",
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
        // 注意：這裡有 HTML 連結
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

// 比賽歷程專用
let contestCurrentIndex = 0;
let isGridView = false;

// 新區塊輪播索引 (專案 & 研習)
const carouselIndices = {
    project: 0,
    workshop: 0
};

// Modal 圖片瀏覽用
let modalImages = [];
let modalImageIndex = 0;

// DOM 元素取得
const carouselView = document.getElementById('carouselView');
const carouselTrack = document.getElementById('carouselTrack');
const gridView = document.getElementById('gridView');
const toggleViewBtn = document.getElementById('toggleViewBtn');
const toggleBtnText = document.getElementById('toggleBtnText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const modalOverlay = document.getElementById('modalOverlay');

// ==========================================
// 3. 初始化 (Initialization)
// ==========================================

function init() {
    // 渲染所有卡片
    renderContestCards();
    renderNewSections();

    // 啟動圖示
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 更新按鈕狀態
    updateContestButtons();
    updateNewSectionButtons('project', PROJECT_DATA);
    updateNewSectionButtons('workshop', WORKSHOP_DATA);

    // 延遲顯示以避免閃爍
    setTimeout(() => {
        if (carouselView) carouselView.style.opacity = '1';
        document.querySelectorAll('.carousel-view').forEach(el => el.style.opacity = '1');
    }, 100);
}

// ==========================================
// 4. 渲染邏輯 (Rendering)
// ==========================================

// 產生單張卡片的 HTML
function createCardHTML(item, isSlide = false) {
    const wrapperClass = isSlide ? "carousel-item" : "";
    const coverImage = item.images && item.images.length > 0 ? item.images[0] : item.image;
    // 動畫延遲
    const delay = (item.id % 5) * 0.1;
    const animationStyle = `animation-delay: ${delay}s`;

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
                <p class="card-desc">${item.description.replace(/<[^>]*>?/gm, '').substring(0, 50)}...</p>
                
                <div class="card-footer">
                    查看詳情 <i data-lucide="external-link" style="width:14px; margin-left:4px;"></i>
                </div>
            </div>
        </div>
    `;

    if (isSlide) return `<div class="${wrapperClass}">${cardContent}</div>`;
    return cardContent;
}



// 渲染比賽歷程 (包含輪播與 Grid)
function renderContestCards() {
    if (carouselTrack) carouselTrack.innerHTML = CONTEST_DATA.map(item => createCardHTML(item, true)).join('');
    if (gridView) gridView.innerHTML = CONTEST_DATA.map(item => createCardHTML(item, false)).join('');
}

// 渲染新區塊 (專案與研習)
function renderNewSections() {
    const pTrack = document.getElementById('projectTrack');
    const wTrack = document.getElementById('workshopTrack');
    if (pTrack) pTrack.innerHTML = PROJECT_DATA.map(item => createCardHTML(item, true)).join('');
    if (wTrack) wTrack.innerHTML = WORKSHOP_DATA.map(item => createCardHTML(item, true)).join('');
}

// ==========================================
// 5. 輪播控制邏輯 (Carousel Logic)
// ==========================================

// --- 比賽歷程輪播 (包含切換 Grid 功能) ---
function updateContestCarousel() {
    let itemsPerScreen = window.innerWidth < 640 ? 2 : 4;
    const movePercentage = contestCurrentIndex * (100 / itemsPerScreen);
    if (carouselTrack) carouselTrack.style.transform = `translateX(-${movePercentage}%)`;
    updateContestButtons(itemsPerScreen);
}

function updateContestButtons(itemsPerScreen = 4) {
    if (window.innerWidth < 640) itemsPerScreen = 2;
    else itemsPerScreen = 4;
    if (prevBtn) prevBtn.disabled = contestCurrentIndex === 0;
    if (nextBtn) nextBtn.disabled = contestCurrentIndex >= CONTEST_DATA.length - itemsPerScreen;
}

if (prevBtn) prevBtn.addEventListener('click', () => {
    if (contestCurrentIndex > 0) {
        contestCurrentIndex--;
        updateContestCarousel();
    }
});

if (nextBtn) nextBtn.addEventListener('click', () => {
    let itemsPerScreen = window.innerWidth < 640 ? 2 : 4;
    if (contestCurrentIndex < CONTEST_DATA.length - itemsPerScreen) {
        contestCurrentIndex++;
        updateContestCarousel();
    }
});

// --- 通用新區塊輪播工廠函式 (Factory Function) ---
function setupNewCarousel(type, data) {
    const track = document.getElementById(`${type}Track`);
    const prev = document.getElementById(`${type}Prev`);
    const next = document.getElementById(`${type}Next`);

    if (!track || !prev || !next) return () => {};

    function update() {
        let itemsPerScreen = window.innerWidth < 640 ? 2 : 4;
        const idx = carouselIndices[type];
        const movePercentage = idx * (100 / itemsPerScreen);
        track.style.transform = `translateX(-${movePercentage}%)`;

        prev.disabled = idx === 0;
        next.disabled = idx >= data.length - itemsPerScreen;
    }

    prev.addEventListener('click', () => {
        if (carouselIndices[type] > 0) {
            carouselIndices[type]--;
            update();
        }
    });

    next.addEventListener('click', () => {
        let itemsPerScreen = window.innerWidth < 640 ? 2 : 4;
        if (carouselIndices[type] < data.length - itemsPerScreen) {
            carouselIndices[type]++;
            update();
        }
    });

    return update;
}

function updateNewSectionButtons(type, data) {
    let itemsPerScreen = window.innerWidth < 640 ? 2 : 4;
    const prev = document.getElementById(`${type}Prev`);
    const next = document.getElementById(`${type}Next`);
    if (prev) prev.disabled = true;
    if (next) next.disabled = data.length <= itemsPerScreen;
}

// 建立實例
const updateProject = setupNewCarousel('project', PROJECT_DATA);
const updateWorkshop = setupNewCarousel('workshop', WORKSHOP_DATA);

// 視窗縮放監聽
window.addEventListener('resize', () => {
    contestCurrentIndex = 0;
    updateContestCarousel();
    
    carouselIndices.project = 0;
    updateProject();
    
    carouselIndices.workshop = 0;
    updateWorkshop();
});

// 比賽歷程：切換檢視 (Grid/Slide)
if (toggleViewBtn) {
    toggleViewBtn.addEventListener('click', () => {
        isGridView = !isGridView;
        const iconGrid = document.querySelector('.icon-grid');
        const iconLayout = document.querySelector('.icon-layout');

        if (isGridView) {
            carouselView.classList.add('hidden');
            gridView.style.display = 'grid';
            toggleBtnText.textContent = '切換回輪播';
            if (iconGrid) iconGrid.classList.add('hidden');
            if (iconLayout) iconLayout.classList.remove('hidden');
        } else {
            gridView.style.display = 'none';
            carouselView.classList.remove('hidden');
            toggleBtnText.textContent = `顯示全部 (${CONTEST_DATA.length})`;
            if (iconLayout) iconLayout.classList.add('hidden');
            if (iconGrid) iconGrid.classList.remove('hidden');
            contestCurrentIndex = 0;
            updateContestCarousel();
        }
    });
}

// ==========================================
// 6. Modal 彈窗邏輯 (Modal Logic)
// ==========================================

function openModal(id) {
    // 搜尋所有資料
    const ALL_DATA = [...CONTEST_DATA, ...PROJECT_DATA, ...WORKSHOP_DATA];
    const item = ALL_DATA.find(d => d.id === id);

    if (!item) return;

    // 填入資料
    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalAward').querySelector('span').textContent = item.award;
    document.getElementById('modalDate').textContent = item.date;
    
    // ★★★ 關鍵：使用 innerHTML 才能顯示連結 ★★★
    document.getElementById('modalDescription').innerHTML = item.description;

    // 產生 Tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = item.tags.map(tag =>
        `<span class="tech-tag">#${tag}</span>`
    ).join('');

    // 處理圖片
    modalImages = item.images && item.images.length > 0 ? item.images : [item.image];
    modalImageIndex = 0;
    updateModalImageDisplay();

    // 圖片切換按鈕顯示與否
    const controls = document.getElementById('modalImgControls');
    if (modalImages.length > 1) {
        controls.classList.remove('hidden');
        renderModalDots();
    } else {
        controls.classList.add('hidden');
    }

    // 顯示 Modal
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
    // 檢查元素是否存在，避免在不顯示打字機的頁面報錯
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

// ==========================================
// 8. 啟動程式 (Start)
// ==========================================
init();