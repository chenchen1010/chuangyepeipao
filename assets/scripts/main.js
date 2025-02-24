// 初始化地图
let map = null;
let markers = [];
let infoWindows = {};

// 初始化函数
function init() {
    try {
        initMap();
        initFilters();
        renderSpaceList(spacesData.spaces);
        addMarkersToMap(spacesData.spaces);
        
        // 添加联系卡片
        const contactCard = document.createElement('div');
        contactCard.className = 'contact-card';
        contactCard.innerHTML = `
            <button class="toggle-btn" aria-label="展开/收起">
                <svg class="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="contact-card-content">
                <div class="contact-info">
                    <h3>为新创业人保驾护航</h3>
                    <div class="description">
                        <p>欢迎全国人民来杭州创业</p>
                        <p>享受杭州创业友好环境/福利政策</p>
                    </div>
                </div>
                <div class="contact-qrcode">
                    <img src="./assets/images/qrcode.png" alt="联系我们">
                    <p>1V1咨询/联系看场地</p>
                </div>
                <div class="value-added-services">
                    <h4>增值服务</h4>
                    <div class="service-tags">
                        <span class="service-tag">企业开办（营业执照、公章、银行开户）</span>
                        <span class="service-tag">代理记账报税</span>
                        <span class="service-tag" onclick="showRentSubsidyInfo()">创业租房补贴申报</span>
                        <span class="service-tag" onclick="showStartupSubsidyInfo()">大学生创业无偿补贴申报</span>
                        <span class="service-tag">创业其他各类补贴</span>
                        <span class="service-tag">省科小/国高项目申报</span>
                        <span class="service-tag">商标注册</span>
                        <span class="service-tag">知识产权</span>
                        <span class="service-tag">人力资源服务</span>
                        <span class="service-tag">法务咨询</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(contactCard);

        // 添加创业租房补贴信息弹窗
        const subsidyInfoModal = document.createElement('div');
        subsidyInfoModal.className = 'subsidy-modal';
        subsidyInfoModal.innerHTML = `
            <div class="subsidy-modal-content">
                <div class="subsidy-modal-header">
                    <h2>杭州创业租房补贴政策</h2>
                    <button onclick="hideRentSubsidyInfo()" class="close-btn">&times;</button>
                </div>
                <div class="subsidy-modal-body">
                    <h3>申请条件</h3>
                    <p>公司法人需符合以下条件之一：</p>
                    <ul>
                        <li>在校大学生</li>
                        <li>毕业5年以内高校毕业生（创立时属于就行）</li>
                        <li>自主择业军转干部和自主就业退役士兵</li>
                        <li>登记失业半年以上人员或就业困难人员</li>
                        <li>持证残疾人</li>
                    </ul>

                    <h3>补贴标准</h3>
                    <ul>
                        <li>补贴金额：最高3元/平方米·天</li>
                        <li>补贴面积：最高50平方米</li>
                        <li>补贴期限：不超过3年</li>
                        <li>最高补贴：54,750元/年（3*50*365）</li>
                    </ul>

                    <h3>申请流程</h3>
                    <ol>
                        <li>入驻创业陪跑空间（一般押一付三，看空间情况）</li>
                        <li>法人需在公司交社保满6个月（在校生无需交社保）</li>
                        <li>首次申领补贴</li>
                        <li>后续每6个月申请一次</li>
                    </ol>

                    <h3>常见问题</h3>
                    <div class="faq-section">
                        <p><strong>Q：大专生可以申请吗？</strong></p>
                        <p>A：可以，只要是全日制院校都可以</p>
                        
                        <p><strong>Q：人不在杭州可以申请吗？</strong></p>
                        <p>A：可以，无需法人必须在场的流程。其中银行开户委托人代办需要法人身份证原件</p>
                        
                        <p><strong>Q：在校生需要交社保吗？</strong></p>
                        <p>A：不需要</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(subsidyInfoModal);

        // 添加添加大学生创业无偿补贴信息弹窗
        const startupSubsidyModal = document.createElement('div');
        startupSubsidyModal.className = 'subsidy-modal';
        startupSubsidyModal.innerHTML = `
            <div class="subsidy-modal-content">
                <div class="subsidy-modal-header">
                    <h2>杭州大学生创业无偿补贴政策</h2>
                    <button onclick="hideStartupSubsidyInfo()" class="close-btn">&times;</button>
                </div>
                <div class="subsidy-modal-body">
                    <h3>补贴金额</h3>
                    <ul>
                        <li>基础补贴：5-20万元（分为5万、10万、20万三档）</li>
                        <li>注：评审通过率约90%</li>
                    </ul>

                    <h3>申请条件</h3>
                    <ul>
                        <li>法人资格：
                            <ul>
                                <li>毕业5年内的普通高校毕业生</li>
                                <li>全国高校在校生（全日制大专及以上），需学信网可查</li>
                                <li>在公司占股30%以上</li>
                            </ul>
                        </li>
                        <li>企业要求：
                            <ul>
                                <li>在杭州注册的企业</li>
                                <li>正常运营6个月以上</li>
                                <li>法人社保在公司缴纳满6个月（在校生无需）</li>
                                <li>必须有实际经营场地，不能是挂靠地址</li>
                                <li>注册资本最好不低于10万元（无需实缴）</li>
                            </ul>
                        </li>
                    </ul>

                    <h3>申请材料</h3>
                    <ol>
                        <li>《杭州市大学生创业资助资金申请表》</li>
                        <li>身份证、毕业证书、营业执照等证明材料</li>
                        <li>相关支出合同、凭证</li>
                        <li>商业计划书（项目可行性报告）</li>
                        <li>当年注册的要验资报告，上年注册的要审计报告</li>
                    </ol>

                    <h3>申请流程</h3>
                    <ol>
                        <li>核对申报条件，确认申请时间</li>
                        <li>准备并提交申请材料（注意：每个区的申请条件和时间可能不同）</li>
                        <li>人社局初审
                            <ul>
                                <li>如有需要补正的材料，按要求修改</li>
                                <li>初审通过后会进行实地走访，查看经营场地</li>
                            </ul>
                        </li>
                        <li>项目评审答辩
                            <ul>
                                <li>准备路演PPT</li>
                                <li>8分钟项目陈述</li>
                                <li>7分钟专家提问环节</li>
                            </ul>
                        </li>
                        <li>评审结果公示</li>
                        <li>材料归档，发放补贴</li>
                    </ol>

                    <h3>常见问题</h3>
                    <div class="faq-section">
                        <p><strong>Q：大专生可以申请吗？</strong></p>
                        <p>A：可以，只要是全日制院校都可以申请</p>
                        
                        <p><strong>Q：必须是杭州的学校吗？</strong></p>
                        <p>A：不一定。毕业生只要是全国普通高校毕业5年内即可；在校生只要学信网可查即可</p>
                        
                        <p><strong>Q：创业项目有行业限制吗？</strong></p>
                        <p>A：没有限制，自媒体、实体、电商、软件开发、设计、咨询等都可以申请</p>

                        <p><strong>Q：注册地址有要求吗？</strong></p>
                        <p>A：必须有实际办公场地，不能使用挂靠地址，人社局会实地走访核实</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(startupSubsidyModal);

        // 添加收缩功能
        const toggleBtn = contactCard.querySelector('.toggle-btn');
        toggleBtn.addEventListener('click', () => {
            contactCard.classList.toggle('collapsed');
            // 更新箭头方向
            const arrow = toggleBtn.querySelector('.arrow-icon');
            arrow.style.transform = contactCard.classList.contains('collapsed') ? 'rotate(180deg)' : '';
        });

    } catch (error) {
        console.error('地图初始化失败:', error);
        document.getElementById('map-container').innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>地图加载失败</h3>
                <p>可能原因：</p>
                <ul style="list-style: none; padding: 0;">
                    <li>1. 百度地图API密钥未正确配置</li>
                    <li>2. 域名未添加到白名单</li>
                    <li>3. 网络连接问题</li>
                </ul>
                <p>请确保已在百度地图开放平台正确配置安全设置。</p>
            </div>
        `;
    }
}

// 初始化百度地图
function initMap() {
    try {
        map = new BMap.Map("map-container");
        const hangzhou = new BMap.Point(120.153576, 30.287459);
        map.centerAndZoom(hangzhou, 12);
        map.enableScrollWheelZoom();
        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl());
    } catch (error) {
        throw new Error('百度地图初始化失败：' + error.message);
    }
}

// 初始化筛选器事件监听
function initFilters() {
    document.getElementById('district-filter').addEventListener('change', filterSpaces);
    document.getElementById('vacancy-filter').addEventListener('change', filterSpaces);
}

// 筛选场地
function filterSpaces() {
    const district = document.getElementById('district-filter').value;
    const onlyVacancy = document.getElementById('vacancy-filter').checked;

    const filteredSpaces = spacesData.spaces.filter(space => {
        const districtMatch = !district || space.district === district;
        const vacancyMatch = !onlyVacancy || space.hasVacancy;
        return districtMatch && vacancyMatch;
    });

    renderSpaceList(filteredSpaces);
    addMarkersToMap(filteredSpaces);
}

// 渲染场地列表
function renderSpaceList(spaces) {
    const spaceList = document.getElementById('space-list');
    spaceList.innerHTML = spaces.map(space => `
        <div class="space-card" onclick="focusSpace('${space.id}')">
            <h3>${space.name}</h3>
            <div class="space-info">
                <p>${space.address}</p>
                <div class="vacancy-badge ${space.hasVacancy ? 'has-vacancy' : 'no-vacancy'}">
                    ${space.hasVacancy ? '还有房间' : '空间已满'}
                </div>
            </div>
        </div>
    `).join('');
}

// 添加标记点到地图
function addMarkersToMap(spaces) {
    // 清除现有标记点
    markers.forEach(marker => map.removeOverlay(marker));
    markers = [];
    infoWindows = {}; // 重置信息窗口对象

    spaces.forEach(space => {
        const point = new BMap.Point(space.coordinates.lng, space.coordinates.lat);
        const marker = new BMap.Marker(point);
        
        // 创建信息窗口
        const infoWindow = new BMap.InfoWindow(`
            <div style="padding: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #1d1d1f; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">${space.name}</h2>
                
                <div style="display: flex; flex-wrap: wrap; gap: 15px; height: 300px;">
                    <div style="flex: 1; min-width: 200px;">
                        <div style="margin-bottom: 12px;">
                            <div style="color: #666; margin-bottom: 4px; font-size: 13px;">地址</div>
                            <div style="color: #333;">${space.address}</div>
                        </div>

                        <div style="display: flex; gap: 15px; margin-bottom: 12px;">
                            <div style="flex: 1;">
                                <div style="color: #666; margin-bottom: 4px; font-size: 13px;">总面积</div>
                                <div style="color: #333;">${(() => {
                                    if (!space.area || isNaN(space.area)) {
                                        return '暂无数据';
                                    }
                                    try {
                                        const formatted = Number(space.area).toLocaleString('zh-CN', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        });
                                        return formatted + ' m²';
                                    } catch (error) {
                                        console.error(`[信息窗口] 面积格式化错误:`, error);
                                        return '数据格式错误';
                                    }
                                })()}</div>
                            </div>
                            <div style="flex: 1;">
                                <div style="color: #666; margin-bottom: 4px; font-size: 13px;">房间状态</div>
                                <div style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 13px; 
                                    ${space.hasVacancy ? 
                                        'background: #e8f5e9; color: #2e7d32;' : 
                                        'background: #ffebee; color: #c62828;'
                                    }">
                                    ${space.hasVacancy ? '还有房间' : '空间已满'}
                                </div>
                            </div>
                        </div>

                        ${space.features.length > 0 ? `
                            <div>
                                <div style="color: #666; margin-bottom: 4px; font-size: 13px;">服务特色</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                                    ${space.features.map(feature => 
                                        `<span style="display: inline-block; background: #f0f2f5; padding: 4px 12px; 
                                            border-radius: 20px; font-size: 13px; color: #1a73e8;">${feature}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; height: 100%;">
                        <div style="color: #666; margin-bottom: 4px; font-size: 13px;">场地简介</div>
                        <div style="color: #333; line-height: 1.5; overflow-y: auto; padding-right: 8px; height: calc(100% - 25px);">
                            <div style="padding-right: 4px;">${space.description}</div>
                        </div>
                    </div>
                </div>
            </div>
        `, {
            width: 500,
            height: 0,
            title: null,
            enableCloseOnClick: true,
            enableAutoPan: true
        });

        // 存储信息窗口引用
        infoWindows[space.id] = {
            window: infoWindow,
            marker: marker,
            point: point
        };

        // 点击标记点显示信息窗口
        marker.addEventListener('click', () => {
            map.openInfoWindow(infoWindow, point);
        });

        map.addOverlay(marker);
        markers.push(marker);

        // 添加自定义样式到页面
        if (!document.getElementById('custom-infowindow-styles')) {
            const style = document.createElement('style');
            style.id = 'custom-infowindow-styles';
            style.textContent = `
                .BMap_pop * {
                    box-shadow: none !important;
                }
                .BMap_shadow, 
                .BMap_shadow * {
                    display: none !important;
                }
                .BMap_pop div {
                    background-image: none !important;
                }
                .BMap_pop {
                    background: white !important;
                }
                .BMap_bubble_pop {
                    background: white !important;
                }
                .BMap_bubble_title {
                    display: none !important;
                }
                .BMap_bubble_content {
                    padding: 0 !important;
                }
                .BMap_bubble_top,
                .BMap_bubble_center,
                .BMap_bubble_bottom,
                .BMap_bubble_content {
                    background-image: none !important;
                    background-color: white !important;
                }
                /* 移除小箭头 */
                .BMap_bubble_pop > div:last-child > img {
                    display: none !important;
                }

                /* 自定义滚动条样式 */
                .BMap_bubble_content ::-webkit-scrollbar {
                    width: 6px;
                }
                
                .BMap_bubble_content ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                
                .BMap_bubble_content ::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }
                
                .BMap_bubble_content ::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }

                /* 联系卡片样式 */
                .contact-card {
                    position: fixed;
                    right: 0;
                    bottom: 50%;
                    transform: translateY(50%);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    transition: transform 0.3s ease;
                }

                .contact-card.collapsed {
                    transform: translateY(50%) translateX(calc(100% - 32px));
                }

                .contact-card-content {
                    padding: 12px;
                    width: 300px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    background: white;
                    border-radius: 12px 0 0 12px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .contact-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .contact-info h3 {
                    font-size: 16px;
                    color: #333;
                    margin: 0 0 4px 0;
                    text-align: center;
                }

                .contact-info .description {
                    margin: 0 auto;
                    max-width: 200px;
                }

                .contact-info p {
                    font-size: 13px;
                    color: #666;
                    margin: 0;
                    line-height: 1.4;
                    text-align: center;
                }

                .contact-qrcode {
                    width: 140px;
                    height: auto;
                    margin: 4px auto 0;
                    text-align: center;
                }

                .contact-qrcode img {
                    width: 140px;
                    height: 140px;
                    object-fit: contain;
                    margin-bottom: 6px;
                }

                .contact-qrcode p {
                    font-size: 12px;
                    color: #666;
                    margin: 0;
                }

                .toggle-btn {
                    width: 32px;
                    height: 48px;
                    padding: 8px 4px;
                    background: #1a73e8;
                    color: white;
                    border: none;
                    border-radius: 4px 0 0 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.3s ease;
                }

                .toggle-btn:hover {
                    background: #1557b0;
                }

                .arrow-icon {
                    transition: transform 0.3s ease;
                }

                .contact-card.collapsed .arrow-icon {
                    transform: rotate(180deg);
                }

                .value-added-services {
                    text-align: left;
                    padding: 0 4px;
                }

                .value-added-services h4 {
                    font-size: 14px;
                    color: #333;
                    margin: 0 0 8px 0;
                    font-weight: 600;
                }

                .service-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .service-tag {
                    display: inline-block;
                    padding: 4px 10px;
                    background: #f0f2f5;
                    color: #1a73e8;
                    border-radius: 20px;
                    font-size: 12px;
                    line-height: 1.4;
                    white-space: nowrap;
                    transition: all 0.3s ease;
                }

                .service-tag[onclick] {
                    background: #e8f0fe;
                    border: 1px solid #1a73e8;
                    padding: 3px 9px;
                    cursor: pointer;
                    position: relative;
                }

                .service-tag[onclick]::after {
                    content: '👆';
                    font-size: 10px;
                    margin-left: 4px;
                    display: inline-block;
                }

                .service-tag[onclick]:hover {
                    background: #d2e3fc;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(26, 115, 232, 0.1);
                }

                .service-tag:not([onclick]):hover {
                    background: #e8f0fe;
                }

                /* 补贴政策弹窗样式 */
                .subsidy-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 2000;
                    justify-content: center;
                    align-items: center;
                }

                .subsidy-modal-content {
                    background: white;
                    width: 90%;
                    max-width: 600px;
                    max-height: 80vh;
                    border-radius: 12px;
                    overflow-y: auto;
                    position: relative;
                }

                .subsidy-modal-header {
                    padding: 16px 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    background: white;
                    z-index: 1;
                }

                .subsidy-modal-header h2 {
                    margin: 0;
                    font-size: 18px;
                    color: #333;
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #666;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }

                .close-btn:hover {
                    background: #f5f5f5;
                }

                .subsidy-modal-body {
                    padding: 20px;
                }

                .subsidy-modal-body h3 {
                    color: #1a73e8;
                    margin: 20px 0 12px;
                    font-size: 16px;
                }

                .subsidy-modal-body ul,
                .subsidy-modal-body ol {
                    padding-left: 20px;
                    margin: 8px 0;
                }

                .subsidy-modal-body li {
                    margin: 8px 0;
                    line-height: 1.5;
                    color: #333;
                }

                .faq-section p {
                    margin: 8px 0;
                    line-height: 1.6;
                }

                .faq-section strong {
                    color: #1a73e8;
                }

                .service-tag {
                    cursor: pointer;
                }
            `;
            document.head.appendChild(style);
        }
    });
}

// 显示创业租房补贴信息
function showRentSubsidyInfo() {
    const modal = document.querySelector('.subsidy-modal');
    modal.style.display = 'flex';
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

// 隐藏创业租房补贴信息
function hideRentSubsidyInfo() {
    const modal = document.querySelector('.subsidy-modal');
    modal.style.display = 'none';
    // 恢复背景滚动
    document.body.style.overflow = '';
}

// 显示大学生创业无偿补贴信息
function showStartupSubsidyInfo() {
    const modal = document.querySelector('.subsidy-modal:last-child');
    modal.style.display = 'flex';
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

// 隐藏大学生创业无偿补贴信息
function hideStartupSubsidyInfo() {
    const modal = document.querySelector('.subsidy-modal:last-child');
    modal.style.display = 'none';
    // 恢复背景滚动
    document.body.style.overflow = '';
}

// 点击模态框外部关闭（更新现有的事件监听器）
document.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.subsidy-modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});

// 聚焦到特定场地
function focusSpace(spaceId) {
    const info = infoWindows[spaceId];
    if (info) {
        map.centerAndZoom(info.point, 15);
        map.openInfoWindow(info.window, info.point);
    }
} 