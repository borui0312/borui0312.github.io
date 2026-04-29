        let standaloneStockData = JSON.parse(localStorage.getItem("standaloneStockData")) || []; 
        let dividendData = JSON.parse(localStorage.getItem("dividendData")) || []; 
        let manualPrices = JSON.parse(localStorage.getItem("manualPrices")) || {};
        
        // 🔥 新增：用來記錄使用者自訂的排序清單
        let customSortOrder = JSON.parse(localStorage.getItem("customSortOrder")) || []; 

        init();

        function init() {
            initTheme(); // 👈 新增這行：網頁載入時初始化主題
            
            document.getElementById('inp_date').valueAsDate = new Date();
            document.getElementById('div_date').valueAsDate = new Date();
            
            autoFixOldData(); 
            updateInventoryPage(); 
        }

        // ==========================================
        // 自動修復引擎
        // ==========================================
        function autoFixOldData() {
            let modified = false;
            standaloneStockData.forEach(item => {
                let { principal, brokerFee } = calculateFees(item.code, item.buyPrice, item.amount, false);
                let correctTotalCost = principal + brokerFee;
                
                if (item.totalCost !== correctTotalCost || item.totalCost % 1 !== 0) {
                    item.totalCost = correctTotalCost;
                    item.buyFee = brokerFee;
                    modified = true;
                }
                
                if (item.status === 'sold' && !item.isManualProfit) {
                    let sellFees = calculateFees(item.code, item.sellPrice, item.amount, true);
                    let revenue = sellFees.principal - sellFees.brokerFee - sellFees.tax;
                    let correctNetProfit = revenue - item.totalCost;
                    
                    if (item.netProfit !== correctNetProfit || item.netProfit % 1 !== 0) {
                        item.netProfit = correctNetProfit;
                        item.sellFee = sellFees.brokerFee;
                        item.sellTax = sellFees.tax;
                        modified = true;
                    }
                }
            });
            if (modified) saveData(); 
        }

        // ==========================================
        // 核心：國泰兩段式混合捨入計算模組
        // ==========================================
        function calculateFees(code, price, amount, isSell) {
            let principal = Math.floor(price * amount);
            let brokerFee = Math.max(1, Math.floor(principal * 0.001425 * 0.28)); 
            
            let tax = 0;
            if (isSell) {
                let taxRate = code.startsWith("00") ? 0.001 : 0.003;
                tax = Math.floor(principal * taxRate);
            }
            return { principal, brokerFee, tax };
        }

        // ==========================================
        // CRUD 邏輯
        // ==========================================
        function addStock() {
            let code = document.getElementById("inp_code").value.trim();
            let date = document.getElementById("inp_date").value;
            let priceStr = document.getElementById("inp_price").value;
            let amountStr = document.getElementById("inp_amount").value;
            
            if (!code || !priceStr || !amountStr || !date) { alert("請填寫完整買進資料！"); return; }
            
            let price = parseFloat(priceStr);
            let amount = parseInt(amountStr);
            
            let { principal, brokerFee } = calculateFees(code, price, amount, false);
            let totalCost = principal + brokerFee; 
            
            let newRecord = { 
                id: Date.now(), code: code, buyDate: date, buyPrice: price, 
                amount: amount, buyFee: brokerFee, totalCost: totalCost, status: 'held', 
                sellDate: null, sellPrice: null, sellFee: 0, sellTax: 0, netProfit: 0
            };
            
            standaloneStockData.push(newRecord);
            saveData();
            updateInventoryPage();
            
            document.getElementById("inp_code").value = "";
            document.getElementById("inp_price").value = "";
            document.getElementById("inp_amount").value = "";
            document.getElementById("inp_date").valueAsDate = new Date();
        }

        function openSellModal(id) {
            let stock = standaloneStockData.find(s => s.id === id);
            if(!stock) return;

            document.getElementById("sell_target_id").value = id;
            document.getElementById("sell_date").valueAsDate = new Date();
            document.getElementById("sell_price").value = "";
            
            // 預設帶入全部持股，方便一次全賣
            let amountInput = document.getElementById("sell_amount");
            if(amountInput) amountInput.value = stock.amount; 
            
            document.getElementById("sell-modal-info").innerHTML = 
                `準備賣出: <b>${stock.code}</b> <br>
                 買入成本: $${stock.totalCost.toLocaleString()} <br>
                 可賣股數: ${stock.amount} 股`;
            
            document.getElementById("sellModal").style.display = "flex";
        }

        function confirmSell() {
            let id = parseInt(document.getElementById("sell_target_id").value);
            let sellDate = document.getElementById("sell_date").value;
            let sellPrice = parseFloat(document.getElementById("sell_price").value);
            let sellAmount = parseInt(document.getElementById("sell_amount").value);

            if(!sellDate || !sellPrice || !sellAmount) { alert("請輸入完整賣出資料"); return; }

            let stockIndex = standaloneStockData.findIndex(s => s.id === id);
            if(stockIndex === -1) return;
            let stock = standaloneStockData[stockIndex];

            if(sellAmount <= 0 || sellAmount > stock.amount) { alert("賣出股數不正確 (不可大於現有持股)"); return; }

            let { principal, brokerFee, tax } = calculateFees(stock.code, sellPrice, sellAmount, true);
            let revenue = principal - brokerFee - tax;

            if (sellAmount < stock.amount) {
                // 🔄 分批賣出邏輯：拆成兩筆
                let partialBuyFees = calculateFees(stock.code, stock.buyPrice, sellAmount, false);
                let partialTotalCost = partialBuyFees.principal + partialBuyFees.brokerFee;
                let netProfit = revenue - partialTotalCost;

                stock.amount -= sellAmount;
                let remainBuyFees = calculateFees(stock.code, stock.buyPrice, stock.amount, false);
                stock.totalCost = remainBuyFees.principal + remainBuyFees.brokerFee;
                stock.buyFee = remainBuyFees.brokerFee;

                let soldRecord = {
                    ...stock,
                    id: Date.now(), 
                    amount: sellAmount,
                    totalCost: partialTotalCost,
                    buyFee: partialBuyFees.brokerFee,
                    status: 'sold', sellDate: sellDate, sellPrice: sellPrice,
                    sellFee: brokerFee, sellTax: tax, netProfit: netProfit, isManualProfit: false
                };
                standaloneStockData.push(soldRecord);
            } else {
                // 🛑 全部賣出邏輯
                let netProfit = revenue - stock.totalCost;
                stock.status = 'sold';
                stock.sellDate = sellDate; stock.sellPrice = sellPrice;
                stock.sellFee = brokerFee; stock.sellTax = tax; stock.netProfit = netProfit;
            }

            saveData();
            closeSellModal();
            updateInventoryPage(stock.code); 
        }

        function closeSellModal() { document.getElementById("sellModal").style.display = "none"; }
        
        function deleteStock(id) {
            if(!confirm("確定要刪除這筆紀錄？（此動作不可恢復）")) return;
            standaloneStockData = standaloneStockData.filter(item => item.id !== id);
            saveData();
            updateInventoryPage();
        }

        function openDivModal() {
            document.getElementById("div_date").valueAsDate = new Date();
            document.getElementById("div_code").value = document.getElementById("inp_code").value; 
            document.getElementById("div_amount").value = "";
            document.getElementById("divModal").style.display = "flex";
        }

        function closeDivModal() { document.getElementById("divModal").style.display = "none"; }

        function confirmDiv() {
            let code = document.getElementById("div_code").value.trim();
            let date = document.getElementById("div_date").value;
            let amountStr = document.getElementById("div_amount").value;
            
            if (!code || !amountStr || !date) { alert("請填寫完整股息資料！"); return; }
            let amount = parseFloat(amountStr);
            let newDiv = { id: Date.now(), code: code, date: date, amount: amount };
            dividendData.push(newDiv);
            saveData();
            closeDivModal();
            updateInventoryPage();
        }

        function deleteDividend(id) {
            if(!confirm("確定要刪除這筆股息紀錄？")) return;
            dividendData = dividendData.filter(item => item.id !== id);
            saveData();
            updateInventoryPage();
        }

        function openEditModal(id, type, code) {
            document.getElementById("edit_id").value = id;
            document.getElementById("edit_type").value = type;
            document.getElementById("edit_code").value = code;
            
            let fieldsDiv = document.getElementById("edit_fields");
            let title = document.getElementById("edit-modal-title");

                if (type === 'held' || type === 'sold') {
                let stock = standaloneStockData.find(s => s.id === id);
                let isHeld = type === 'held';
                title.innerText = isHeld ? "編輯持有中明細" : "編輯已賣出明細";
                
                // 👇 這裡新增一個判斷：如果是已賣出，股數框框就直接反灰鎖死 (disabled)
                let amountHtml = isHeld
                    ? `<div class="form-group" style="margin-top: 15px;">
                           <label>股數</label>
                           <input type="number" id="edit_amount" value="${stock.amount}">
                       </div>`
                    : `<div class="form-group" style="margin-top: 15px;">
                           <label>賣出股數</label>
                           <input type="number" id="edit_amount" value="${stock.amount}" disabled>
                       </div>`;

                fieldsDiv.innerHTML = `
                    <div class="form-group">
                        <label>${isHeld ? '買入日期' : '賣出日期'}</label>
                        <input type="date" id="edit_date" value="${isHeld ? stock.buyDate : stock.sellDate}">
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <label>${isHeld ? '買進價格' : '賣出價格'}</label>
                        <input type="number" step="0.01" id="edit_price" value="${isHeld ? stock.buyPrice : stock.sellPrice}">
                    </div>
                    ${amountHtml} `;
            } else if (type === 'dividend') {
                let div = dividendData.find(d => d.id === id);
                title.innerText = "編輯領息明細";
                fieldsDiv.innerHTML = `
                    <div class="form-group">
                        <label>入帳日期</label>
                        <input type="date" id="edit_date" value="${div.date}">
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <label>領取金額</label>
                        <input type="number" id="edit_price" value="${div.amount}">
                    </div>
                `;
            }
            document.getElementById("editModal").style.display = "flex";
        }

        function closeEditModal() { document.getElementById("editModal").style.display = "none"; }

        function confirmEdit() {
            let id = parseInt(document.getElementById("edit_id").value);
            let type = document.getElementById("edit_type").value;
            let code = document.getElementById("edit_code").value;
            let editDate = document.getElementById("edit_date").value;
            let editPrice = parseFloat(document.getElementById("edit_price").value);
            
            if (!editDate || isNaN(editPrice)) { alert("資料不完整！"); return; }

            if (type === 'dividend') {
                let div = dividendData.find(d => d.id === id);
                if (div) { div.date = editDate; div.amount = editPrice; }
            } else {
                let stock = standaloneStockData.find(s => s.id === id);
                let editAmount = parseInt(document.getElementById("edit_amount").value);
                if (isNaN(editAmount) || editAmount <= 0) { alert("股數不正確！"); return; }

                if (type === 'held') {
                    stock.buyDate = editDate; stock.buyPrice = editPrice; stock.amount = editAmount;
                    let buyFees = calculateFees(stock.code, stock.buyPrice, stock.amount, false);
                    stock.totalCost = buyFees.principal + buyFees.brokerFee; stock.buyFee = buyFees.brokerFee;
                } else if (type === 'sold') {
                    stock.sellDate = editDate; stock.sellPrice = editPrice; stock.amount = editAmount;
                    let buyFees = calculateFees(stock.code, stock.buyPrice, stock.amount, false);
                    stock.totalCost = buyFees.principal + buyFees.brokerFee; stock.buyFee = buyFees.brokerFee;
                    let sellFees = calculateFees(stock.code, stock.sellPrice, stock.amount, true);
                    stock.sellFee = sellFees.brokerFee; stock.sellTax = sellFees.tax;
                    if (!stock.isManualProfit) {
                        stock.netProfit = (sellFees.principal - sellFees.brokerFee - sellFees.tax) - stock.totalCost;
                    }
                }
            }
            saveData();
            closeEditModal();
            updateInventoryPage(code); 
        }

        function saveData() {
            localStorage.setItem("standaloneStockData", JSON.stringify(standaloneStockData));
            localStorage.setItem("dividendData", JSON.stringify(dividendData));
        }

        function toggleGroup(code) {
            let sumRow = document.getElementById(`sum-${code}`);
            let detailRows = document.querySelectorAll(`.detail-${code}`);
            let isExpanded = sumRow.classList.contains('expanded');
            if (isExpanded) {
                sumRow.classList.remove('expanded');
                detailRows.forEach(row => row.classList.add('hidden'));
            } else {
                sumRow.classList.add('expanded');
                detailRows.forEach(row => row.classList.remove('hidden'));
            }
        }

        function editProfit(id) {
            let stock = standaloneStockData.find(s => s.id === id);
            if(!stock) return;

            let currentP = stock.isManualProfit ? stock.netProfit : "";
            let input = prompt(`請輸入此筆賣出紀錄的手動已實現損益\n(若要恢復系統自動計算，請直接清空並按確認)：`, "");

            if (input === null) return; 

            if (input.trim() === "") {
                stock.isManualProfit = false;
                // 恢復自動計算
                let sellFees = calculateFees(stock.code, stock.sellPrice, stock.amount, true);
                let revenue = sellFees.principal - sellFees.brokerFee - sellFees.tax;
                stock.netProfit = revenue - stock.totalCost;
            } else {
                let p = parseFloat(input);
                if (!isNaN(p)) {
                    stock.netProfit = p;
                    stock.isManualProfit = true;
                } else {
                    alert("請輸入有效的數字！");
                    return;
                }
            }
            
            saveData();
            updateInventoryPage(stock.code); // 👈 加上 stock.code，告訴系統改完這檔要保持展開
        }

        // ==========================================
        // 重新渲染與排版 (支援拖拉排序機制)
        // ==========================================
        async function updateInventoryPage(autoExpandCode = null) {
            let table = document.getElementById("inventory-list");
            
            // 清理舊的 tbody 結構
            table.querySelectorAll("tbody").forEach(tb => tb.remove());

            if (standaloneStockData.length === 0 && dividendData.length === 0) {
                let emptyTbody = document.createElement("tbody");
                emptyTbody.innerHTML = "<tr><td colspan='10'>目前無交易或股息紀錄</td></tr>";
                table.appendChild(emptyTbody);
                
                document.getElementById("dash-cost").innerText = "$0";
                document.getElementById("dash-realized").innerText = "$0";
                document.getElementById("dash-realized").className = "val neutral";
                document.getElementById("dash-unrealized").innerText = "$0";
                document.getElementById("dash-unrealized").className = "val neutral";
                document.getElementById("dash-dividend").innerText = "$0";
                return;
            }

            // 臨時顯示讀取中
            let loadingTbody = document.createElement("tbody");
            loadingTbody.innerHTML = "<tr><td colspan='10'>連線抓取最新股價中...</td></tr>";
            table.appendChild(loadingTbody);

            let groupedData = {};
            let heldCodes = new Set();
            let dashboardCost = 0;
            let dashboardRealized = 0;
            let dashboardDividend = 0;

            standaloneStockData.forEach(item => {
                if (!groupedData[item.code]) {
                    groupedData[item.code] = { code: item.code, records: [], dividends: [], heldShares: 0, heldCost: 0, realizedProfit: 0, totalDivs: 0 };
                }
                groupedData[item.code].records.push(item);
                
                if (item.status === 'held') {
                    groupedData[item.code].heldShares += item.amount;
                    groupedData[item.code].heldCost += item.totalCost;
                    dashboardCost += item.totalCost;
                    heldCodes.add(item.code);
                } else {
                    groupedData[item.code].realizedProfit += item.netProfit;
                    dashboardRealized += item.netProfit;
                }
            });

            dividendData.forEach(div => {
                if (!groupedData[div.code]) {
                    groupedData[div.code] = { code: div.code, records: [], dividends: [], heldShares: 0, heldCost: 0, realizedProfit: 0, totalDivs: 0 };
                }
                groupedData[div.code].dividends.push(div);
                groupedData[div.code].totalDivs += div.amount;
                dashboardDividend += div.amount;
            });

            let currentPrices = {};
            if (heldCodes.size > 0) {
                let today = new Date();
                let fiveDaysAgo = new Date(today);
                fiveDaysAgo.setDate(today.getDate() - 5);
                
                let y1 = fiveDaysAgo.getFullYear(), m1 = String(fiveDaysAgo.getMonth()+1).padStart(2,'0'), d1 = String(fiveDaysAgo.getDate()).padStart(2,'0');
                let y2 = today.getFullYear(), m2 = String(today.getMonth()+1).padStart(2,'0'), d2 = String(today.getDate()).padStart(2,'0');
                
                let promises = Array.from(heldCodes).map(async (code) => {
                    let url = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPrice&data_id=${code}&start_date=${y1}-${m1}-${d1}&end_date=${y2}-${m2}-${d2}`;
                    try {
                        let res = await fetch(url);
                        let result = await res.json();
                        if(result.data && result.data.length > 0) {
                            currentPrices[code] = result.data[result.data.length - 1].close;
                        }
                    } catch(e){}
                });
                await Promise.all(promises);
            }

            loadingTbody.remove(); // 移除讀取中

            let dashboardUnrealized = 0;
            
            // 🔥 核心排序邏輯：優先套用使用者自訂的順序，沒有的排後面
            let groupedDataArray = Object.values(groupedData);
            groupedDataArray.sort((a, b) => {
                let idxA = customSortOrder.indexOf(a.code);
                let idxB = customSortOrder.indexOf(b.code);
                
                // 如果兩者都在自訂排序清單中，依照清單排序
                if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                
                // 只有其中一個在清單中，在清單中的優先
                if (idxA !== -1) return -1;
                if (idxB !== -1) return 1;
                
                // 都沒有在清單中，依照持股總數排序
                return b.heldShares - a.heldShares;
            });

            // 🔥 獨立生成每一個 Tbody
            groupedDataArray.forEach(group => {
                
                let tbody = document.createElement("tbody");
                tbody.className = "stock-group-tbody";
                tbody.dataset.code = group.code; // 給 Sortable 識別用
                
                let currentPrice = manualPrices[group.code] || currentPrices[group.code] || 0;
                let groupUnrealized = 0;

                if (group.heldShares > 0 && currentPrice > 0) {
                    group.records.filter(r => r.status === 'held').forEach(item => {
                        let { principal, brokerFee, tax } = calculateFees(item.code, currentPrice, item.amount, true);
                        let estimatedRevenue = principal - brokerFee - tax;
                        groupUnrealized += (estimatedRevenue - item.totalCost);
                    });
                    dashboardUnrealized += groupUnrealized;
                }

                
                let avgCost = group.heldShares > 0 ? (group.heldCost / group.heldShares).toFixed(2) : "-";
                let totalCostStr = group.heldShares > 0 ? `$${group.heldCost.toLocaleString()}` : "-";
                let isManual = manualPrices[group.code] !== undefined;
                
                // 👇 這裡非常乾淨，就是純數字
                let cpStr = currentPrice > 0 ? `$${currentPrice}` : "-";
                
                // 👇 動態判斷圖示！
                let priceIcon = isManual ? "📌" : "✏️";
                let iconTitle = isManual ? "已手動釘選現價 (點擊修改)" : "手動設定現價";
                
                let editIconHtml = group.heldShares > 0 
                    ? `<span class="price-edit-icon" onclick="editPrice('${group.code}'); event.stopPropagation();" title="${iconTitle}">${priceIcon}</span>` 
                    : `<span class="empty-icon-space"></span>`;

                // 👈 那行紅色的 (手動) 已經被徹底刪除了！

                let divStr = group.totalDivs > 0 ? `<span class="text-dividend">+$${group.totalDivs.toLocaleString()}</span>` : "-";
                
                let unRealHtml = "-";
                if (group.heldShares > 0 && currentPrice > 0) {
                    unRealHtml = `<span class="${groupUnrealized > 0 ? 'profit' : 'loss'}"><b>${groupUnrealized > 0 ? '+' : ''}${groupUnrealized.toLocaleString()}</b></span>`;
                }

                let realHtml = "-";
                if (group.realizedProfit !== 0) {
                    realHtml = `<span class="${group.realizedProfit > 0 ? 'profit' : 'loss'}"><b>${group.realizedProfit > 0 ? '+' : ''}${group.realizedProfit.toLocaleString()}</b></span>`;
                }

                // 🔥 在總覽列最前面加入「拖拉按鈕」
                let summaryHtml = `
                    <tr class="summary-row" id="sum-${group.code}" onclick="toggleGroup('${group.code}')">
                        <td class="drag-handle" onclick="event.stopPropagation();" title="按住拖動">≡</td>
                        <td><span class="expand-icon">▶</span></td>
                        <td class="sum-code">${group.code}</td>
                        <td class="sum-shares">${group.heldShares.toLocaleString()}</td>
                        <td>${avgCost !== "-" ? '$'+avgCost : '-'}</td>
                        <td class="sum-total-cost">${totalCostStr}</td>
                        <td>
                            <div class="price-wrapper">
                                <span>${cpStr}</span>
                                ${editIconHtml}
                            </div>
                        </td>
                        <td>${divStr}</td>
                        <td>${unRealHtml}</td>
                        <td>${realHtml}</td>
                    </tr>
                `;

                tbody.innerHTML += summaryHtml;

                if (group.heldShares === 0) {
                    let summaryRow = tbody.querySelector(`#sum-${group.code}`);
                    let pencilBtn = summaryRow.querySelector('span[title="手動設定現價"]');
                    if (pencilBtn) pencilBtn.remove();
                }

                let allDetails = [
                    ...group.records.map(r => ({ ...r, type: 'buy_sell' })),
                    ...group.dividends.map(d => ({ ...d, type: 'dividend' }))
                ];
                
                allDetails.sort((a,b) => {
                    let dateA = a.type === 'buy_sell' ? a.buyDate : a.date;
                    let dateB = b.type === 'buy_sell' ? b.buyDate : b.date;
                    return new Date(dateB) - new Date(dateA);
                });

                allDetails.forEach(item => {
                    if (item.type === 'buy_sell') {
                        let isHeld = item.status === 'held';
                        let statusHtml = isHeld ? `<span class="status-badge badge-held">持有中</span>` : `<span class="status-badge badge-sold">已賣出</span>`;
                        
                        let sellDetailHtml = `<span class="detail-val" style="color:#aaa;">-</span>`;
                        if(!isHeld) {
                            let netProfitSign = item.netProfit > 0 ? '+' : '';
                            let netProfitClass = item.netProfit > 0 ? 'profit' : (item.netProfit < 0 ? 'loss' : 'neutral');
                            
                            // 👇 改動 3：拿掉 manualTag 字樣，改用動態圖示
                            let profitIcon = item.isManualProfit ? "📌" : "✏️";
                            
                                sellDetailHtml = `
                                    <span class="detail-lbl">賣出日: ${item.sellDate}</span>
                                    <span class="detail-lbl">賣出價: $${item.sellPrice}</span>
                                    <div class="profit-wrapper">
                                        <span class="detail-val ${netProfitClass}">${netProfitSign}${item.netProfit.toLocaleString()}</span>
                                        <span class="price-edit-icon" onclick="editProfit(${item.id}); event.stopPropagation();" title="${iconTitle}">${profitIcon}</span>
                                    </div>
                                `;
                        }

                        let actionHtml = isHeld
                                ? `<button class="action-btn edit-btn" onclick="openEditModal(${item.id}, 'held', '${group.code}'); event.stopPropagation();">編輯</button>
                                   <button class="action-btn sell-btn" onclick="openSellModal(${item.id}); event.stopPropagation();">賣出</button>
                                   <button class="action-btn del-btn" onclick="deleteStock(${item.id}); event.stopPropagation();">刪除</button>`
                                : `<button class="action-btn edit-btn" onclick="openEditModal(${item.id}, 'sold', '${group.code}'); event.stopPropagation();">編輯</button>
                                   <button class="action-btn del-btn" onclick="deleteStock(${item.id}); event.stopPropagation();">刪除</button>`;

                        let detailHtml = `
                            <tr class="detail-row detail-${group.code} hidden">
                                <td colspan="10"> 
                                    <div class="detail-card">
                                        <div class="detail-col status-col">
                                            <span class="tree-line">└─</span>
                                            ${statusHtml}
                                        </div>
                                        <div class="detail-col date-col">
                                            <span class="detail-lbl">買入日期</span>
                                            <span class="detail-val">${item.buyDate}</span>
                                        </div>
                                        <div class="detail-col info-col">
                                            <span class="detail-lbl">買價</span>
                                            <span class="detail-val">$${item.buyPrice}</span>
                                        </div>
                                        <div class="detail-col shares-col">
                                            <span class="detail-lbl">股數</span>
                                            <span class="detail-val">${item.amount.toLocaleString()}</span>
                                        </div>
                                        <div class="detail-col cost-col">
                                            <span class="detail-lbl">總成本</span>
                                            <span class="detail-val">$${item.totalCost.toLocaleString()}</span>
                                        </div>
                                        <div class="detail-col result-col">
                                            ${sellDetailHtml}
                                        </div>
                                        <div class="detail-col action-col">
                                            ${actionHtml}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        `;
                        tbody.innerHTML += detailHtml;

                    } else if (item.type === 'dividend') {
                        let detailHtml = `
                            <tr class="detail-row detail-${group.code} hidden">
                                <td colspan="10">
                                    <div class="detail-card div-card">
                                        <div class="detail-col status-col">
                                            <span class="tree-line">└─</span>
                                            <span class="status-badge badge-div">領股息</span>
                                        </div>
                                        <div class="detail-col date-col">
                                            <span class="detail-lbl">入帳日期</span>
                                            <span class="detail-val">${item.date}</span>
                                        </div>
                                        <div class="detail-col info-col">
                                            <span class="detail-lbl" style="visibility:hidden;">佔位</span>
                                            <span class="detail-val"></span>
                                        </div>
                                        <div class="detail-col shares-col">
                                            <span class="detail-lbl" style="visibility:hidden;">佔位</span>
                                            <span class="detail-val"></span>
                                        </div>
                                        <div class="detail-col cost-col">
                                            <span class="detail-lbl" style="visibility:hidden;">佔位</span>
                                            <span class="detail-val"></span>
                                        </div>
                                        <div class="detail-col result-col">
                                            <span class="detail-lbl">實收金額</span>
                                            <span class="detail-val interest">+${item.amount.toLocaleString()}</span>
                                        </div>
                                        <div class="detail-col action-col">
                                            <button class="action-btn edit-btn" onclick="openEditModal(${item.id}, 'dividend', '${group.code}'); event.stopPropagation();">編輯</button>
                                            <button class="action-btn del-btn" onclick="deleteDividend(${item.id}); event.stopPropagation();">刪除紀錄</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        `;
                        tbody.innerHTML += detailHtml;
                    }
                });
                
                // 把建好的 tbody 放進 table 裡
                table.appendChild(tbody);
            });

            document.getElementById("dash-cost").innerText = `$${dashboardCost.toLocaleString()}`;
            
            let rDash = document.getElementById("dash-realized");
            rDash.innerText = dashboardRealized > 0 ? `+$${dashboardRealized.toLocaleString()}` : `$${dashboardRealized.toLocaleString()}`;
            rDash.className = dashboardRealized > 0 ? "val profit" : (dashboardRealized < 0 ? "val loss" : "val neutral");

            let uDash = document.getElementById("dash-unrealized");
            if (heldCodes.size === 0) {
                uDash.innerText = "$0";
                uDash.className = "val neutral";
            } else {
                uDash.innerText = dashboardUnrealized > 0 ? `+$${dashboardUnrealized.toLocaleString()}` : `$${dashboardUnrealized.toLocaleString()}`;
                uDash.className = dashboardUnrealized > 0 ? "val profit" : (dashboardUnrealized < 0 ? "val loss" : "val neutral");
            }

            document.getElementById("dash-dividend").innerText = dashboardDividend > 0 ? `+$${dashboardDividend.toLocaleString()}` : "$0";

            // 🔥 初始化拖拉排序機制
            initSortable();

            document.getElementById("dash-dividend").innerText = dashboardDividend > 0 ? `+$${dashboardDividend.toLocaleString()}` : "$0";

            // 👇 新增以下這段：計算並顯示「總實際入袋」
            let dashboardTotalIncome = dashboardRealized + dashboardDividend;
            let tDash = document.getElementById("dash-total-income");
            tDash.innerText = dashboardTotalIncome > 0 ? `+$${dashboardTotalIncome.toLocaleString()}` : `$${dashboardTotalIncome.toLocaleString()}`;
            tDash.className = dashboardTotalIncome > 0 ? "val profit" : (dashboardTotalIncome < 0 ? "val loss" : "val neutral");

            // 👇 新增這段：如果有人傳遞了代號，就在畫面畫完之後，自動把它點開！
            if (autoExpandCode) {
                let sumRow = document.getElementById(`sum-${autoExpandCode}`);
                if (sumRow && !sumRow.classList.contains('expanded')) {
                    toggleGroup(autoExpandCode);
                }
            }
        }

        // ==========================================
        // 拖拉排序功能初始化
        // ==========================================
        function initSortable() {
            let table = document.getElementById("inventory-list");
            
            if (window.inventorySortable) {
                window.inventorySortable.destroy(); // 避免重複綁定
            }

            window.inventorySortable = Sortable.create(table, {
                draggable: '.stock-group-tbody', // 只允許拖動包含明細的整個 tbody 群組
                handle: '.drag-handle',          // 必須按住 ≡ 才能拖動
                animation: 150,                  // 絲滑動畫
                ghostClass: 'sortable-ghost',    // 拖動時的殘影樣式
                onEnd: function () {
                    // 拖拉結束後，取得最新的順序並存檔
                    let newOrder = [];
                    table.querySelectorAll('.stock-group-tbody').forEach(tb => {
                        if(tb.dataset.code) {
                            newOrder.push(tb.dataset.code);
                        }
                    });
                    customSortOrder = newOrder;
                    localStorage.setItem('customSortOrder', JSON.stringify(customSortOrder));
                }
            });
        }

        function editPrice(code) {
            let currentP = manualPrices[code] || "";
            let input = prompt(`請輸入 ${code} 的手動現價\n(若要恢復系統自動抓取，請清空並按確認)：`, "");
            
            if (input === null) return; // 按下取消
            
            if (input.trim() === "") {
                delete manualPrices[code]; // 留空則刪除手動設定，恢復連線抓取
            } else {
                let price = parseFloat(input);
                if (!isNaN(price) && price >= 0) {
                    manualPrices[code] = price;
                } else {
                    alert("請輸入有效的數字！");
                    return;
                }
            }
            
            localStorage.setItem("manualPrices", JSON.stringify(manualPrices));
            updateInventoryPage(); // 重新計算與渲染
        }

        // 初始化主題 (讀取之前的設定)
        function initTheme() {
            let isDark = localStorage.getItem('darkTheme') === 'true';
            if (isDark) {
                document.body.classList.add('dark-theme');
                updateThemeButton(true);
            }
        }

        // 切換按鈕被點擊時觸發
        function toggleTheme() {
            let body = document.body;
            let isDark = body.classList.toggle('dark-theme');
            localStorage.setItem('darkTheme', isDark); // 記憶你的選擇
            updateThemeButton(isDark);
        }

        // 更新按鈕的外觀與文字
        function updateThemeButton(isDark) {
            let btn = document.getElementById('theme-toggle');
            if (!btn) return;
            if (isDark) {
                btn.innerText = '☀️ 白天模式';
                btn.style.background = '#333';
                btn.style.color = '#fff';
                btn.style.border = '1px solid #555';
            } else {
                btn.innerText = '🌙 黑夜模式';
                btn.style.background = '#fff';
                btn.style.color = '#333';
                btn.style.border = '1px solid #ccc';
            }
        }