import dotenv from 'dotenv'
dotenv.config({ path: "./assets/modules/.env" })
import TelegramBot from 'node-telegram-bot-api'
import { PFKeyboard, otsivKeyboard, amountsKeyboard, yandexPf, supportKeyboard } from './assets/keyboard/keyboard.js'
import {logger} from "./assets/logger/logger.js";
import { promises as fs } from 'fs';
import { Admin } from './assets/scripts/adminFunctions.js'
import { User } from './assets/scripts/userFunctions.js';
import amount from './assets/db/bot/amounts/amounts.json' with {type: "json"}
import { Manager } from './assets/scripts/managerFunctions.js';
import { log } from 'console';
import { createKeyboard } from "./assets/scripts/check_buttons.js";
import { pool } from "./assets/db/config/connect.js";

const bot = new TelegramBot(process.env.TOKEN, { polling: true })

const commands = JSON.parse(await fs.readFile('./assets/db/commands/commands.json'))

const user = new User()

bot.setMyCommands(commands)


bot.on('message', async msg => {
    logger.info(msg.from.id)
    const id = msg.from.id;
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    const lastName = msg.from.last_name;
    const username = msg.from.username;
    const from = msg.text ? msg.text.replace(/^\/start\s*/, '') || null : null;
    logger.info(from)

    console.log(chatId);

    if (msg.text && msg.text.includes('/start')) {
        try {
            const userInfo = await user.getUserInfo(chatId);
            const refInfo = await user.getReferralLinkData(from);
            if (refInfo != null){
                if (userInfo == null){
                    user.addReferralUsers(chatId, username, refInfo.id, 1, Date.now());
                }
                else{
                    console.log(refInfo);
                    user.addReferralUsers(chatId, username, refInfo.id, 0, userInfo.firstJoinDate);
                }
            }

            const isAllowed = await user.checkUserStatus(bot, chatId);
            if (!isAllowed) {
                return;
            }

            return user.checkUserExists(id, async (error, exists) => {
                if (error) {
                    logger.error("Error checking user");
                    return;
                }

                if (!exists) {
                    user.addUser(id, chatId, firstName, lastName, username, from, 0, "активный", "пользователь", 0, async (error) => {
                        if (error) {
                            logger.error("Error adding user.");
                        } else {
                            logger.info("User added to the database");
                            new Admin().checkAdmin(bot, chatId, id);
                        }
                    });
                } else {
                    logger.info('User already exists in the database');
                    new Admin().checkAdmin(bot, chatId, id);
                }
            });
        } catch (error) {
            logger.error(error);
        }
    }
})

const manager = new Manager();

bot.on('callback_query', async msg => {
    const chatId = msg.message.chat.id;
    const messageId = msg.message.message_id;
    const callbackData = msg.data.split('_');
    const action = msg.data.split('_')[0];
    const userInfo = await user.getUserInfo(chatId);

    console.log(action);

    try{
        if (userInfo.role == "пользователь"){
            await bot.deleteMessage(chatId, messageId);
        }
    } catch(error){
        console.log(error);
    }
    
    
    logger.info(`${chatId} ${callbackData}`)

    let result = await new Promise((resolve, reject) => {
        pool.query("SELECT * FROM user_buttons_activity WHERE callback_data LIKE ? AND work='yes'", [`${action}%`], (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.length === 0) {
                return resolve(null);
            }
            resolve(results[0]);
        });
    });
    if (userInfo.role != "пользователь"){
        result = [];
    }
    console.log(114, result);
    if (result != null){
        let btns = [];
        let reply_markup = [];
        switch (action) {
            case "nakrutkapf":
                await bot.sendMessage(chatId, "🚀 Мы профессионально занимаемся накруткой поведенческого фактора более 10 лет.\n\n🏷️ Вы можете заказать накрутку поведенческого фактора на Avito для ваших объявлений, или заказать накрутку для вашего сайта через поисковую систему Яндекс.\n\n👇 Выберите платформу для детальной информации:", PFKeyboard);
                break;
            case "nakrutkaotsivov":
                btns = [['avitootsiv'], ['yamdexmapotisv'], ['twogisotsiv'], ['youlaotsiv'], ['otzovikotsiv'], ['start']];
                reply_markup = await createKeyboard(btns, 'Отзывы');
                await bot.sendMessage(
                    chatId,
                    "✨ У нас есть огромная команда исполнителей, готовых оставить положительные отзывы о вашем бизнесе.\n\n" +
                    "🌐 Мы предлагаем отзывы для различных платформ и тщательно следим за каждым отзывом.\n\n" +
                    "Как это работает:\n" +
                    "    1. Процесс проверки: Мы контролируем каждый отзыв\n" + "    в течение 14 дней. Если отзыв удаляется, мы размещаем его\n" + "    заново.\n" +
                    "    2. Надежность: Наши отзывы остаются с почти 100%\n" + "    вероятностью, что значительно выше, чем у наших\n" + "    конкурентов.\n" +
                    "    3. Отчеты: После того как отзыв пройдет 14-дневный период\n" + "    и будет утвержден, мы делаем скриншот и предоставляем\n" + "    его вам в отчетах о выполненной работе.\n\n" +
                    "Ваши действия:\n" +
                    "    1. Выберите площадку: Мы предлагаем отзывы для различных платформ, включая Яндекс Карты, Яндекс Услуги, Avito, 2ГИС, Flamp, и Youla.\n" +
                    "    2. Выберите количество отзывов: Определите, сколько отзывов вам необходимо для достижения ваших бизнес-целей.\n" +
                    "    3. Оплата: После выбора количества отзывов, произведите оплату, и мы немедленно приступим к работе.\n\n" +
                    "🔗 Выберите нужную платформу и заказывайте прямо сейчас, чтобы улучшить репутацию вашего бизнеса и увеличить его привлекательность для клиентов.",
                    {reply_markup}
                );
                break;
            case "profile":
                await user.profile(bot, chatId, msg.from.id);
                break;
            case "rules":
                await bot.sendMessage(chatId,
                    "Правила пользования\n" +
                    "📜 Важно ознакомиться с правилами пользования нашими услугами. Их соблюдение поможет избежать недоразумений и обеспечит лучшее взаимопонимание между нами и нашими клиентами.\n" +
                    "    1. Вы самостоятельно выбираете количество поведенческих факторов или отзывов, соответствующее вашим потребностям. Обратите внимание, что мы не несем ответственности за последствия вашего выбора, так как исход зависит от многих факторов, включая алгоритмы платформ.\n" +
                    "    2. Исполнение отзывов: Все отзывы оставляются нашими исполнителями строго по вашему запросу. Вы полностью контролируете содержание и количество запрашиваемых отзывов.\n" +
                    "    3. Юридическая ответственность: Наша платформа выступает посредником между исполнителями и заказчиками. Юридическая ответственность за выполнение услуг лежит на исполнителе и заказчике. Мы обеспечиваем лишь платформу для взаимодействия сторон.\n" +
                    "    4. Отказ от выполнения заказа: Мы оставляем за собой право отказать в выполнении заказа по нашему усмотрению. В случае отказа, возвращаем деньги на баланс личного кабинета клиента или на его расчетный счет, в зависимости от изначального метода оплаты.\n" +
                    "    5. Согласие с правилами: Выбирая наши услуги, вы автоматически соглашаетесь со всеми вышеизложенными правилами. Пожалуйста, убедитесь, что вы полностью их понимаете и принимаете.\n" +
                    "📌 Законность действий: Все наши услуги реализуются в рамках действующего законодательства. Мы призываем клиентов использовать наши услуги ответственно и с учетом всех законных требований.",
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "В личный кабинет", callback_data: "profile" }, { text: "В главное меню", callback_data: "start" }]
                            ]
                        }
                    });
                break;
            case "support":
                await bot.sendMessage(chatId, "🔧 Если у вас возникли вопросы или проблемы, наша служба поддержки готова помочь! 🕘 Наше рабочее время: с 9:00 до 20:00 по Московскому времени. Не стесняйтесь обращаться, мы всегда на связи для вас!\n\n" +
                    "🔍 Информационная поддержка: Перед тем как задать вопрос, рекомендуем вам посетить раздел FAQ / Кейсы в главном меню нашего бота. Там вы найдёте множество полезных ответов, а также ссылки на наш сайт и телеграм-каналы, где подробно разъяснены многие аспекты наших услуг.\n\n" +
                    "📖 Обширная база знаний: В разделе FAQ / Кейсы вы найдете не только ответы на частые вопросы, но и многочисленные кейсы и примеры, которые помогут вам лучше понять, как максимально эффективно использовать наши услуги.\n\n" +
                    "💡 Готовы помочь: Наша цель — убедиться, что ваш опыт использования наших услуг максимально комфортен и продуктивен. Если вы не нашли ответ в FAQ, напишите нам, и мы оперативно поможем решить любую проблему.\n\n" +
                    "🔗 Подключайтесь к нашим каналам: Подписывайтесь на наши телеграм-каналы, чтобы быть в курсе всех актуальных новостей и обновлений. Ссылки на каналы можно найти в разделе FAQ / Кейсы.", supportKeyboard);
                break;
            case "faq":
                await bot.sendMessage(chatId, "🌐 Основной канал Авито пф (@e_vito_info)" +
                    "🔍 Погрузитесь в мир накрутки поведенческих факторов на Avito с нашим основным каналом! Здесь мы не только разбираем процессы в деталях, но и объясняем, что такое поведенческий фактор, как он влияет на позиции ваших объявлений, и почему наш подход является лучшим на рынке.\n\n" +
                    "🚀 Что вы найдете в этой группе:\n" +
                    "   • Глубокие анализы и разборы: Узнайте, почему важно стратегически подходить к накрутке поведенческих факторов." +
                    "   • Эксклюзивные знания: Предоставляем материалы, которые наша команда копила годами — ценные сведения, которые вы не найдете в доступных источниках." +
                    "   • Мультимедийный контент: Вас ждут аудио и видеозаписи, которые помогут лучше понять тему и усвоить информацию на практике." +
                    "   • Секреты мастерства: Поделимся, почему необходимо составлять план накрутки и как правильно его реализовать, чтобы достичь максимального эффекта." +
                    "📈 Польза для вашего бизнеса:" +
                    "   Используйте наши стратегии и подходы, чтобы вывести ваши объявления на новый уровень и значительно увеличить их эффективность." +
                    "🎥 Подключайтесь к нам:" +
                    "   Присоединяйтесь к нашему каналу @e_vito_info и начните применять лучшие практики накрутки уже сегодня. Ваши объявления заслуживают быть на вершине!\n\n" +
                    "🗣 Основной канал по отзывам и управлению деловой репутацией (@e_otzyv)\n" +
                    "🔍 Присоединяйтесь к нашему экспертному каналу, посвященному всем аспектам работы с отзывами на различных платформах! Здесь вы найдете всё, что нужно знать о сроках публикации отзывов, их влиянии на репутацию вашего бизнеса, и как эффективно управлять вашим онлайн-присутствием.\n" +
                    "📢 Что вы узнаете:\n" +
                    "   • Сроки и процессы: Ответы на вопросы о времени публикации отзывов и причинах, по которым этот процесс может занимать больше времени.\n" +
                    "   • Гарантии и качество: Обсуждение того, как мы обеспечиваем стойкость и надежность отзывов.\n" +
                    "   • Нюансы на разных платформах: Подробные разъяснения, почему работа с отзывами отличается в зависимости от платформы.\n" +
                    "   🎧 Мультимедийный контент:" +
                    "   • Подкасты и аудиозаписи: Регулярные публикации, которые описывают наш подход и особенности работы с отзывами через аудиоформат, делая информацию доступной и понятной." +
                    "💡 Эксклюзивные знания:\n" +
                    "   • Приватная информация: Получите доступ к уникальным знаниям и методикам, которые наша команда собирала годами. Эти ценные данные помогут вам эффективно управлять отзывами и улучшить репутацию вашего бизнеса." +
                    "🔗 Присоединяйтесь к сообществу:\n" +
                    "👥 Подписывайтесь на @e_otzyv и станьте частью нашего профессионального сообщества. Вместе мы сможем достичь большего успеха в управлении отзывами и деловой репутацией!",
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "В личный кабинет", callback_data: "profile" }, { text: "В главное меню", callback_data: "start" }]
                            ]
                        }
                    });

                await bot.sendMessage(chatId, "📈 Основной канал по Яндекс пф (@e_top)\n" +
                    "🔍 Наш экспертный канал, посвящённый накрутке поведенческих факторов для Яндекса! Здесь вы найдете всё необходимое для эффективного улучшения ваших позиций в поиске Яндекса.\n" +
                    "🚀 Что вас ждет в канале:\n" +
                    "   • Глубокие анализы: Понимание того, как правильно улучшать позиции в поисковой выдаче.\n" +
                    "   • Инновационные технологии: Использование передовых методик и технологий для максимизации результатов.\n" +
                    "   • Эксклюзивные советы: Наши специалисты делятся ценными советами, как оптимизировать процессы накрутки.\n" +
                    "🎧 Мультимедийные материалы:\n" +
                    "   • Аудиоматериалы: Погружение в тему через доступные аудиоуроки и подкасты, которые облегчают усвоение информации.\n" +
                    "🔍 Углублённое изучение:\n" +
                    "   Наша команда специалистов, имеющая многолетний опыт в накрутке поведенческих факторов для Яндекса, готова поделиться с вами своими знаниями и опытом. Получите ответы на все вопросы и начните эффективно продвигать свои проекты уже сегодня!\n" +
                    "🔗 Присоединяйтесь к нам:\n" +
                    "   Подписывайтесь на наш канал @e_top, чтобы всегда быть в курсе последних трендов и методик в области SEO для Яндекса.\n\n\n" +



                    "🚀 Кейсы продвижения Avito (@e_vito_keys)\n" +
                    "🔍 Изучите реальные кейсы по продвижению объявлений на Avito. В этом канале мы делимся успешными стратегиями, которые показали заметные результаты в изменении позиций объявлений на платформе.\n\n\n" +


                    "📊 Кейсы продвижения Яндекс (@e_top_keys)" +
                    "🔍 Кейсы по улучшению видимости и позиций в поиске Яндекс по конкретным запросам. Мы показываем, как наши стратегии помогают сайтам занимать топовые места в поисковой выдаче.\n\n\n" +


                    "🌟 Кейсы по отзывам (@e_otzyv_keys)" +
                    "🔍 Откройте для себя, как мы работаем с отзывами на различных платформах. Этот канал содержит подробные описания процессов, скриншоты и фотографии, демонстрирующие динамику размещения и влияние отзывов на репутацию." +
                    "   Каждый канал предоставляет уникальные и ценные ресурсы, помогающие вам лучше понять и использовать наши услуги для повышения эффективности вашего бизнеса. Присоединяйтесь к нам, чтобы получить доступ к эксклюзивным материалам и обновлениям.",
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "В личный кабинет", callback_data: "profile" }, { text: "В главное меню", callback_data: "start" }]
                            ]
                        }
                    });
                break;
            case "mypromo":
                await user.sendUserPromo(bot, chatId);
                break;
            case "addpromo":
                await user.addPromo(bot, chatId);
                break;
            case "replacepromo":
                await bot.sendMessage(chatId, "Новый промокод заменит текущий.", {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Заменить промокод", callback_data: "addpromo" }],
                            [{ text: "Отмена", callback_data: "profile" }]
                        ]
                    }
                });
                break;
            case "deletepromo":
                await user.deletePromo(bot, chatId);
                break;
            case "read":
                await user.setStatusReadUserMessage(chatId, callbackData[1]);
                break;
            case "offcriticalnotifications":
                await user.offCriticalNotifications(chatId);
            case "criticalnotifications":
                await user.sendUserCriticalNotifications(bot, chatId);
                break;
            case "paymenthistory":
                await user.sendUserPaymentHistory(bot, chatId);
                break;
            case "pfavito":
                await user.avitoPfQuesAndHandleBalance(bot, msg, chatId, amount.avitoPF, "Авито ПФ", msg.from.username);
                break;
            case "pfyandex":
                await user.yandexPfQuesAndHandleBalance(bot, msg, chatId, amount.yandexPF, "Яндекс ПФ", msg.from.username)
                break;
            case "yandexmap":
                await bot.sendMessage(chatId, "Отзывы для Яндекс карт 📍\n\n" +
                    "🔍 Отзывы оставляются от 3 до 14 дней с момента заказа.\n" +
                    "       Тексты для отзывов пишут наши исполнители по тематике\n" +
                    "       объявления. Вы не можете выбирать текст отзыва или пол\n" +
                    "       исполнителя.\n\n" +
                    "       • Преимущества: Повышение рейтинга на Яндекс\n" + "         картах, увеличение доверия клиентов.\n" +
                    "       • Процесс: Наши исполнители создают отзывы, которые\n" +
                    "       проходят модерацию. Вы получите уведомление о каждом\n" +
                    "       оставленном отзыве в виде скриншота.")
                await user.yandexPfQuesAndHandleBalance(bot, msg, chatId, amount.yandexPF, "Яндекс карты ПФ", msg.from.username);
                break;
            case "yandexservice":
                await bot.sendMessage(chatId, "Отзывы для Яндекс карт 📍\n\n" +
                    "🔍 Отзывы оставляются от 3 до 14 дней с момента заказа.\n" +
                    "       Тексты для отзывов пишут наши исполнители по тематике\n" +
                    "       объявления. Вы не можете выбирать текст отзыва или пол\n" +
                    "       исполнителя.\n\n" +
                    "       • Преимущества: Повышение рейтинга на Яндекс\n" + "         картах, увеличение доверия клиентов.\n" +
                    "       • Процесс: Наши исполнители создают отзывы, которые\n" +
                    "       проходят модерацию. Вы получите уведомление о каждом\n" +
                    "       оставленном отзыве в виде скриншота.")
                await user.yandexPfQuesAndHandleBalance(bot, msg, chatId, amount.yandexPF, "Яндекс Сервис ПФ", msg.from.username);
                break;
            case "sendMessageToUser":
                await manager.sendMessageToUser(bot, chatId);
                break;
            case "replyToUser":
                await manager.sendCriticalNotifications(bot, callbackData[1], chatId);
                break;
            case "replyToManager":
                await user.sendReply(bot, chatId, callbackData[1]);
                break;
            case "ordersav":
                await user.showOrders(bot, chatId, "ordersav", Number(callbackData[1]));
                break;
            case "ordersya":
                await user.showOrders(bot, chatId, "ordersya", Number(callbackData[1]));
                break;
            case "otsiv":
                await user.showOrders(bot, chatId, "otsiv", Number(callbackData[1]));
                break;
            case "addbalanceuser":
                await user.topUpBalance(bot, chatId, msg.from.id, msg.from.username);
                break;
            case "showorders":
                await user.showOrderCategories(bot, chatId);
                //await user.showOrders(bot, chatId);
                break;
            case "createref":
                await new Admin().createRefLink(bot, chatId);
                break;
            case "refstats":
                await new Admin().refStats(bot, chatId);
                break;
            case "viewbalance":
                await new Admin().viewUserBalance(bot, chatId);
                break;
            case "addbalanceadmin":
                await new Admin().addBalanceToUser(bot, chatId);
                break;
            case "userhistory":
                await new Admin().userTransactionHistory(bot, chatId);
                break;
            case "deleteuser":
                await new Admin().deleteUser(bot, chatId);
                break;
            case "changestatus":
                await new Admin().changeUserStatus(bot, chatId, msg);
                break;
            case "assignroles":
                await new Admin().changeUserRole(bot, chatId, msg);
                break;
            case "broadcast":
                await new Admin().sendMessageToEveryUser(bot, chatId);
                break;
            case "changeamount":
                await bot.sendMessage(chatId, "Выберите для чего хотите сменить сумму", amountsKeyboard);
                break;
            case "amountyandex_pf":
                await new Admin().changeAmountYandex(bot, chatId);
                break;
            case "amountavitopf":
                await new Admin().changeAmountAvito(bot, chatId);
                break;
            case "amountotiv":
                await new Admin().changeAmountOtisv(bot, chatId);
                break;
            case "showuserbalance":
                await user.sendUserBalance(bot, chatId)
                break
            case "orderagainavitopf":
                await user.avitoPfQuesAndHandleBalance(bot, msg, chatId, amount.avitoPF, "Авито пф", msg.message.from.username)
                break;
            case "startnewyandexpf":
                await user.yandexPfQuesAndHandleBalance(bot, msg, chatId, amount.yandexPF, "Яндекс пф", msg.from.username)
                break
            case "start":
                btns = [['nakrutkapf'], ['nakrutkaotsivov'], ['profile'], ['rules'], ['support'], ['faq']];
                reply_markup = await createKeyboard(btns, "Главное меню");
                await bot.sendMessage(chatId, `🌟 Добро пожаловать в E-Vito! 🌟\n\nМы рады приветствовать вас в нашем сервисе...`, {reply_markup});
                break
            case "manageravitopfqueueue":
                await manager.showAvitoPfQueueCount(bot, chatId);
                break
            case "managerachiveavitodate":
                await manager.showAvitoPfArchiveByDate(bot, chatId);
                break
            case "manageryandexpfqueue":
                await manager.showYandexPfQueueCount(bot, chatId);
                break
            case "managerarchiveyandexdate":
                await manager.showYandexPfArchiveByDate(bot, chatId);
                break
            case "managerordersqueue":
                await manager.showReviewsQueueCount(bot, chatId);
                break
            case "managerarchivedate":
                await manager.showReviewsArchiveByDate(bot, chatId);
                break
            case "avitootsiv":
                await user.otsivPfQuesAndHandleBalance(bot, chatId, amount.otsivAvito, "Авито", msg.from.username, "avitootsiv")
                break
            case "yamdexmapotisv":
                await user.otsivPfQuesAndHandleBalance(bot, chatId, amount.otisvYandexMap, "Яндекс карты", msg.message.from.username, "yamdexmapotisv")
                break
            case "yandexserviceotsiv":
                await user.otsivPfQuesAndHandleBalance(bot, chatId, amount.otisvYandexService, "Яндекс сервис", msg.from.username, "yandexserviceotsiv")
                break;
            case "twogisotsiv":
                await user.twoGis(bot, chatId, amount.twoGis, "2ГИС");
                break;
            case "youlaotsiv":
                await user.youla(bot, chatId, amount.youla, "Юла");
                break;
            case "otzovikotsiv":
                await user.otzovik(bot, chatId, amount.otzovik, "otzovik");
                break;
            
        }
        if (msg.data && msg.data.includes("accept") || msg.data.includes("reject")) {
            await manager.handleOrderAction(bot, chatId, msg);
        }
    }
    else{
        let btns = [['start']];
        let reply_markup = await createKeyboard(btns, 'Не доступная функция');
        await bot.sendMessage(chatId, "⚠️ Данный раздел больше не доступен. Пожалуйста, вернитесь на главную страницу", {reply_markup});
    }
});


bot.on('polling_error', console.log)
