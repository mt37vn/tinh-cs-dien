# Tính Chỉ Số Điện

Ứng dụng tính toán điện dân dụng: công suất phụ tải, dòng điện, tiết diện dây dẫn và lựa chọn aptomat theo từng phòng/khu vực.

## Tính năng

- Nhập danh sách phòng và thiết bị điện, công suất, hệ số sử dụng.
- Tính tổng công suất, dòng điện làm việc và dòng điện tính toán.
- Gợi ý tiết diện dây dẫn và aptomat phù hợp.
- Tổng hợp kết quả theo phòng và toàn bộ công trình.
- Có bản React + TypeScript (`src/`) và bản HTML một file (`app.html`) dùng trực tiếp.

## Công nghệ

React 19 · TypeScript · Vite 7 · HTML/CSS

## Chạy bản React

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

## Chạy bản HTML

Mở trực tiếp `app.html` trong trình duyệt, không cần cài đặt.

## Cấu trúc

```
src/App.tsx              # Giao diện chính
src/utils/electrical.ts  # Công thức tính toán
app.html                 # Bản ứng dụng một file
public/                  # Tài nguyên tĩnh
```

## Lưu ý

Kết quả chỉ mang tính tham khảo. Khi thi công, cần đối chiếu tiêu chuẩn điện hiện hành (TCVN/IEC) và kiểm tra bởi người có chuyên môn.
