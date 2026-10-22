# Trợ lý giọng nói khi nấu ăn trên web

Mở trang chi tiết công thức, tới phần **Trợ lý giọng nói nấu ăn** bên dưới các bước nấu.

- Đăng nhập, cho phép micro trên HTTPS hoặc localhost, bấm **Chạm để nói**.
- Nói ngắn gọn rồi bấm **Dừng và gửi**. Bản ghi tự dừng sau 15 giây.
- Trình duyệt có phân tích âm thanh sẽ tự gửi khi đã nhận thấy lời nói và yên lặng khoảng 1,2 giây. Nếu 6 giây chưa có lời nói, ứng dụng dừng và nhắc thử lại, không gửi bản ghi im lặng. Trong bếp nhiều tiếng ồn, vẫn có thể bấm **Dừng và gửi**; giới hạn tối đa vẫn là 15 giây.
- Có thể nhập câu hỏi, dùng gợi ý nhanh, bật/tắt đọc câu trả lời hoặc bấm **Nghe lại**.
- Ví dụ: “Chuyển sang bước thứ hai”, “Lùi bước”, “Lùi hai phút”, “Thêm hai phút”, “Trứng gà dùng bao nhiêu?”, “Thịt chưa chín thì làm sao?”.
- Lệnh chuyển bước luôn nạp thời lượng bước đích và dừng đồng hồ cũ. Gia hạn bằng giọng nói chạy tiếp đồng hồ. Hết giờ nhắc kiểm tra, không tự xác nhận món đã chín hoặc ghi nhận hoàn thành món.
- Cộng/trừ thời gian áp dụng cho **hẹn giờ nấu của bước đang chọn**, không phải thời gian chờ tự chuyển bước. Nhận cả yêu cầu lịch sự như “Bạn có thể thêm 2 phút cho mình không?”, “Cho mình trừ đi hai phút”. Ví dụ đồng hồ 01:00 thêm 2 phút thành 03:00; giảm vượt thời gian còn lại chỉ về 00:00. Câu “Có nên thêm 2 phút không?” là hỏi tư vấn, không tự chỉnh giờ.
- Mỗi câu hỏi mới xóa câu trả lời cũ trong khung trợ lý. Nếu xử lý lỗi, giao diện chỉ hiện lỗi của yêu cầu mới, tránh hiển thị lời xác nhận cũ dưới câu vừa nói.
- Khung **Hẹn giờ nấu** có cả đồng hồ của bước hiện tại và **Tự chuyển bước sau khi xác nhận xong**. Bật chế độ này, chọn 15s/30s/1 phút/2 phút rồi bấm **Đã xong bước này** để bắt đầu đếm chờ. Có thể dừng/tiếp tục đếm hoặc bấm **Qua ngay**.
- Thêm thời gian, đặt lại hoặc chọn bước khác sẽ hủy đếm chuyển cũ. Tương tác với trợ lý hay chuyển sang tab khác sẽ tạm dừng đếm chuyển, chờ bạn bấm tiếp tục. Đồng hồ nấu vẫn tính thời gian thực và cập nhật khi quay lại. Bước cuối cần xác nhận riêng bằng nút hoàn thành món.

## Xử lý và giới hạn

Luồng ghi âm dùng MediaRecorder, ưu tiên WebM/Opus và hỗ trợ MP4 khi trình duyệt cung cấp. Web giải mã bản ghi hoàn chỉnh, chuyển sang PCM WAV mono 16-bit, 16 kHz trước khi gửi API `/ai/cooking-transcription` có xác thực. Dữ liệu tối đa 2 MB. Sau khi nhận diện, câu nói đi qua cùng bộ xử lý câu lệnh, phạm vi và thông tin công thức của mobile.

Lệnh rõ ràng, câu hỏi ngoài phạm vi và thông tin có sẵn trong công thức được giải quyết tại trình duyệt, không gọi mô hình tư vấn. Nhận diện âm thanh vẫn cần dịch vụ máy chủ. Câu hỏi tư vấn gửi tới `/ai/cooking-copilot` với món đang xem, nguyên liệu/định lượng, danh sách bước, trạng thái hẹn giờ và tối đa 6 lượt hội thoại ngắn.

Hỏi nội dung bước bằng số hoặc chữ (ví dụ **“Thao tác của bước hai gồm những gì?”**, **“Bước tiếp theo gồm gì?”**) trả về hướng dẫn của đúng bước trong công thức. Hỏi nội dung không làm chuyển bước hoặc chỉnh đồng hồ. Bước không tồn tại được báo rõ; ứng dụng không tự sáng tác hướng dẫn. Câu hỏi thao tác đơn giản chỉ cần nhận diện tiếng nói rồi tra công thức tại máy, không gọi thêm mô hình tư vấn.

Thời hạn chờ dịch vụ nhận diện là 15 giây, không lặp lại yêu cầu tự động; web dành thêm 5 giây cho truyền dữ liệu. Đây là giới hạn chờ, không phải cam kết độ trễ. Mạng và nhà cung cấp vẫn ảnh hưởng thời gian nhận diện.

Câu hỏi dinh dưỡng thuộc phạm vi món đang nấu. Calories, đạm, tinh bột, chất béo, chất xơ, đường và natri được đọc từ dữ liệu gốc của công thức nếu có; số 0 được giữ nguyên, chỉ số thiếu không được thay bằng giá trị mẫu. Nếu chưa có thông tin số liệu tính cho một khẩu phần hay toàn bộ món, trợ lý nói rõ và không tự chia theo số người. Câu hỏi số liệu có sẵn được trả lời tại máy, còn tư vấn cần phân tích dùng cùng ngữ cảnh dinh dưỡng ở máy chủ.

Lỗi nhận diện được phân biệt giữa bản ghi không hợp lệ (400), thiếu cấu hình/quyền dịch vụ, hết hạn mức và dịch vụ không khả dụng (503). Nhật ký chẩn đoán chỉ có loại lỗi, mã trạng thái, model, định dạng và số byte; không ghi âm thanh, lời nói hay thông tin bí mật.

Đóng trợ lý, chuyển món hoặc chuyển bước sẽ hủy bản ghi/yêu cầu cũ và giải phóng micro. Phản hồi của bước cũ không được thay đổi bước mới. Lệnh điều khiển chỉ được thực hiện từ bộ phân tích câu lệnh; lời tư vấn từ mô hình không trực tiếp điều khiển đồng hồ. Mất kết nối hiển thị lỗi để thử lại, không tạo lời tư vấn giả.

Giọng đọc dùng tiếng Việt của trình duyệt/thiết bị. Nếu trình duyệt chặn phát sau tác vụ bất đồng bộ, bấm **Nghe lại**. Khi thiếu micro, quyền ghi âm hoặc khả năng phát giọng đọc, ô nhập và nội dung trả lời vẫn dùng được.

## Kiểm tra

```sh
npm run test:cooking-voice
npm run build
```

Bộ kiểm tra dùng API giả lập để xác minh định tuyến, dữ liệu ngữ cảnh, lỗi, xác thực và định dạng âm thanh; kiểm tra các tiện ích điều khiển còn đồng nhất với mobile. Kiểm tra giao diện thực tế đã xác nhận chuyển bước, giảm thời gian, từ chối câu hỏi ngoài phạm vi và trả lời đúng định lượng trong công thức.

Trước khi phát hành, cần kiểm tra micro/loa thật trên trình duyệt và thiết bị đích: cấp/từ chối quyền, dừng ghi âm, tự dừng 15 giây, hủy trong khi chờ nhận diện và chuyển bước khi yêu cầu đang xử lý.
