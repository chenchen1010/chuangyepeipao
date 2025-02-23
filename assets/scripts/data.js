let spacesData = {
    spaces: []
};

// 将地址转换为经纬度
function getCoordinates(address) {
    return new Promise((resolve, reject) => {
        const myGeo = new BMap.Geocoder();
        myGeo.getPoint(address, function(point){
            if (point) {
                const coordinates = {
                    lng: point.lng,
                    lat: point.lat
                };
                console.log(`地址 "${address}" 的经纬度:`, coordinates);
                resolve(coordinates);
            } else {
                console.warn(`未找到地址 "${address}" 的坐标`);
                reject(new Error('未找到该地址的坐标'));
            }
        }, "杭州市");
    });
}

// 从Excel读取数据
async function loadExcelData() {
    try {
        console.log('开始读取Excel文件...');
        const response = await fetch('杭州创业办公空间_102个.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        console.log('工作表名称:', workbook.SheetNames);
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 将工作表转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        // console.log('原始Excel数据:', jsonData);
        
        // 获取所有唯一的区域
        const districts = [...new Set(jsonData.map(row => row['所属区域']).filter(Boolean))].sort();
        console.log('可用区域列表:', districts);
        
        // 更新区域选择下拉框
        const districtFilter = document.getElementById('district-filter');
        districtFilter.innerHTML = `
            <option value="">全部区域</option>
            ${districts.map(district => `<option value="${district}">${district}</option>`).join('')}
        `;
        
        // 转换数据格式并获取经纬度
        const spacesPromises = jsonData.map(async (row, index) => {
            // 处理面积字符串，移除 m² 单位并转换为数字
            // console.log('原始行数据:', row);  // 打印完整的行数据
            const rawArea = row['总面积'];  // 修改字段名为"总面积"
            // console.log(`[面积处理] 原始数据类型: ${typeof rawArea}, 值:`, rawArea);
            
            let areaNum = 0;
            if (rawArea !== undefined && rawArea !== null) {
                // 如果是数字类型，直接使用
                if (typeof rawArea === 'number') {
                    areaNum = rawArea;
                    // console.log(`[面积处理] 数字类型，直接使用: ${areaNum}`);
                } else {
                    // 如果不是数字类型，进行字符串处理
                    const areaStr = rawArea.toString();
                    // console.log(`[面积处理] 转字符串: "${areaStr}"`);
                    
                    const cleanAreaStr = areaStr
                        .replace(/m²|㎡/g, '')  // 移除单位（支持两种写法）
                        .replace(/,/g, '')   // 移除逗号
                        .replace(/\s+/g, '') // 移除所有空格
                        .trim();             // 移除首尾空格
                    
                    // console.log(`[面积处理] 清理后的字符串: "${cleanAreaStr}"`);
                    areaNum = parseFloat(cleanAreaStr);
                    // console.log(`[面积处理] 最终数值: ${areaNum}`);
                }

                // 如果转换结果为 NaN，打印更多信息
                if (isNaN(areaNum)) {
                    console.warn(`[面积处理警告] 面积转换失败:`, {
                        原始值: rawArea,
                        原始类型: typeof rawArea,
                        数值: areaNum
                    });
                    areaNum = 0;  // 转换失败时设为0
                }
            } else {
                console.warn(`[面积处理警告] 面积数据缺失`);
            }

            // 获取经纬度
            let coordinates;
            let coordinateSource = ''; // 添加来源标记
            
            // 1. 首先尝试使用地理编码服务
            try {
                coordinates = await getCoordinates(row['详细地址']);
                coordinateSource = '地理编码服务';
                console.log(`使用地理编码服务获取经纬度 - 地址: "${row['详细地址']}"`, coordinates);
            } catch (error) {
                // 2. 如果地理编码失败，尝试使用Excel中的经纬度
                if (row['经度'] && row['纬度']) {
                    coordinates = {
                        lng: parseFloat(row['经度'].toString().replace(',', '')),
                        lat: parseFloat(row['纬度'].toString())
                    };
                    coordinateSource = 'Excel数据';
                    console.log(`地理编码失败，使用Excel中的经纬度 - 地址: "${row['详细地址']}"`, coordinates);
                } else {
                    // 3. 如果Excel中也没有经纬度，使用默认坐标
                    console.warn(`无法获取地址 "${row['详细地址']}" 的经纬度，且Excel中无数据，使用默认坐标`);
                    coordinates = {
                        lng: 120.153576,
                        lat: 30.287459
                    };
                    coordinateSource = '默认坐标';
                }
            }

            const space = {
                id: (index + 1).toString(),
                name: row['场地名称'] || '',
                area: areaNum,  // 移除 || 0，因为我们已经在上面处理了默认值
                district: row['所属区域'] || '',
                address: row['详细地址'] || '',
                description: row['空间简介'] || '',
                features: (row['服务特色'] || '').split(/\s+/).map(s => s.trim()).filter(Boolean),
                coordinates: coordinates,
                hasVacancy: row['是否有空余'] === '是',
                images: [row['场地大纲图片'] || ''],
                contact: {
                    qrcode: ''
                }
            };
            
            // 打印完整的场地信息
            console.log('----------------------------------------');
            console.log(`场地 ${index + 1} (${space.name}) 信息:`);
            console.log('地址:', space.address);
            console.log('经纬度来源:', coordinateSource);
            console.log('经纬度:', space.coordinates);
            console.log('面积:', space.area);
            console.log('区域:', space.district);
            console.log('是否有空余:', space.hasVacancy);
            console.log('----------------------------------------');
            
            return space;
        });

        // 等待所有地址转换完成
        spacesData.spaces = await Promise.all(spacesPromises);
        console.log('总共读取到', spacesData.spaces.length, '个场地');
        
        // 数据加载完成后初始化地图
        init();
    } catch (error) {
        console.error('Excel数据加载失败:', error);
        console.error('错误详情:', {
            message: error.message,
            stack: error.stack
        });
        document.getElementById('map-container').innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>数据加载失败</h3>
                <p>无法读取场地数据，请确保Excel文件存在且格式正确。</p>
                <p>错误信息：${error.message}</p>
            </div>
        `;
    }
}

// 页面加载完成后读取Excel数据
window.onload = loadExcelData; 