# TypeSpec API Schema - Meeting Booking Calendar

## Обзор

Этот документ описывает API схему сервиса бронирования встреч, разработанную с использованием [TypeSpec](https://typespec.io/). Схема определяет REST API на основе гибридной архитектуры, описанной в проектной документации.

## Структура файла

Файл `api_schema.tsp` содержит:
- Общие модели и типы
- Модели для пользователей (владелец, гость)
- Модели календаря и правил доступности
- Модели типов встреч и временных слотов
- Модели встреч (бронирований)
- Эндпоинты для всех контроллеров
- Определения ошибок

## Основные концепции

### 1. Гибридная архитектура

API реализует гибридный подход к хранению данных:
- **Встречи (Meetings)** — источник истины (source of truth)
- **Слоты (TimeSlots)** — материализованное представление для быстрого чтения
- **Правила доступности (AvailabilityRules)** — декларативное описание рабочего времени

### 2. Роли пользователей

#### Владелец календаря
- Один заранее заданный профиль
- Имеет единственный календарь
- Управляет типами встреч и правилами доступности
- Может просматривать и отменять все бронирования

#### Гость
- Без регистрации и авторизации
- Видит публичные типы встреч
- Бронирует слоты, указывая имя и email
- Не может удалять бронирования

### 3. Особенности бронирования

#### Временная сетка
- **Шаг сетки**: 5 минут (минимальная единица времени)
- **Отображение**: окна по 30 минут
- **Гибкость**: можно начать встречу в любое время, кратное 5 минутам
- **Длительность**: фиксированная (15 или 30 минут по типу встречи)

#### Ограничения
- Окно бронирования: ближайшие 14 дней
- Минимальное время до бронирования: 60 минут
- На одно время нельзя две записи (даже разные типы)

## API Endpoints

### 1. Аутентификация (`/auth`)

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| POST | `/auth/register` | Регистрация владельца | Нет |
| POST | `/auth/login` | Вход в систему | Нет |
| POST | `/auth/logout` | Выход из системы | Bearer |

### 2. Владелец (`/owner`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/owner/profile` | Получить профиль |
| PUT | `/owner/profile` | Обновить профиль |
| PUT | `/owner/password` | Сменить пароль |

### 3. Календарь (`/calendars`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/calendars/my` | Получить мой календарь |
| PUT | `/calendars/my` | Обновить настройки календаря |

### 4. Типы встреч (`/meeting-types`)

#### Для владельца (требует авторизации)
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/meeting-types` | Список всех типов |
| POST | `/meeting-types` | Создать тип |
| GET | `/meeting-types/{id}` | Получить тип по ID |
| PUT | `/meeting-types/{id}` | Обновить тип |
| DELETE | `/meeting-types/{id}` | Удалить тип |

#### Для гостей (публичный доступ)
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/meeting-types/public/{calendarId}` | Публичный список типов |

### 5. Доступность (`/availability`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/availability/rules` | Получить правила |
| POST | `/availability/rules` | Создать правило |
| PUT | `/availability/rules/{id}` | Обновить правило |
| DELETE | `/availability/rules/{id}` | Удалить правило |
| GET | `/availability/exceptions` | Получить исключения |
| POST | `/availability/exceptions` | Создать исключение |
| DELETE | `/availability/exceptions/{id}` | Удалить исключение |

### 6. Слоты (`/slots`)

| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| GET | `/slots/available/{calendarId}` | Доступные слоты | Нет |
| GET | `/slots/calendar/{calendarId}` | Все слоты | Bearer |

**Параметры запроса доступных слотов:**
- `from` (обязательный): начальная дата (YYYY-MM-DD)
- `to` (обязательный): конечная дата (YYYY-MM-DD)
- `durationMinutes`: требуемая длительность (по умолчанию 30)
- `intervalMinutes`: шаг сетки в минутах (по умолчанию 5)
- `meetingTypeId`: ID типа встречи для фильтрации

### 7. Встречи (`/meetings`)

#### Для владельца (требует авторизации)
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/meetings` | Список встреч (с пагинацией) |
| GET | `/meetings/{id}` | Детали встречи |
| PUT | `/meetings/{id}` | Обновить встречу |
| DELETE | `/meetings/{id}` | Отменить встречу |

#### Для гостей (публичный доступ)
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/meetings/book` | Создать бронирование |
| GET | `/meetings/confirmation/{id}` | Подтверждение бронирования |

**Параметры списка встреч:**
- `page`: номер страницы (начиная с 1)
- `limit`: количество на странице
- `status`: фильтр по статусу
- `fromDate`: встречи от даты
- `toDate`: встречи до даты
- `sort`: сортировка (`asc` - ближайшие, `desc` - далекие)

## Модели данных

### Owner (Владелец)
```
id: UUID
name: string
email: Email
password: string (только запись)
timezone: string
createdAt: DateTime
updatedAt: DateTime
```

### Calendar (Календарь)
```
id: UUID
ownerId: UUID
name: string
timezone: string
color: HexColor
isPublic: boolean
minBookingNoticeMinutes: int32 (default: 60)
maxBookingDaysAhead: int32 (default: 14)
timeSlotInterval: int32 (default: 5)
createdAt: DateTime
updatedAt: DateTime
```

### MeetingType (Тип встречи)
```
id: int32
calendarId: UUID
name: string
description?: string
durationMinutes: int32 (15 или 30)
color: HexColor
isActive: boolean
bookingUrlPath?: string
createdAt: DateTime
updatedAt: DateTime
```

### AvailabilityRule (Правило доступности)
```
id: UUID
calendarId: UUID
dayOfWeek: DayOfWeek (1-7)
workStart: string (HH:MM:SS)
workEnd: string (HH:MM:SS)
slotDurationMinutes: int32
breaks?: Break[]
priority: int32
isActive: boolean
createdAt: DateTime
updatedAt: DateTime
```

### TimeSlot (Временной слот)
```
id: UUID
calendarId: UUID
slotDate: Date
slotStart: DateTime
slotEnd: DateTime
status: SlotStatus
meetingId?: UUID
durationMinutes: int32
isGenerated: boolean
createdAt: DateTime
```

### Meeting (Встреча)
```
id: UUID
calendarId: UUID
meetingTypeId: int32
organizerId: UUID
startTime: DateTime
endTime: DateTime
status: MeetingStatus
title: string
description?: string
participants: MeetingParticipant[]
guestName: string
guestEmail: Email
createdAt: DateTime
updatedAt: DateTime
cancelledAt?: DateTime
cancellationReason?: string
```

## Ошибки

### SlotAlreadyBookedError (409)
```json
{
  "error": {
    "code": "SLOT_ALREADY_BOOKED",
    "message": "This time slot is no longer available",
    "suggestedAlternatives": [...]
  }
}
```

### BookingTooSoonError (400)
```json
{
  "error": {
    "code": "BOOKING_TOO_SOON",
    "message": "Booking violates minimum notice requirement",
    "minNoticeMinutes": 60
  }
}
```

### BookingTooFarError (400)
```json
{
  "error": {
    "code": "BOOKING_TOO_FAR",
    "message": "Booking is too far in the future",
    "maxDaysAhead": 14
  }
}
```

### OutsideWorkingHoursError (400)
```json
{
  "error": {
    "code": "OUTSIDE_WORKING_HOURS",
    "message": "Selected time is outside working hours",
    "workHours": {
      "start": "09:00",
      "end": "18:00"
    }
  }
}
```

### ConflictDetectedError (409)
```json
{
  "error": {
    "code": "CONFLICT_DETECTED",
    "message": "This time conflicts with an existing booking",
    "conflictingMeeting": {
      "id": "...",
      "startTime": "...",
      "endTime": "..."
    }
  }
}
```

## Сценарии использования

### 1. Гость бронирует встречу

1. `GET /meeting-types/public/{calendarId}` — получить доступные типы
2. `GET /slots/available/{calendarId}?from=2026-05-01&to=2026-05-14&durationMinutes=30` — получить слоты
3. `POST /meetings/book` — создать бронирование
4. `GET /meetings/confirmation/{id}` — получить подтверждение

### 2. Владелец просматривает встречи

1. `POST /auth/login` — авторизация
2. `GET /calendars/my` — получить свой календарь
3. `GET /meetings?sort=asc&page=1&limit=20` — список встреч (от ближайших)

### 3. Владелец настраивает доступность

1. `POST /availability/rules` — создать правила на каждый день недели
2. `POST /availability/exceptions` — добавить исключение (например, отпуск)
3. Система автоматически перегенерирует слоты

## Особенности реализации

### Безопасность
- Bearer token авторизация для владельца
- Гости не требуют авторизации
- Валидация email при бронировании

### Производительность
- Слоты материализованы в БД для быстрого чтения
- Пагинация для списка встреч
- Кэширование правил доступности

### Валидация
- Проверка пересечений при бронировании
- Валидация рабочих часов
- Проверка временных ограничений (min notice, max advance)

## Генерация клиентов

TypeSpec позволяет генерировать клиентский код:

```bash
# TypeScript клиент
npm install @typespec/compiler @typespec/http @typespec/rest @typespec/openapi3

# Генерация OpenAPI
npx tsp compile api_schema.tsp --emit @typespec/openapi3

# Генерация клиента из OpenAPI
npx openapi-generator-cli generate -i openapi.json -g typescript-fetch -o ./client
```

## Расширение схемы

Для добавления новых функций:
1. Определите модели данных
2. Создайте эндпоинты
3. Добавьте обработку ошибок
4. Обновите документацию

Пример добавления напоминаний:
```typescript
model Reminder {
  id: UUID;
  meetingId: UUID;
  sendBeforeMinutes: int32;
  isSent: boolean;
  sentAt?: DateTime;
}
```
