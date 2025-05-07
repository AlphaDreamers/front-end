import Database, { Database as BetterSqlite3Database } from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

let dbInstance: BetterSqlite3Database | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE countries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL CHECK(length(name) BETWEEN 3 AND 50),
      surname TEXT NOT NULL CHECK(length(surname) BETWEEN 3 AND 50),
      country_id TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL CHECK(length(password) >= 8),
      verified BOOLEAN NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      wallet_created BOOLEAN NOT NULL DEFAULT 0,
      wallet_created_at TIMESTAMP DEFAULT NULL,
      avatar TEXT DEFAULT NULL,
      username TEXT UNIQUE NOT NULL CHECK(length(username) BETWEEN 3 AND 20),
      FOREIGN KEY (country_id) REFERENCES countries(id)
    );

    CREATE TABLE orders (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL CHECK(length(title) BETWEEN 3 AND 100),
      price REAL NOT NULL CHECK(price > 0),
      status TEXT NOT NULL CHECK(status IN ('pending', 'completed', 'in-progress', 'awaiting-payment', 'pending-delivery')),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      buyer_id TEXT NOT NULL,
      seller_id TEXT NOT NULL,
      deadline TIMESTAMP DEFAULT NULL,
      FOREIGN KEY (buyer_id) REFERENCES users(id),
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    CREATE TABLE chats (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      order_id TEXT NOT NULL,
      buyer_id TEXT NOT NULL,
      seller_id TEXT NOT NULL,
      last_message_id TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (buyer_id) REFERENCES users(id),
      FOREIGN KEY (seller_id) REFERENCES users(id),
      FOREIGN KEY (last_message_id) REFERENCES messages(id)
    );

    CREATE TABLE messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      text TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      is_read BOOLEAN NOT NULL DEFAULT 0,
      FOREIGN KEY (chat_id) REFERENCES chats(id),
      FOREIGN KEY (sender_id) REFERENCES users(id)
    );
  `);

  const countryIds = [];
  for (const name of [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "Poland",
    "Japan",
    "India",
    "Brazil",
  ]) {
    const id = uuidv4();
    countryIds.push(id);
    db.prepare("INSERT INTO countries (id, name) VALUES (?, ?)").run(id, name);
  }

  const users: { id: string }[] = [];
  for (let i = 0; i < 200; i++) {
    const id = uuidv4();
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const countryId = faker.helpers.arrayElement(countryIds);
    const email = faker.internet.email({ firstName: name, lastName: surname });
    const username = faker.internet
      .username({ firstName: name, lastName: surname })
      .slice(0, 20);
    const password = faker.internet.password({ length: 10 });
    const verified = faker.datatype.boolean() ? 1 : 0;
    const wallet_created = faker.datatype.boolean() ? 1 : 0;
    const avatar = `https://picsum.photos/seed/${id}/200/200`;

    db.prepare(
      `INSERT INTO users (id, name, surname, country_id, email, password, verified, wallet_created, avatar, username)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      name,
      surname,
      countryId,
      email,
      password,
      verified,
      wallet_created,
      avatar,
      username
    );

    users.push({ id });
  }

  const orderIds: { id: string; buyer: string; seller: string }[] = [];
  for (let i = 0; i < 100; i++) {
    const id = uuidv4();
    const buyer = faker.helpers.arrayElement(users).id;
    let seller = faker.helpers.arrayElement(users).id;
    while (seller === buyer) seller = faker.helpers.arrayElement(users).id;
    const title = faker.commerce.productName().slice(0, 100);
    const price = parseFloat(faker.commerce.price());
    const status = faker.helpers.arrayElement([
      "pending",
      "completed",
      "in-progress",
      "awaiting-payment",
      "pending-delivery",
    ]);
    const deadline = faker.date
      .future({
        years: 1,
        refDate: new Date(),
      })
      .toISOString();

    db.prepare(
      `INSERT INTO orders (id, title, price, status, deadline, buyer_id, seller_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, title, price, status, deadline, buyer, seller);
    orderIds.push({ id, buyer, seller });
  }

  const chatIds: string[] = [];
  for (const { id: orderId, buyer, seller } of orderIds) {
    const chatId = uuidv4();
    db.prepare(
      `INSERT INTO chats (id, order_id, buyer_id, seller_id)
       VALUES (?, ?, ?, ?)`
    ).run(chatId, orderId, buyer, seller);
    chatIds.push(chatId);
  }

  for (const chatId of chatIds) {
    const msgCount = faker.number.int({ min: 5, max: 20 });
    let lastId: string | null = null;
    for (let j = 0; j < msgCount; j++) {
      const id = uuidv4();
      const sender = faker.helpers.arrayElement(users).id;
      const text = faker.lorem.sentences(faker.number.int({ min: 1, max: 3 }));
      const is_read = faker.datatype.boolean() ? 1 : 0;

      db.prepare(
        `INSERT INTO messages (id, chat_id, text, sender_id, is_read)
         VALUES (?, ?, ?, ?, ?)`
      ).run(id, chatId, text, sender, is_read);
      lastId = id;
    }
    if (lastId) {
      db.prepare(`UPDATE chats SET last_message_id = ? WHERE id = ?`).run(
        lastId,
        chatId
      );
    }
  }

  dbInstance = db;
  return db;
}

export function queryAll(sql: string, params: any[] = []) {
  return getDb().prepare(sql).all(params);
}

export function queryGet(sql: string, params: any[] = []) {
  return getDb().prepare(sql).get(params);
}

export function execute(sql: string, params: any[] = []) {
  return getDb().prepare(sql).run(params);
}
