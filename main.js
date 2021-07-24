const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {createFolder} = require('./util');
const cacheJson = require('./cache.json') // 数据缓存

// 创建产出文件夹
var fliename = path.join(__dirname, './output');
createFolder(fliename);



// 保存图片到本地
const saveImg = async (url, fileName, item) => {
    try {
        let response = await axios.get(url, {responseType: 'arraybuffer'})
        fs.writeFile(fileName, response.data, err => {
            if (err)  {
                throw err;
            } else {
                console.log(`保存${item.text}成功`);
            }
         });
    } catch (error) {
        console.log(error)
    }
}



// 获取数据缓存
const updteCache = async ()=> {
    const cacheApi = 'http://api.bilibili.com/x/emote/user/panel/web?business=dynamic';
    const cachaFileName = './cache.json'
    try {
        let response = await axios.get(cacheApi)
        const {data, code} = response.data;
        if(code === 0) {
            const str = JSON.stringify(data)
            fs.writeFile(cachaFileName, str, err => {
                if (err) {
                    formatJson(cacheJson);
                    throw err;
                } else {
                    console.log(`数据缓存获取成功, 已保存至: ${cachaFileName}`);
                    formatJson(data);
                }
             });
        } else {
            console.log('接口返回错误', response)
            formatJson(cacheJson);
        }
    } catch (error) {
        console.log(error)
        formatJson(cacheJson);
    }
}

// 格式化数据并创建分类目录
const formatJson = (data) => {
    const {packages} = data;
    const types = packages.map(item => item.text);
    console.log('本次获取到分类: ', types)
    packages.filter(item => item.text !== '颜文字').forEach(item => {
        var fliename = path.join(__dirname, `./output/${item.text}`);
        createFolder(fliename);
        if(item.emote?.length > 0){
            item.emote.forEach(emoteItem => {
                var fliename = path.join(__dirname, `./output/${item.text}/${emoteItem.text}.png`);
                saveImg(emoteItem.url, fliename, emoteItem)
            })
        }
    })
}

updteCache();