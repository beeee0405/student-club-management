# Hướng dẫn Upload Logo

## Bước 1: Lưu 2 file logo vào folder

Hãy lưu 2 file ảnh logo với tên chính xác vào folder `frontend/public/images/`:

1. **Logo Đoàn Thanh niên** (ảnh đỏ) → Đặt tên: `logo_doan_thanh_nien.png`
2. **Logo Hội Sinh viên** (ảnh xanh) → Đặt tên: `logo_hoi_sinh_vien.png`

## Bước 2: Upload lên Vercel

Sau khi lưu file vào folder `frontend/public/images/`, chạy lệnh:

```bash
git add .
git commit -m "Add: Logo Đoàn Thanh niên và Hội Sinh viên"
git push
```

Vercel sẽ tự động deploy và hiển thị 3 logo ở góc dưới bên phải trang web.

## Kết quả

3 logo sẽ hiển thị theo thứ tự (từ trái sang phải):
- Logo Đoàn Thanh niên (đỏ)
- Logo Hội Sinh viên (xanh)
- Logo TDMU (hiện tại)

Các logo có hiệu ứng hover (phóng to nhẹ khi rê chuột).
