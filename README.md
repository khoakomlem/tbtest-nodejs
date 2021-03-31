# Trấn Biên Test - Trắc nghiệm online
## Cài đặt môi trường
### 1. Cài nodejs, xampp
Đảm bảo trong máy tính của bạn có nodejs và 1 server mysql trong localhost để tbtest tương tác, có thể thay đổi các thông số database name, address, ... trong file **config.json** (tbtest sẽ lấy configs[0] để connect)
### 2. Import database template
Tạo 1 database mới sau đó copy paste tất cả các lệnh SQL trong file **database map.sql** vào form bên dưới và nhấn **Go**.
![phpmyadmin](https://i.snipboard.io/RflWmy.jpg)

### 3. Chạy server
Mở command prompt và mount (cd) tới đường dẫn của tbtest.
Nếu là lần đầu chạy thì phải gõ lệnh: **npm install**<br>
Nếu không thì chỉ cần gõ lệnh: **npm start**<br>
Web sẽ xuất hiện ở trang **http://localhost:9999/** !
### 4. Thử nghiệm
Tài khoản thử nghiệm: (**username**|**password**)<br>
Giáo viên: **admin**|**admin**<br>
Học sinh: **test**|**test**<br>
Mã đề thử nghiệm: **AA0C4E**
# Made by Khoa Ko Mlem (THPT Tran Bien) and Binh Le (THPT LUONG THE VINH)
