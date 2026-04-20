# Design System

## Цветовая палитра

### Primary Colors
- **Primary/Accent**: `#FF6B35` (оранжевый) — кнопки CTA, активные элементы
- **Primary Hover**: `#E55A2B` — hover состояние

### Neutral Colors
- **Background**: `#F8F9FA` — основной фон страницы
- **Card Background**: `#FFFFFF` — фон карточек
- **Text Primary**: `#1A1A1A` — заголовки, основной текст
- **Text Secondary**: `#6B7280` — подзаголовки, описания
- **Text Muted**: `#9CA3AF` — placeholder, disabled
- **Border**: `#E5E7EB` — границы карточек, разделители
- **Border Light**: `#F3F4F6` — лёгкие разделители

### Semantic Colors
- **Success**: `#10B981` — доступно, подтверждено
- **Danger**: `#EF4444` — ошибки, занято, отменено
- **Warning**: `#F59E0B` — предупреждения
- **Info**: `#3B82F6` — информация

## Типографика

### Шрифт
- **Font Family**: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Base Size**: `16px`
- **Line Height**: `1.5`

### Заголовки
- **H1**: `36px / 700 / 1.2` — главные заголовки страниц
- **H2**: `28px / 700 / 1.3` — секции
- **H3**: `22px / 600 / 1.3` — карточки, подсекции
- **H4**: `18px / 600 / 1.4` — мелкие заголовки

### Body Text
- **Body Large**: `18px / 400` — описания, hero text
- **Body**: `16px / 400` — основной текст
- **Body Small**: `14px / 400` — вторичный текст
- **Caption**: `12px / 500` — подписи, бейджи

## Компоненты

### Buttons

#### Primary Button
- Background: `#FF6B35`
- Text: `#FFFFFF`
- Padding: `12px 24px`
- Border Radius: `8px`
- Font: `16px / 600`
- Hover: Background `#E55A2B`
- Shadow: `0 2px 4px rgba(255, 107, 53, 0.2)`

#### Secondary Button
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Text: `#374151`
- Padding: `12px 24px`
- Border Radius: `8px`
- Font: `16px / 600`
- Hover: Background `#F9FAFB`

#### Ghost Button
- Background: transparent
- Text: `#6B7280`
- Padding: `8px 16px`
- Hover: Background `#F3F4F6`

### Cards

#### Standard Card
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Border Radius: `12px`
- Padding: `24px`
- Shadow: `0 1px 3px rgba(0, 0, 0, 0.05)`

#### Hoverable Card
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Border Radius: `12px`
- Padding: `24px`
- Cursor: pointer
- Hover: Border `#FF6B35`, Shadow `0 4px 12px rgba(0, 0, 0, 0.1)`
- Transition: `all 0.2s ease`

### Forms

#### Input
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Border Radius: `8px`
- Padding: `12px 16px`
- Font: `16px`
- Focus: Border `#FF6B35`, Shadow `0 0 0 3px rgba(255, 107, 53, 0.1)`
- Placeholder: `#9CA3AF`

#### Select
- Same as Input
- Arrow icon on right

### Badges

#### Duration Badge
- Background: `#F3F4F6`
- Text: `#6B7280`
- Padding: `4px 12px`
- Border Radius: `16px`
- Font: `12px / 500`

#### Status Badge (Available)
- Background: `#D1FAE5`
- Text: `#059669`
- Padding: `4px 12px`
- Border Radius: `16px`

#### Status Badge (Booked)
- Background: `#FEE2E2`
- Text: `#DC2626`
- Padding: `4px 12px`
- Border Radius: `16px`

### Calendar Grid

#### Day Cell
- Size: `40px x 40px`
- Border Radius: `8px`
- Default: Background transparent, Text `#374151`
- Hover: Background `#F3F4F6`
- Selected: Background `#FF6B35`, Text `#FFFFFF`
- Disabled: Text `#D1D5DB`

## Layout

### Container
- Max Width: `1200px`
- Padding: `0 24px`
- Center aligned

### Grid System
- Gap: `24px` (standard), `16px` (compact)
- 2-column grid for cards
- 3-column layout for booking flow

### Spacing Scale
- `xs`: `4px`
- `sm`: `8px`
- `md`: `16px`
- `lg`: `24px`
- `xl`: `32px`
- `2xl`: `48px`
- `3xl`: `64px`

## Header/Navigation

- Height: `64px`
- Background: `#FFFFFF`
- Border Bottom: `1px solid #E5E7EB`
- Logo on left
- Navigation links on right
- Link style: `16px / 500`, color `#6B7280`, hover `#FF6B35`

## Patterns

### Hero Section
- Layout: 2-column (text left, card right)
- Background: Gradient `#F8F9FA` to `#FFFFFF`
- Title + description + CTA button

### Card List
- Grid: 2 columns
- Gap: `24px`
- Cards with icon/title/description/badge

### 3-Column Layout (Booking Flow)
- Left: Info panel (sticky)
- Center: Calendar
- Right: Time slots
- Gap: `24px`

## Animations

### Transitions
- Default: `all 0.2s ease`
- Cards hover: `transform 0.2s ease, box-shadow 0.2s ease`
- Button hover: `background-color 0.15s ease`

### Focus States
- Outline: `none`
- Ring: `0 0 0 3px rgba(255, 107, 53, 0.3)`
