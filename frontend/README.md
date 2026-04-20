# Frontend Svelte Application

Этот шаблон должен помочь вам начать разработку с Svelte 5 и Vite в горячем режиме перезагрузки (HMR), а также некоторыми правилами ESLint.

## Требования

- Node.js 18.0 или выше
- npm 9.0 или выше

## Установка

```bash
cd frontend
npm install
```

## Разработка

Запуск сервера разработки:

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

## Сборка

Сборка для продакшена:

```bash
npm run build
```

Превью собранного приложения:

```bash
npm run preview
```

## Docker

### Сборка Docker образа

```bash
docker build -t frontend-app .
```

### Запуск контейнера

```bash
docker run -d -p 8080:80 --name frontend frontend-app
```

Приложение будет доступно по адресу: `http://localhost:8080`

### Docker Compose (рекомендуется)

```bash
docker-compose up -d
```

## Структура проекта

```
frontend/
├── Dockerfile            # Многоэтапная сборка (Node 20 + Nginx)
├── nginx.conf            # Конфигурация Nginx для SPA
├── docker-compose.yml    # Docker Compose конфигурация
├── index.html            # HTML entry point
├── package.json          # Зависимости и скрипты
├── vite.config.js        # Конфигурация Vite
├── public/               # Статические файлы
│   └── vite.svg
└── src/
    ├── main.js           # Entry point JavaScript
    ├── App.svelte        # Корневой компонент
    ├── app.css           # Глобальные стили
    ├── assets/           # Ассеты
    │   └── svelte.svg
    └── lib/              # Библиотеки/компоненты
        └── Counter.svelte
```

## Технологии

- **Svelte 5** — Компилируемый фреймворк UI
- **Vite 6** — Сборщик с мгновенным HMR
- **Svelte Runes** — Реактивность через `$state()`, `$derived()`, `$effect()`
- **Node.js 20** — LTS версия для production
- **Nginx** — Веб-сервер для раздачи статики

## Дополнительная информация

- [Svelte Documentation](https://svelte.dev/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Node.js 20 Release Notes](https://nodejs.org/en/blog/release/v20.0.0)
