//  npm install mocha --save-dev
// npm install chai  --save-dev
// npm install sinon --save-dev

import { expect } from "chai";
import sinon from "sinon";
import { fetchUsers } from "../src/users.js";

describe("fetchUsers", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  // Тест проверяет успешное получение и вывод данных пользователей
  it("должна получать и выводить имена пользователей", async () => {
    // Создаём тестовые данные - массив с двумя пользователями
    const testUsers = [
      { id: 1, name: "Nataly" },
      { id: 2, name: "Sergey" },
    ];

    // эмуляция сервера
    global.fetch = sandbox.stub().resolves({
      ok: true,
      json: async () => testUsers,
    });

    // шпион для console.log
    const consoleLogSpy = sandbox.spy(console, "log");

    // Вызываем тестируемую функцию
    await fetchUsers();

    // Проверяем, что fetch был вызван ровно один раз
    expect(global.fetch.calledOnce).to.be.true;

    // Проверяем, что fetch был вызван с правильным URL
    expect(
      global.fetch.calledWith("https://jsonplaceholder.typicode.com/users")
    ).to.be.true;

    // Проверяем, что console.log был вызван с именем первого пользователя
    expect(consoleLogSpy.calledWith("Nataly")).to.be.true;

    // Проверяем, что console.log был вызван с именем второго пользователя
    expect(consoleLogSpy.calledWith("Sergey")).to.be.true;
  });

  // Тест проверяет обработку ошибок при неудачном запросе
  it("должна обрабатывать ошибки при неудачном запросе", async () => {
    // заглушка для неудачного запроса
    global.fetch = sandbox.stub().resolves({
      ok: false,
      status: 404,
    });

    // Оборачиваем вызов в try-catch для проверки выброса ошибки
    try {
      // Вызываем тестируемую функцию
      await fetchUsers();
      // Если ошибка не была выброшена, проваливаем тест
      expect.fail("Функция должна была выбросить ошибку");
    } catch (error) {
      // Проверяем, что сообщение об ошибке содержит правильный статус
      expect(error.message).to.include("HTTP error! status: 404");
    }
  });
});
