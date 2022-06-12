var axios = require('axios');
var qs = require('qs');
const cron = require("node-cron");
let count = 0

//запрос на получение токена у Twitch
var data = qs.stringify({
    'client_id': '91yjam970mpma2jdoj30t0p4pdo35w', // id пользователя
    'client_secret': 'msabge5w7j8ds2hu98gvwz2gevyeju', // секретный id
    'grant_type': 'client_credentials'
});
var config = {
    method: 'post',
    url: 'https://id.twitch.tv/oauth2/token',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
};
axios(config)
    .then(function (response) {
        getStreem(response.data.access_token) // после получения токена, запускаем крон на получения просмотров
    })
    .catch(function (error) {
        console.log(error);
    });

const getStreem = (token) => {
    cron.schedule('*/1 * * * *', () => {
        console.log(token, 'running a task every minute');
        var config = {
            method: 'get',
            url: 'https://api.twitch.tv/helix/streams?user_id=71092938',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': '91yjam970mpma2jdoj30t0p4pdo35w'
            },
        };
        axios(config)
            .then(function (response) {
                console.log(count, 'count') // счетчик часов стримера
                console.log(response.data.data[0].viewer_count, 'viewer_count'); // количество зрителей на стриме
                console.log(Math.round(response.data.data[0].viewer_count / 60), 'hours'); // количество часов
                count += Math.round(response.data.data[0].viewer_count / 60) // складываем каждую минуту в счетчик новые часы
            })
            .catch(function (error) {
                console.log(error);
            });
    });
}
