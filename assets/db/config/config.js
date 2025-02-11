import { pool } from "./connect.js";

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        chatId BIGINT,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        username VARCHAR(255),
        \`from\` VARCHAR(255),
        balance BIGINT,
        status VARCHAR(255),
        role VARCHAR(255),
        sale BIGINT
    )
`;

const createOrdersTableYA = `
    CREATE TABLE IF NOT EXISTS orders_ya (
        orderId INT AUTO_INCREMENT PRIMARY KEY,
        userId BIGINT,
        orderDetails TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
`;

const createOrdersTableAV = `
    CREATE TABLE IF NOT EXISTS orders_av (
        orderId INT AUTO_INCREMENT PRIMARY KEY,
        userId BIGINT,
        orderDetails TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
`;

const createFeedbackTable = `
    CREATE TABLE IF NOT EXISTS feedback (
        feedbackId INT AUTO_INCREMENT PRIMARY KEY,
        userId BIGINT,
        feedbackDetails TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
`;

const createPaymentTable = `
    CREATE TABLE IF NOT EXISTS payment (
        paymentId BIGINT AUTO_INCREMENT PRIMARY KEY,
        userId BIGINT,
        paymentDate DATETIME,
        amount INT,
        paymentMethod TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
`;

const createRefTable = `
    CREATE TABLE IF NOT EXISTS ref (
        fromId BIGINT PRIMARY KEY,
        originalLink TEXT,
        amountClicks INT,
        amountComments INT,
        FOREIGN KEY (fromId) REFERENCES users(id) ON DELETE CASCADE
    )
`;

const createUserMessageTable = `
CREATE TABLE user_messages (
	    id INT AUTO_INCREMENT PRIMARY KEY,
	    user_id BIGINT,
	    message TEXT,
	    media_type VARCHAR(50),
	    media_path TEXT,
	    buttons JSON,
	    status ENUM('pending', 'delivered', 'failed', 'blocked') DEFAULT 'pending',
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	    sent_at TIMESTAMP NULL
	)
`;

const createCriticalNotifications = `
CREATE TABLE critical_notifications (
	    id INT AUTO_INCREMENT PRIMARY KEY,
	    user_id BIGINT,
	    message TEXT,
	    status ENUM('unread', 'read') DEFAULT 'unread',
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
	)
`;

const createMailings = `
CREATE TABLE mass_mailings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT,
    media_type VARCHAR(50), -- Тип мультимедиа: "text", "image", "video", "buttons"
    media_path TEXT,
    buttons JSON,
    schedule_time TIMESTAMP,
    status ENUM('pending', 'in_progress', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

const createMailingLogs = `
CREATE TABLE mass_mailing_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mailing_id INT,
    user_id BIGINT,
    status ENUM('delivered', 'failed', 'blocked') DEFAULT 'delivered',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const userReplies = `CREATE TABLE user_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT, 
    notification_id INT,
	reply TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createMessageLogs = `CREATE TABLE message_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    message_id INT,
    status ENUM('delivered', 'failed', 'blocked') DEFAULT 'delivered', 
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const promocodes = `CREATE TABLE promocodes (
    promoId INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount DECIMAL(10,2) NOT NULL,
    categories VARCHAR(255) NOT NULL,
    usageLimit INT DEFAULT NULL,
    usageCount INT DEFAULT 0,
    expirationDate DATE DEFAULT NULL,
    isActive TINYINT DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

const executeQuery = (query, message) => {
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log(message);
        }
    });
};

// Выполнение запросов на создание таблиц
executeQuery(createUsersTable, "Таблица пользователей создана");
executeQuery(createOrdersTableYA, "Таблица заказов (YA) создана");
executeQuery(createOrdersTableAV, "Таблица заказов (AV) создана");
executeQuery(createFeedbackTable, "Таблица отзывов создана");
executeQuery(createPaymentTable, "Таблица платежей создана");
executeQuery(createRefTable, "Таблица реферальных ссылок создана");
executeQuery(createUserMessageTable, "Таблица сообщений для юзеров создана");
executeQuery(createCriticalNotifications, "Таблица критических уведомлений создана");
executeQuery(createMailings, "Таблица рассылки создана");
executeQuery(createMailingLogs, "Таблица логирования рассылки создана");
executeQuery(userReplies, "Таблица ответов юзеров создана");
executeQuery(createMessageLogs, "Таблица логов отправок сообщения юзерам создана");
executeQuery(promocodes, "Таблица промокодов создана");
