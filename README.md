# Student Club Management System

Hệ thống quản lý câu lạc bộ sinh viên với React + TypeScript (frontend) và Express + Prisma (backend).

## 🚀 Khởi động nhanh

### Backend

1. **Di chuyển vào thư mục backend**
   ```powershell
   cd backend
   ```

2. **Backend đã được cấu hình sẵn với SQLite**
   - File `.env` đã có sẵn với DATABASE_URL trỏ tới SQLite
   - Database và migrations đã được tạo
   - Admin user đã được seed:
     - Email: `admin@example.com`
     - Password: `admin123`

3. **Khởi động backend server**
   ```powershell
   npm run dev
   ```
   
   Server sẽ chạy tại: `http://localhost:5000`

### Frontend

1. **Di chuyển vào thư mục frontend**
   ```powershell
   cd frontend
   ```

2. **File `.env` đã được tạo**
   - `VITE_API_URL=http://localhost:5000/api`

3. **Khởi động frontend**
   ```powershell
   npm run dev
   ```
   
   App sẽ chạy tại: `http://localhost:5173` (hoặc Vite sẽ tự chọn port khác như `5174` nếu 5173 đang bận). Hãy xem dòng "Local:" trong terminal để biết URL chính xác.

## 📝 Thông tin đăng nhập

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

## 🔧 Cấu trúc dự án

### Backend (`/backend`)
- **Framework:** Express 5 + TypeScript
- **Database:** SQLite (Prisma ORM)
- **Authentication:** JWT + bcryptjs
- **File Upload:** Multer
- **Port:** 5000

**Endpoints chính:**
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user hiện tại
- `GET /api/users` - Danh sách users (admin)
- `GET /api/clubs` - Danh sách CLB
- `POST /api/clubs` - Tạo CLB (admin)
- `GET /api/events` - Danh sách sự kiện
- `POST /api/events` - Tạo sự kiện (admin)

### Frontend (`/frontend`)
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite (Rolldown)
- **UI:** TailwindCSS + Radix UI
- **State:** React Query + Context API
- **Routing:** React Router v7
- **Forms:** React Hook Form + Zod

## 🛠️ Scripts hữu ích

### Backend
```powershell
npm run dev          # Chạy dev server với hot reload
npm run build        # Build TypeScript
npm run start        # Chạy production build
npm run seed         # Seed admin user (đã chạy rồi)
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Chạy migrations
```

### Frontend
```powershell
npm run dev          # Chạy dev server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Chạy ESLint
```

## 📦 Database

Project sử dụng **SQLite** để dễ dàng khởi động và test.

**File database:** `backend/dev.db`

**Schema:**
- `User` - Người dùng (ADMIN/USER)
- `Club` - Câu lạc bộ
- `Member` - Thành viên CLB
- `Event` - Sự kiện

Nếu muốn chuyển sang PostgreSQL:
1. Cập nhật `backend/src/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Cập nhật `backend/.env`:
   ```
   DATABASE_URL="postgresql://user:pass@localhost:5432/db_name"
   ```
3. Chạy lại migrations:
   ```powershell
   npm run prisma:migrate
   ```

## 🔐 Phân quyền

- **USER (mặc định):**
  - Xem danh sách clubs, events
  - Tham gia clubs
  
- **ADMIN:**
  - Tất cả quyền của USER
  - Tạo/sửa/xóa clubs
  - Tạo/sửa/xóa events
  - Quản lý users

## 📁 Upload files

- Thư mục upload: `backend/uploads/`
- Endpoint static: `http://localhost:5000/uploads/*`

## ⚙️ Môi trường

### Backend `.env`
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-jwt-key-change-this-in-production"
PORT=5000
UPLOAD_DIR="uploads"
NODE_ENV="development"

SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="admin123"
SEED_ADMIN_NAME="Administrator"
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

**Backend không kết nối được database:**
- Kiểm tra `backend/.env` có đúng DATABASE_URL
- Với SQLite: file `dev.db` phải được tạo (chạy `npm run prisma:migrate`)

**Frontend không gọi được API:**
- Kiểm tra `frontend/.env` có `VITE_API_URL` đúng
- Kiểm tra backend server đang chạy trên port 5000
- Kiểm tra CORS đã được enable trong backend

**Lỗi Authentication:**
- Kiểm tra JWT_SECRET trong `backend/.env`
- Token được lưu trong localStorage của browser
- Có thể clear localStorage và đăng nhập lại

## 📚 Tech Stack

**Backend:**
- Express 5.1
- Prisma 6.17
- TypeScript 5.9
- bcryptjs 2.4
- jsonwebtoken 9.0
- multer 2.0
- zod 4.1

**Frontend:**
- React 19.1
- Vite (Rolldown) 7.1
- TanStack Query 5.90
- React Router 7.9
- TailwindCSS 4.1
- Radix UI
- React Hook Form 7.65
- Zod 4.1

---

Chúc bạn code vui! 🎉
