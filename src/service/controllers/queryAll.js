/**
 * 模糊查询  
 * 1 收藏夹名称
 * 2 网站标题 > 网站描述
 */

const model = require('../model');
const FavoritesModel = model.FavoritesModel;
const SiteModel = model.SiteModel;
const UserMoadl = model.UserModel;

function getResult(model, _filter) {

    return new Promise((resolve, reject) => {
        // var count = 0
        // model.count(_filter, function (err, doc) { // 查询总条数（用于分页）
        //     if (err) {
        //         console.log('err_count: ' + err)
        //     } else {
        //         count = doc
        //     }
        // })

        model.find(_filter).limit(10) // 最多显示10条
            .sort({
                '_id': -1
            })
            .exec(function (err, doc) {
                if (err) {
                    reject('err_find: ' + err)
                } else {
                    let result = {
                        data: doc,
                        // count: count
                    };

                    if (err) {
                        reject(err)
                    } else {
                        resolve(result);
                    }

                }
            })
    });


}

function getSiteResult(model, _filter) {

    return new Promise((resolve, reject) => {
        // var count = 0
        // model.count(_filter, function (err, doc) { // 查询总条数（用于分页）
        //     if (err) {
        //         console.log('err_count: ' + err)
        //     } else {
        //         count = doc
        //     }
        // })

        model.find(_filter).limit(10) // 最多显示10条
            .sort({
                '_id': -1
            })
            .exec(function (err, doc) {
                if (err) {
                    reject('err_find: ' + err)
                } else {
                    let result = {
                        data: doc,
                        // count: count
                    };
                    console.log('doc', doc)
                        resolve(result)


                    // if (!data) {
                    //     reject(err)
                    // } else {
                        // if (doc[0].avatar && doc) {
                        //     result.data[0].avatar = doc.avatar;
                        // } else {
                        //     Object.assign(result.data, {avatar: '/assets/images/uploads/default.jpg'});
                        // }
                    //     resolve(result)
                    // }


                }
            })
    });


}

module.exports = {
    'GET /g/queryAll': async (ctx, next) => {
        let keyword = ctx.query.keyword || "";
        let data = {
            favorites: [],
            sites: []
        }
        // favorites
        var _filter_favorites = {
            $or: [{
                name: {
                    $regex: keyword,
                    $options: '$i'
                }
            }]
        }

        var _filter_sites = {
            $or: [{
                title: {
                    $regex: keyword,
                    $options: '$i'
                }
            },
            {
                desc: {
                    $regex: keyword,
                    $options: '$i'
                }
            }
            ]
        }

        Promise.all([await getResult(FavoritesModel, _filter_favorites), await getSiteResult(SiteModel, _filter_sites)]).then((results) => {
            data.favorites = results[0];
            data.sites = results[1];
            ctx.body = {
                code: 200,
                data: data,
                msg: 'success'
            };
        }).catch((err) => {
            ctx.body = {
                code: 201,
                msg: err
            };
        });

    }
}