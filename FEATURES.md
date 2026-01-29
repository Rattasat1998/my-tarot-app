# My Tarot App - Features & Systems Documentation

> **Last Updated:** 2026-01-29

## 🎴 เกมทำนายไพ่ทาโรต์ (Core Game)

| Feature | รายละเอียด | ไฟล์หลัก |
|---------|------------|----------|
| ดึงไพ่ 1 ใบ | ทำนายรายวัน หรือคำถามทั่วไป | `GamePage.jsx`, `useTarotGame.js` |
| ดึงไพ่ 3 ใบ | อดีต - ปัจจุบัน - อนาคต | `GamePage.jsx`, `useTarotGame.js` |
| ทำนายรายเดือน | ดูดวงประจำเดือน | `GamePage.jsx` |
| ทำนายอนาคต | ดูเหตุการณ์ในอนาคต | `FutureConfirmDialog.jsx` |
| Animation States | Shuffling → Cutting → Picking → Result | `components/game/` |
| Speech / Audio | อ่านผลทำนายด้วยเสียง | `useSpeech.js` |

---

## 👤 ระบบผู้ใช้ (User System)

| Feature | รายละเอียด | ไฟล์หลัก |
|---------|------------|----------|
| Authentication | ล็อกอินผ่าน Supabase Auth | `AuthContext.jsx` |
| Profile Page | ดู/แก้ไขข้อมูลส่วนตัว | `ProfilePage.jsx` |
| Avatar Upload | อัปโหลดรูปโปรไฟล์ (compress รูปเกิน 400KB) | `ProfilePage.jsx` |
| Admin System | หน้า Admin สำหรับจัดการระบบ | `AdminPage.jsx` |

---

## 💰 ระบบเครดิต (Credits System)

| Feature | รายละเอียด | ไฟล์หลัก |
|---------|------------|----------|
| Credits Balance | ผู้ใช้มีเครดิตสำหรับดึงไพ่ | `useCredits.js` |
| Top Up | เติมเงินผ่านการอัปโหลดสลิป | `TopUpModal.jsx` |
| Transaction History | ดูประวัติการเติมเงิน | `TransactionHistoryModal.jsx` |
| Admin Approval | Admin อนุมัติ/ปฏิเสธการเติมเงิน | `AdminPage.jsx` |
| Deduct Credit | หักเครดิตตามต้นทุนแต่ละโหมด | `supabase_setup.sql` |

---

## 🎁 ระบบรางวัลประจำวัน (Daily Rewards)

| Feature | รายละเอียด | ไฟล์หลัก |
|---------|------------|----------|
| Daily Check-in | เช็คอินรายวัน | `App.jsx`, `DailyRewardModal.jsx` |
| Streak System | นับวันติดต่อกัน (7 วันครบได้ 20 เครดิต) | `supabase_setup.sql` |
| Daily Free Draw | ดึงไพ่ฟรีวันละ 1 ครั้ง | `useCredits.js` |
| Reward Modal | Popup แสดงสถานะ streak และรางวัล | `DailyRewardModal.jsx` |

---

## 📜 ประวัติการอ่าน (Reading History)

| Feature | รายละเอียด | ไฟล์หลัก |
|---------|------------|----------|
| Save Reading | บันทึกผลการทำนายอัตโนมัติ | `supabase_setup.sql` |
| History Page | หน้าดูประวัติการทำนาย | `HistoryPage.jsx` |
| Reading Detail Modal | ดูรายละเอียดผลทำนายแต่ละครั้ง | `ReadingHistoryDetailModal.jsx` |
| Save Memo | บันทึกโน้ตส่วนตัวพร้อมผลทำนาย | `SaveMemoModal.jsx` |

---

## 📅 ปฏิทินและดวงรายวัน (Calendar & Daily Fortune)

| Feature | รายละเอียด | ไฟล์หลัก |
|---------|------------|----------|
| Calendar Component | เลือกวันเพื่อดูดวง | `components/calendar/` |
| Daily Fortune | ข้อมูลดวงประจำวัน | `dailyFortune.js` |
| Daily Card | การ์ดแสดงไพ่ประจำวัน | `DailyCard.jsx` |
| Holidays Data | วันหยุดและวันพิเศษ | `holidays.js` |

---

## 📰 บทความ (Articles)

| Feature | รายละเอียด | ไฟล์หลัก |
|---------|------------|----------|
| Articles Data | บทความเกี่ยวกับไพ่ทาโรต์ | `articles.js` |
| Articles Component | แสดงบทความในแอป | `components/articles/` |

---

## 🎨 UI Components

| Component | รายละเอียด | ไฟล์หลัก |
|-----------|------------|----------|
| Navbar | แถบเมนูด้านบน | `components/navigation/` |
| Theme Toggle | สลับ Dark/Light mode | `App.jsx` |
| Share Card Template | สร้างรูปสำหรับแชร์ผลทำนาย | `ShareCardTemplate.jsx` |
| Modals | Age Verification, Privacy, Terms, etc. | `components/modals/` |
| Meditation Dialog | หน้าจอนำสมาธิก่อนดึงไพ่ | `MeditationDialog.jsx` |

---

## 🛠️ Tech Stack

| หมวด | เทคโนโลยี |
|------|-----------|
| Frontend | React + Vite |
| Styling | TailwindCSS |
| Backend/Auth | Supabase (PostgreSQL + Auth) |
| Storage | Supabase Storage (slips, avatars) |
| Deployment | Vercel |

---

## 📊 Database Tables

| Table | รายละเอียด |
|-------|------------|
| `profiles` | ข้อมูลผู้ใช้ + เครดิต + streak |
| `transactions` | รายการเติมเงิน |
| `reading_history` | ประวัติการทำนาย |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/        # Admin components
│   ├── articles/     # Article components
│   ├── calendar/     # Calendar components
│   ├── game/         # Game state components
│   ├── layout/       # Layout components
│   ├── modals/       # Modal dialogs
│   ├── navigation/   # Navigation components
│   └── ui/           # UI components
├── contexts/         # React contexts (Auth)
├── data/             # Static data (cards, articles, holidays)
├── hooks/            # Custom hooks
├── lib/              # Library (Supabase client)
├── pages/            # Page components
└── utils/            # Utility functions
```

---

## 📝 Changelog

### 2026-01-29
- ตั้งค่า Ad Unit ID (`9470221240`) ใน `GoogleAdSlot.jsx`
- เพิ่ม Google AdSense Meta Tag (`index.html`)
- สร้างเอกสาร FEATURES.md

<!-- เพิ่ม feature ใหม่ที่นี่ -->
