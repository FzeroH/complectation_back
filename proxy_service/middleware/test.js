module.exports.sessionMiddleware = function (req, res, next) {
    // Проверяем наличие данных сессии
    if (req.session && req.session.user) {
        // Добавляем данные сессии в объект req
        req.user = {...req.session.user};
        console.log('middleware')
        console.log(req.user)
    }
    next();
};
