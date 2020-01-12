export function upLoad(tempFilePaths,cb){
    var ossUrl = "https://sinostoragedev.oss-cn-hangzhou.aliyuncs.com";
    var imgList = [];
    new Promise(function(resolve,reject){
        tempFilePaths.forEach(item => {
            var myDate = new Date();
            var ossPath = 'upload/' + myDate.getFullYear();
            var fileName = Date.now() + "" + parseInt(Math.random() * 1000) + '.' + item.split('.')[3];
            var fileKey = ossPath + '' + fileName;
            wx.uploadFile({
                url: ossUrl,
                filePath: item,
                name: 'file',
                formData: {
                    name: item,
                    key: fileKey,
                    policy: 'eyJleHBpcmF0aW9uIjoiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmsdfsssssssfs少时诵诗书所所==',
                    OSSAccessKeyId: 'AAAAAAAAAAAAAAA',
                    signature: '9GH1EcR+paJdIKTxXT+WQySZOdE=',
                    success_action_status: "200"
                },
                success: function (res){
                    const data = res.data;
                    // imgList.push({
                    //     'name': fileName,
                    //     'path': ossUrl + '/' + fileKey
                    // })
                    // console.log('0',imgList)
                    imgList.push(ossUrl + '/' + fileKey);
                    resolve();
                },
                fail: function (res){
                    reject();
                }
            })
        });
    }).then(function(r){
        // console.log('1',imgList)
        cb(imgList);
    }).catch(function(reason){
        // cb(imgList);
        // console.log('2',imgList)
    })
}

export default{
    upLoad
}