const fs = require('fs');


// 创建文件夹
const createFolder = async (fliename) => {
    return await fs.mkdir(fliename, {recursive: true}, err => {
        if(err) {
            throw err;
        }else{
            console.log(`新建目录: ${fliename} 成功!`);
        }
    });
}

exports.createFolder = createFolder;