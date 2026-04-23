import "@typespec/http";
import "@typespec/rest";

using TypeSpec.Http;
using TypeSpec.Rest;

@service({
  title: "Meeting Booking Calendar API"
})
@server("https://api.booking-calendar.example.com", "Production API")
@server("http://localhost:8000", "Development API")
namespace BookingCalendarAPI;

// ==========================================
// ОБЩИЕ МОДЕЛИ
// ==========================================

/** Уникальный идентификатор */
scalar UUID extends string;

/** Дата в формате ISO 8601 (YYYY-MM-DD) */
scalar Date extends string;

/** Дата и время в формате ISO 8601 с timezone */
scalar DateTime extends string;

/** Email адрес */
scalar Email extends string;

/** Hex цвет (например, #0066CC) */
scalar HexColor extends string;

/** Статус встречи */
enum MeetingStatus {
  pending,
  confirmed,
  cancelled,
  completed,
  no_show,
}

/** Статус слота */
enum SlotStatus {
  available,
  booked,
  blocked,
  tentative,
}

/** День недели (ISO 8601) */
enum DayOfWeek {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
}

/** Стандартная модель ошибки */
model ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

/** Пагинация */
model PaginationParams {
  @query
  @doc("Номер страницы (начиная с 1)")
  page?: int32 = 1;

  @query
  @doc("Количество элементов на странице")
  limit?: int32 = 20;
}

model PaginatedResponse<T> {
  data: T[];
  meta: {
    total: int32;
    page: int32;
    limit: int32;
    totalPages: int32;
  };
}

// ==========================================
// МОДЕЛИ ПОЛЬЗОВАТЕЛЕЙ
// ==========================================

/** Владелец календаря */
model Owner {
  @visibility("read")
  id: UUID;

  name: string;
  email: Email;

  @visibility("none")
  password: string;

  @visibility("read")
  timezone: string = "UTC";

  @visibility("read")
  createdAt: DateTime;

  @visibility("read")
  updatedAt: DateTime;
}

/** Данные для регистрации владельца */
model OwnerRegistration {
  name: string;
  email: Email;
  password: string;
}

/** Данные для входа */
model LoginRequest {
  email: Email;
  password: string;
}

/** Токен авторизации */
model AuthToken {
  token: string;
  type: "Bearer";
  expiresAt: DateTime;
}

/** Гость (без регистрации) */
model Guest {
  name: string;
  email: Email;
}

// ==========================================
// МОДЕЛИ КАЛЕНДАРЯ
// ==========================================

/** Календарь владельца (один на владельца) */
model Calendar {
  @visibility("read")
  id: UUID;

  ownerId: UUID;
  name: string = "My Calendar";
  timezone: string = "UTC";
  color: HexColor = "#0066CC";

  @visibility("read")
  isPublic: boolean = true;

  @visibility("read")
  minBookingNoticeMinutes: int32 = 60;

  @visibility("read")
  maxBookingDaysAhead: int32 = 14;

  @visibility("read")
  timeSlotInterval: int32 = 5;

  @visibility("read")
  createdAt: DateTime;

  @visibility("read")
  updatedAt: DateTime;
}

// ==========================================
// МОДЕЛИ ПРАВИЛ ДОСТУПНОСТИ
// ==========================================

/** Правило доступности (рабочее время по дням недели) */
model AvailabilityRule {
  @visibility("read")
  id: UUID;

  calendarId: UUID;

  @doc("День недели (1-7, где 1 - понедельник)")
  dayOfWeek: DayOfWeek;

  @doc("Время начала рабочего дня (HH:MM:SS)")
  workStart: string;

  @doc("Время окончания рабочего дня (HH:MM:SS)")
  workEnd: string;

  @doc("Длительность слота по умолчанию в минутах")
  slotDurationMinutes: int32 = 30;

  @doc("Перерывы в течение дня")
  breaks?: Break[];

  @doc("Приоритет правила (выше = важнее)")
  priority: int32 = 0;

  @visibility("read")
  isActive: boolean = true;

  @visibility("read")
  createdAt: DateTime;

  @visibility("read")
  updatedAt: DateTime;
}

model Break {
  start: string;
  end: string;
}

/** Создание/обновление правила доступности */
model AvailabilityRuleCreate {
  dayOfWeek: DayOfWeek;
  workStart: string;
  workEnd: string;
  slotDurationMinutes?: int32 = 30;
  breaks?: Break[];
  priority?: int32 = 0;
  isActive?: boolean = true;
}

/** Исключение из правил доступности */
model AvailabilityException {
  @visibility("read")
  id: UUID;

  calendarId: UUID;
  exceptionDate: Date;

  @doc("Тип исключения: недоступен или кастомное время")
  exceptionType: "unavailable" | "custom_hours";

  @doc("Новое рабочее время для кастомных часов")
  customWorkStart?: string;
  customWorkEnd?: string;
  customSlotDuration?: int32;

  reason?: string;

  @visibility("read")
  createdAt: DateTime;
}

model AvailabilityExceptionCreate {
  exceptionDate: Date;
  exceptionType: "unavailable" | "custom_hours";
  customWorkStart?: string;
  customWorkEnd?: string;
  customSlotDuration?: int32;
  reason?: string;
}

// ==========================================
// МОДЕЛИ ТИПОВ ВСТРЕЧ
// ==========================================

/** Тип встречи (шаблон) */
model MeetingType {
  @visibility("read")
  id: int32;

  calendarId: UUID;
  name: string;
  description?: string;
  durationMinutes: int32;
  color: HexColor = "#0066CC";
  isActive: boolean = true;

  @doc("Публичный путь для бронирования")
  bookingUrlPath?: string;

  @visibility("read")
  createdAt: DateTime;

  @visibility("read")
  updatedAt: DateTime;
}

model MeetingTypeCreate {
  name: string;
  description?: string;
  durationMinutes: int32;
  color?: HexColor = "#0066CC";
  isActive?: boolean = true;
}

model MeetingTypeUpdate {
  name?: string;
  description?: string;
  durationMinutes?: int32;
  color?: HexColor;
  isActive?: boolean;
}

/** Публичное представление типа встречи (для гостей) */
model MeetingTypePublicView {
  id: int32;
  name: string;
  description?: string;
  durationMinutes: int32;
  color: HexColor;
  bookingUrlPath: string;
}

// ==========================================
// МОДЕЛИ ВРЕМЕННЫХ СЛОТОВ
// ==========================================

/** Временной слот для бронирования */
model TimeSlot {
  @visibility("read")
  id: UUID;

  calendarId: UUID;
  slotDate: Date;
  slotStart: DateTime;
  slotEnd: DateTime;
  status: SlotStatus;

  @doc("ID встречи, если слот забронирован")
  meetingId?: UUID;

  @doc("Длительность слота в минутах")
  durationMinutes: int32;

  @doc("Является ли слот сгенерированным из правила")
  isGenerated: boolean;

  @visibility("read")
  createdAt: DateTime;
}

/** Параметры запроса слотов */
model TimeSlotQuery {
  @query
  @doc("Начальная дата (включительно)")
  from: Date;

  @query
  @doc("Конечная дата (включительно)")
  to: Date;

  @query
  @doc("Требуемая длительность в минутах")
  durationMinutes?: int32 = 30;

  @query
  @doc("Шаг временной сетки в минутах (по умолчанию 5)")
  intervalMinutes?: int32 = 5;

  @query
  @doc("ID типа встречи для фильтрации")
  meetingTypeId?: int32;
}

/** Группировка слотов по дате */
model TimeSlotsByDate {
  date: Date;
  slots: TimeSlot[];
}

// ==========================================
// МОДЕЛИ ВСТРЕЧ
// ==========================================

/** Встреча (бронирование) */
model Meeting {
  @visibility("read")
  id: UUID;

  calendarId: UUID;
  meetingTypeId: int32;
  organizerId: UUID;

  startTime: DateTime;
  endTime: DateTime;
  status: MeetingStatus;

  title: string;
  description?: string;

  @doc("Участники встречи")
  participants: MeetingParticipant[];

  @doc("Гость, создавший бронирование (первый участник)")
  guestName: string;
  guestEmail: Email;

  @visibility("read")
  createdAt: DateTime;

  @visibility("read")
  updatedAt: DateTime;

  @visibility("read")
  cancelledAt?: DateTime;

  cancellationReason?: string;
}

/** Участник встречи */
model MeetingParticipant {
  id: UUID;
  meetingId: UUID;
  name: string;
  email: Email;
  isOrganizer: boolean;
  status: "pending" | "confirmed" | "declined" | "tentative";
}

/** Создание бронирования (гостем) */
model MeetingCreate {
  calendarId: UUID;
  meetingTypeId: int32;
  startTime: DateTime;

  @doc("Гость указывает имя и почту (без регистрации)")
  guestName: string;
  guestEmail: Email;

  notes?: string;
}

/** Обновление встречи (только для владельца) */
model MeetingUpdate {
  startTime?: DateTime;
  endTime?: DateTime;
  status?: MeetingStatus;
  title?: string;
  description?: string;
  cancellationReason?: string;
}

/** Публичное представление встречи для списка */
model MeetingListItem {
  id: UUID;
  meetingTypeId: int32;
  meetingTypeName: string;
  startTime: DateTime;
  endTime: DateTime;
  status: MeetingStatus;
  guestName: string;
  guestEmail: Email;
  durationMinutes: int32;
}

/** Параметры запроса списка встреч */
model MeetingQuery extends PaginationParams {
  @query
  @doc("Фильтр по статусу")
  status?: MeetingStatus;

  @query
  @doc("Встречи от этой даты")
  fromDate?: Date;

  @query
  @doc("Встречи до этой даты")
  toDate?: Date;

  @query
  @doc("Сортировка: asc (ближайшие) или desc (далекие)")
  sort?: "asc" | "desc" = "asc";
}

// ==========================================
// ЭНДПОИНТЫ АВТОРИЗАЦИИ
// ==========================================

@route("/auth")
@tag("Authentication")
interface AuthController {
  @post
  @route("/register")
  @doc("Регистрация владельца календаря")
  register(@body body: OwnerRegistration): Owner | ErrorResponse;

  @post
  @route("/login")
  @doc("Вход в систему (только для владельца)")
  login(@body body: LoginRequest): AuthToken | ErrorResponse;

  @post
  @route("/logout")
  @doc("Выход из системы")
  @useAuth(BearerAuth)
  logout(): { message: string };
}

// ==========================================
// ЭНДПОИНТЫ ВЛАДЕЛЬЦА
// ==========================================

@route("/owner")
@tag("Owner")
@useAuth(BearerAuth)
interface OwnerController {
  @get
  @route("/profile")
  @doc("Получить профиль владельца")
  getProfile(): Owner | ErrorResponse;

  @put
  @route("/profile")
  @doc("Обновить профиль владельца")
  updateProfile(@body body: {
    name?: string;
    email?: Email;
    timezone?: string;
  }): Owner | ErrorResponse;

  @put
  @route("/password")
  @doc("Сменить пароль")
  changePassword(@body body: {
    oldPassword: string;
    newPassword: string;
  }): { message: string } | ErrorResponse;
}

// ==========================================
// ЭНДПОИНТЫ КАЛЕНДАРЯ
// ==========================================

@route("/calendars")
@tag("Calendar")
interface CalendarController {
  @get
  @route("/my")
  @doc("Получить календарь текущего владельца (единственный)")
  @useAuth(BearerAuth)
  getMyCalendar(): Calendar | ErrorResponse;

  @put
  @route("/my")
  @doc("Обновить настройки календаря")
  @useAuth(BearerAuth)
  updateMyCalendar(@body body: {
    name?: string;
    timezone?: string;
    color?: HexColor;
    minBookingNoticeMinutes?: int32;
    maxBookingDaysAhead?: int32;
  }): Calendar | ErrorResponse;
}

// ==========================================
// ЭНДПОИНТЫ ТИПОВ ВСТРЕЧ
// ==========================================

@route("/meeting-types")
@tag("Meeting Types")
interface MeetingTypeController {
  // === Для владельца ===

  @get
  @doc("Получить все типы встреч календаря (владелец)")
  @useAuth(BearerAuth)
  list(@query calendarId: UUID): MeetingType[] | ErrorResponse;

  @post
  @doc("Создать тип встречи (владелец)")
  @useAuth(BearerAuth)
  create(@body body: MeetingTypeCreate): MeetingType | ErrorResponse;

  @get
  @route("/{id}")
  @doc("Получить тип встречи по ID (владелец)")
  @useAuth(BearerAuth)
  get(@path id: int32): MeetingType | ErrorResponse;

  @put
  @route("/{id}")
  @doc("Обновить тип встречи (владелец)")
  @useAuth(BearerAuth)
  update(@path id: int32, @body body: MeetingTypeUpdate): MeetingType | ErrorResponse;

  @delete
  @route("/{id}")
  @doc("Удалить тип встречи (владелец)")
  @useAuth(BearerAuth)
  delete(@path id: int32): { message: string } | ErrorResponse;

  // === Для гостей ===

  @get
  @route("/public/{calendarId}")
  @doc("Получить публичный список типов встреч (гость)")
  listPublic(@path calendarId: UUID): MeetingTypePublicView[];
}

// ==========================================
// ЭНДПОИНТЫ ПРАВИЛ ДОСТУПНОСТИ
// ==========================================

@route("/availability")
@tag("Availability")
@useAuth(BearerAuth)
interface AvailabilityController {
  @get
  @route("/rules")
  @doc("Получить правила доступности календаря")
  getRules(@query calendarId: UUID): AvailabilityRule[] | ErrorResponse;

  @post
  @route("/rules")
  @doc("Создать правило доступности")
  createRule(@body body: AvailabilityRuleCreate): AvailabilityRule | ErrorResponse;

  @put
  @route("/rules/{id}")
  @doc("Обновить правило доступности")
  updateRule(@path id: UUID, @body body: AvailabilityRuleCreate): AvailabilityRule | ErrorResponse;

  @delete
  @route("/rules/{id}")
  @doc("Удалить правило доступности")
  deleteRule(@path id: UUID): { message: string } | ErrorResponse;

  @get
  @route("/exceptions")
  @doc("Получить исключения доступности")
  getExceptions(
    @query calendarId: UUID,
    @query from?: Date,
    @query to?: Date
  ): AvailabilityException[] | ErrorResponse;

  @post
  @route("/exceptions")
  @doc("Создать исключение доступности (например, отпуск)")
  createException(@body body: AvailabilityExceptionCreate): AvailabilityException | ErrorResponse;

  @delete
  @route("/exceptions/{id}")
  @doc("Удалить исключение доступности")
  deleteException(@path id: UUID): { message: string } | ErrorResponse;
}

// ==========================================
// ЭНДПОИНТЫ СЛОТОВ (ЧТЕНИЕ)
// ==========================================

@route("/slots")
@tag("Time Slots")
interface TimeSlotController {
  @get
  @route("/available/{calendarId}")
  @doc("Получить доступные слоты для бронирования (гость)")
  getAvailable(
    @path calendarId: UUID,
    ...TimeSlotQuery
  ): TimeSlotsByDate[] | ErrorResponse;

  @get
  @route("/calendar/{calendarId}")
  @doc("Получить все слоты календаря (владелец)")
  @useAuth(BearerAuth)
  getAll(
    @path calendarId: UUID,
    @query from: Date,
    @query to: Date
  ): TimeSlot[] | ErrorResponse;
}

// ==========================================
// ЭНДПОИНТЫ ВСТРЕЧ (БРОНИРОВАНИЕ)
// ==========================================

@route("/meetings")
@tag("Meetings")
interface MeetingController {
  // === Для владельца ===

  @get
  @doc("Получить список встреч календаря (владелец)")
  @useAuth(BearerAuth)
  list(...MeetingQuery): PaginatedResponse<MeetingListItem> | ErrorResponse;

  @get
  @route("/{id}")
  @doc("Получить детали встречи (владелец)")
  @useAuth(BearerAuth)
  get(@path id: UUID): Meeting | ErrorResponse;

  @put
  @route("/{id}")
  @doc("Обновить встречу (владелец)")
  @useAuth(BearerAuth)
  update(@path id: UUID, @body body: MeetingUpdate): Meeting | ErrorResponse;

  @delete
  @route("/{id}")
  @doc("Отменить встречу (владелец)")
  @useAuth(BearerAuth)
  cancel(
    @path id: UUID,
    @query reason?: string
  ): { message: string } | ErrorResponse;

  // === Для гостей ===

  @post
  @route("/book")
  @doc("Создать бронирование (гость, без авторизации)")
  book(@body body: MeetingCreate): Meeting | ErrorResponse;

  @get
  @route("/confirmation/{id}")
  @doc("Получить подтверждение бронирования по ID (гость)")
  getConfirmation(@path id: UUID): {
    meeting: Meeting;
    meetingType: MeetingTypePublicView;
  } | ErrorResponse;
}

// ==========================================
// ОШИБКИ
// ==========================================

@error
model SlotAlreadyBookedError extends ErrorResponse {
  error: {
    code: "SLOT_ALREADY_BOOKED";
    message: "This time slot is no longer available";
    suggestedAlternatives?: TimeSlot[];
  };
}

@error
model BookingTooSoonError extends ErrorResponse {
  error: {
    code: "BOOKING_TOO_SOON";
    message: "Booking violates minimum notice requirement";
    minNoticeMinutes: int32;
  };
}

@error
model BookingTooFarError extends ErrorResponse {
  error: {
    code: "BOOKING_TOO_FAR";
    message: "Booking is too far in the future";
    maxDaysAhead: int32;
  };
}

@error
model OutsideWorkingHoursError extends ErrorResponse {
  error: {
    code: "OUTSIDE_WORKING_HOURS";
    message: "Selected time is outside working hours";
    workHours: {
      start: string;
      end: string;
    };
  };
}

@error
model ConflictDetectedError extends ErrorResponse {
  error: {
    code: "CONFLICT_DETECTED";
    message: "This time conflicts with an existing booking";
    conflictingMeeting: {
      id: UUID;
      startTime: DateTime;
      endTime: DateTime;
    };
  };
}
