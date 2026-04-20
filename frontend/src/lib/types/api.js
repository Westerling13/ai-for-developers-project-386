/**
 * API Types based on OpenAPI specification
 * @typedef {Object} Owner
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} timezone
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} OwnerRegistration
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} AuthToken
 * @property {string} token
 * @property {string} type
 * @property {string} expiresAt
 */

/**
 * @typedef {Object} Calendar
 * @property {string} id
 * @property {string} ownerId
 * @property {string} name
 * @property {string} timezone
 * @property {string} color
 * @property {boolean} isPublic
 * @property {number} minBookingNoticeMinutes
 * @property {number} maxBookingDaysAhead
 * @property {number} timeSlotInterval
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} MeetingType
 * @property {number} id
 * @property {string} calendarId
 * @property {string} name
 * @property {string} [description]
 * @property {number} durationMinutes
 * @property {string} color
 * @property {boolean} isActive
 * @property {string} [bookingUrlPath]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} MeetingTypeCreate
 * @property {string} name
 * @property {string} [description]
 * @property {number} durationMinutes
 * @property {string} [color]
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} MeetingTypePublicView
 * @property {number} id
 * @property {string} name
 * @property {string} [description]
 * @property {number} durationMinutes
 * @property {string} color
 * @property {string} bookingUrlPath
 */

/**
 * @typedef {Object} AvailabilityRule
 * @property {string} id
 * @property {string} calendarId
 * @property {number} dayOfWeek
 * @property {string} workStart
 * @property {string} workEnd
 * @property {number} slotDurationMinutes
 * @property {Break[]} [breaks]
 * @property {number} priority
 * @property {boolean} isActive
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Break
 * @property {string} start
 * @property {string} end
 */

/**
 * @typedef {Object} AvailabilityRuleCreate
 * @property {number} dayOfWeek
 * @property {string} workStart
 * @property {string} workEnd
 * @property {number} [slotDurationMinutes]
 * @property {Break[]} [breaks]
 * @property {number} [priority]
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} AvailabilityException
 * @property {string} id
 * @property {string} calendarId
 * @property {string} exceptionDate
 * @property {string} exceptionType
 * @property {string} [customWorkStart]
 * @property {string} [customWorkEnd]
 * @property {number} [customSlotDuration]
 * @property {string} [reason]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} AvailabilityExceptionCreate
 * @property {string} exceptionDate
 * @property {string} exceptionType
 * @property {string} [customWorkStart]
 * @property {string} [customWorkEnd]
 * @property {number} [customSlotDuration]
 * @property {string} [reason]
 */

/**
 * @typedef {Object} TimeSlot
 * @property {string} id
 * @property {string} calendarId
 * @property {string} slotDate
 * @property {string} slotStart
 * @property {string} slotEnd
 * @property {string} status
 * @property {string} [meetingId]
 * @property {number} durationMinutes
 * @property {boolean} isGenerated
 * @property {string} createdAt
 */

/**
 * @typedef {Object} TimeSlotsByDate
 * @property {string} date
 * @property {TimeSlot[]} slots
 */

/**
 * @typedef {Object} Meeting
 * @property {string} id
 * @property {string} calendarId
 * @property {number} meetingTypeId
 * @property {string} organizerId
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} status
 * @property {string} title
 * @property {MeetingParticipant[]} participants
 * @property {string} guestName
 * @property {string} guestEmail
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [cancelledAt]
 * @property {string} [cancellationReason]
 */

/**
 * @typedef {Object} MeetingParticipant
 * @property {string} id
 * @property {string} meetingId
 * @property {string} name
 * @property {string} email
 * @property {boolean} isOrganizer
 * @property {string} status
 */

/**
 * @typedef {Object} MeetingCreate
 * @property {string} calendarId
 * @property {number} meetingTypeId
 * @property {string} startTime
 * @property {string} guestName
 * @property {string} guestEmail
 * @property {string} [notes]
 */

/**
 * @typedef {Object} MeetingListItem
 * @property {string} id
 * @property {number} meetingTypeId
 * @property {string} meetingTypeName
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} status
 * @property {string} guestName
 * @property {string} guestEmail
 * @property {number} durationMinutes
 */

/**
 * @typedef {Object} MeetingsResponse
 * @property {MeetingListItem[]} data
 * @property {Object} meta
 * @property {number} meta.total
 * @property {number} meta.page
 * @property {number} meta.limit
 * @property {number} meta.totalPages
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {Object} error
 * @property {string} error.code
 * @property {string} error.message
 * @property {string} [error.details]
 */

export {};
