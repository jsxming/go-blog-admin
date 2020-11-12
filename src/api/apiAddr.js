// api 地址
export const FORMDATA = 'FORMDATA';
export default {
    // deleteUser:'/user/', // url为 / 结尾的后面是路径参数  例： /user/1
    // queryApp:'GET /app/detail',
    // uploadSubject:`POST /chapter/import/ ${FORMDATA}`,//导入章节 有file类型的
    login: 'POST /t/login',
    queryArticle: 'GET /v1/article',
    queryArticles: 'GET /v1/article/search',
    queryArticleTypes: 'GET /v1/article/type/all',
    queryArticleTags: 'GET /v1/article/tag/all',
    updateArticle: 'POST /v1/article/update',
    createArticle: 'POST /v1/article/create',
    deleteArticle: 'POST /v1/article/delete/',
    createAritcleType: 'POST /v1/article/type/create',
    createAritcleTag: 'POST /v1/article/tag/create',
    //------------------------------
};
