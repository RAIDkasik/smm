
// Главное меню для пользователя

// export const startKeyboard = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [{ text: "Накрутка поведенчиского фактора", callback_data: "nakrutkapf" }],
//             [{ text: "Накрутка отзывов", callback_data: "nakrutkaotsivov" }],
//             [{ text: "Личный кабинет", callback_data: "profile" }],
//             [{ text: "Правила пользования", callback_data: "rules" }],
//             [{ text: "Тех Поддержка", callback_data: "support" }],
//             [{ text: "FAQ/Кейсы", callback_data: "faq" }]
//         ]
//     })
// };

// Подменю "Накрутка поведенческого фактора"

export const PFKeyboard = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Avito: Активности на объявлениях", callback_data: "pfavito" }],
            [{ text: "Яндекс: Активности для сайтов", callback_data: "pfyandex" }],
            [{ text: "На главную", callback_data: "start" }]
        ]
    })
};

export const yandexPf = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Яндекс карты", callback_data: "yandexmap" }],
            [{ text: "Яндекс услуги", callback_data: "yandexservice" }]
        ]
    })
}

// Подменю "Накрутка отзывов"

export const otsivKeyboard = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
           [{text: "Avito", callback_data: "avitootsiv"}],
           [{text: "Яндекс карты", callback_data: "yamdexmapotisv"}],
           [{text: "Яндекс услуги", callback_data: "yandexserviceotsiv"}],
           [{text: "2ГИС", callback_data: "twogisotsiv"}],
           [{text: "YOULA", callback_data: "youlaotsiv"}],
           [{text: "Otzovik", callback_data: "otzovikotsiv"}],
           [{ text: "На главную", callback_data: "start" }]
        ]
    })
};




// Личный кабинет пользователя

export const profileKeyboard = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Пополнить баланс', callback_data: "addbalanceuser" }],
            [{ text: "Показать баланс", callback_data: "showuserbalance" }],
            [{ text: "История пополнений", callback_data: "paymenthistory" }],
            [{ text: 'Показать список заказов', callback_data: "showorders" }],
            [{ text: 'Мои промокоды', callback_data: "mypromo" }],
            [{ text: "На главную", callback_data: "start" }]
        ]
    })
};

export const profileKeyboardWithNotifications = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Пополнить баланс', callback_data: "addbalanceuser" }],
            [{ text: "Показать баланс", callback_data: "showuserbalance" }],
            [{ text: "История пополнений", callback_data: "paymenthistory" }],
            [{ text: 'Показать список заказов', callback_data: "showorders" }],
            [{ text: 'Мои промокоды', callback_data: "mypromo" }],
            [{ text: 'Критические уведомления', callback_data: "criticalnotifications" }],
            [{ text: "На главную", callback_data: "start" }]
        ]
    })
};

// Тех Поддержка
export const supportKeyboard = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Связаться с поддержкой", url: "https://t.me/e_vito" }],
            [{ text: "На главную", callback_data: "start" }]
        ]
    })
};







export const adminKeyboard = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Создать реферальную ссылку", callback_data: "createref" }],
            [{ text: "Статистика ссылок", callback_data: "refstats" }],
            [{ text: "Просмотр баланса пользователей", callback_data: "viewbalance" }],
            [{ text: "Пополнить баланс пользователю", callback_data: "addbalanceadmin" }],
            [{ text: "История Транзакций по каждому пользователю", callback_data: "userhistory" }],
            [{ text: "Удалить пользователя", callback_data: "deleteuser" }],
            [{ text: "Изменение статуса пользователя", callback_data: "changestatus" }],
            [{ text: "Назначение ролей в системе", callback_data: "assignroles" }],
            //[{ text: "Разослать сообщение всем пользователям", callback_data: "broadcast" }],
            [{ text: "Изменить суммы", callback_data: "changeamount" }]
        ]
    })
};

export const managerKeyboard = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Заказы авито ПФ в очереди", callback_data: "manageravitopfqueueue" }, { text: "Архив заказов авито ПФ по дате", callback_data: "managerachiveavitodate" }],
            [{ text: "Заказы яндекс ПФ в очереди", callback_data: "manageryandexpfqueue" }, { text: "Архив заказов яндекс ПФ по дате", callback_data: "managerarchiveyandexdate" }],
            [{ text: "Заказы отзывов в очереди", callback_data: "managerordersqueue" }, { text: "Архив заказов отзывы по дате", callback_data: "managerarchivedate" }],
             [{ text: "Отправить сообщение пользователю", callback_data: "sendMessageToUser" }],
             [{ text: "На главную", callback_data: "start" }]
        ]
    })
};

export const amountsKeyboard = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Изменить сумму для Яндекс ПФ", callback_data: "amountyandexpf" }],
            [{ text: "Изменить сумму для Avito ПФ", callback_data: "amountavitopf" }],
            [{ text: "Изменить сумму для Отзывов", callback_data: "amountotsiv" }]
        ]
    })
}

export const yesNoKeyboard = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Да', callback_data: "yes" }],
            [{ text: 'Нет', callback_data: "no" }]
        ],
        one_time_keyboard: true
    })
};