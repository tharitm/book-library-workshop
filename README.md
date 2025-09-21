# ระบบจัดการห้องสมุด

ระบบจัดการห้องสมุดสำหรับ Workshop ที่พัฒนาด้วย React (Frontend) และ NestJS (Backend) ในรูปแบบ monorepo

## ฟีเจอร์หลัก

- 📚 จัดการหนังสือ (เพิ่ม แก้ไข ลบ ดู)
- 👥 ระบบยืนยันตัวตนและการจัดการสิทธิ์ (hard token no jwt)
- 📖 ระบบยืม-คืนหนังสือ
- 📊 ติดตามประวัติการยืม
- 🖼️ อัพโหลดรูปปกหนังสือ
- 🔍 ค้นหาและกรองข้อมูล
- 📱 Responsive design

## เทคโนโลยีที่ใช้

**Frontend:**
- React 18 with TypeScript
- Vite สำหรับ build
- Tailwind CSS สำหรับ styling
- React Router สำหรับ navigation

**Backend:**
- NestJS with TypeScript
- TypeORM สำหรับจัดการฐานข้อมูล
- SQLite database
- Swagger API documentation

## การติดตั้งและใช้งาน

### ความต้องการของระบบ
- Node.js (v16 ขึ้นไป)
- npm หรือ yarn
- Docker (สำหรับการรัน Docker)

### วิธีการรันแบบง่าย (แนะนำ)

**ใช้ Docker Compose:**
```bash
git clone <repository-url>
cd book
docker-compose up
```

หรือ

**รันจาก root folder:**
```bash
git clone <repository-url>
cd book
npm install
npm run dev
```

### วิธีการรันแบบแยกส่วน

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd book
   ```

2. **ติดตั้ง dependencies**
   ```bash
   npm install
   ```

3. **เริ่ม backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend จะรันที่ `http://localhost:3000`

4. **เริ่ม frontend (terminal ใหม่)**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend จะรันที่ `http://localhost:5173`

### การตั้งค่าฐานข้อมูล

ฐานข้อมูล SQLite จะถูกสร้างอัตโนมัติเมื่อรัน backend ครั้งแรก สามารถเพิ่มข้อมูลตัวอย่างได้ด้วย:

```bash
cd backend
npm run seed
```

## เอกสาร API

เมื่อ backend รันแล้ว สามารถเข้าถึงเอกสาร Swagger API ได้ที่:
`http://localhost:3000/api`

## API Endpoints หลัก

- `GET /api/books` - ดูรายการหนังสือทั้งหมด (มีการค้นหาและแบ่งหน้า)
- `POST /api/books` - เพิ่มหนังสือใหม่ (Admin เท่านั้น)
- `POST /api/books/:id/borrow` - ยืมหนังสือ
- `POST /api/books/:id/return` - คืนหนังสือ
- `GET /api/books/borrowed/list` - ดูรายการหนังสือที่ถูกยืม (Admin เท่านั้น)
- `GET /api/books/returned/list` - ดูรายการหนังสือที่ถูกคืนแล้ว (Admin เท่านั้น)

## การยืนยันตัวตน

ข้อมูลสำหรับทดสอบ:
- Token: `admin-token-123` (สำหรับทดสอบ API)

## สิ่งที่อยากปรับปรุงถ้ามีเวลามากขึ้น

### Trade-offs ปัจจุบัน
- **ฐานข้อมูล SQLite**: เหมาะสำหรับ development แต่อาจต้องเปลี่ยนเป็น PostgreSQL/MySQL สำหรับ production (หรืออาจจะเป็น mongodb)
- **การจัดเก็บไฟล์**: ปััจจุบันเก็บรูปภาพใน local ในอนาคตอาจจะใช้ cloud เก็บหรือ เก็บลง NAS 

### การปรับปรุงที่เป็นไปได้
- **ความปลอดภัยที่ดีขึ้น**: ใช้ JWT แบบเต็มรูปแบบพร้อม refresh tokens และ password hashing
- **การย้ายฐานข้อมูล**: เปลี่ยนไปใช้ฐานข้อมูลสำหรับ production พร้อม migrations
- **push notification**: 
- **การทดสอบ**: unit tests และ integration tests 
- **CI/CD Pipeline**: ระบบ deployment และ 

## โครงสร้างโปรเจค

```
book/
├── backend/          # NestJS backend application
├── frontend/         # React frontend application
├── docker-compose.yml # Docker configuration
└── README.md         # ไฟล์นี้
```
