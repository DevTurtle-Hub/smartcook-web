**SMARTCOOK**

**TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM**

_Software Requirements Specification_

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Ứng dụng trợ lý nấu ăn thông minh**

**Phiên bản**

1.0

**Nền tảng**

Mobile Application

**Frontend**

React Native

**Backend**

Node.js

**Database**

MongoDB

**Định hướng**

Smart Cooking / Meal Planning / Personalization

Tài liệu yêu cầu • Phiên bản 1.0

MỤC LỤC NỘI DUNG

**I. Mô tả chi tiết về dự án**

**1\. Tên dự án**

**2\. Bối cảnh và vấn đề cần giải quyết**

**3\. Mục tiêu của dự án**

**4\. Đối tượng sử dụng**

**II. Danh sách chức năng của dự án**

**Module 1**

AUTHENTICATION & ACCOUNT

**Module 2**

USER PROFILE & PERSONALIZATION

**Module 3**

HOME

**Module 4**

CATEGORY

**Module 5**

RECIPE

**Module 6**

"TÔI CÓ GÌ TRONG TỦ LẠNH?"

**Module 7**

SCAN NGUYÊN LIỆU

**Module 8**

SMART RECOMMENDATION

**Module 9**

COOK WITH ME

**Module 10**

SMART TIMER

**Module 11**

NUTRITION

**Module 12**

SMART MEAL PLANNER

**Module 13**

SHOPPING LIST

**Module 14**

INVENTORY

**Module 15**

COST CALCULATION

**Module 16**

PERSONALIZATION

**Module 17**

RATING & REVIEW

**Module 18**

COOKING HISTORY

**Module 19**

RECIPE REMIX

**Module 20**

INGREDIENT SUBSTITUTION

**Module 21**

TRENDING

**Module 22**

SMART SEARCH

**Module 23**

FAVORITE / SAVE

**Module 24**

NOTIFICATION

**Module 25**

AI RECIPE GENERATOR

I. MÔ TẢ CHI TIẾT VỀ DỰ ÁN

1\. Tên dự án

SmartCook – Ứng dụng trợ lý nấu ăn thông minh

SmartCook là một ứng dụng mobile hỗ trợ người dùng trong toàn bộ quá trình chuẩn bị và nấu ăn, từ việc tìm kiếm món ăn, lựa chọn món dựa trên nguyên liệu có sẵn, xem công thức, tính toán dinh dưỡng và chi phí, lập thực đơn, tạo danh sách mua sắm cho đến hướng dẫn nấu ăn từng bước.

Ứng dụng không chỉ đóng vai trò là một kho lưu trữ công thức mà hướng đến trở thành một trợ lý nấu ăn cá nhân, có khả năng hiểu nhu cầu, thói quen và mục tiêu ăn uống của người dùng để đưa ra các đề xuất phù hợp.

2\. Bối cảnh và vấn đề cần giải quyết

**Vấn đề 1 – Không biết hôm nay ăn gì :**

Người dùng thường mất nhiều thời gian để suy nghĩ: "Hôm nay ăn món gì?"

Trong khi đó, họ có thể đã có nhiều nguyên liệu trong tủ lạnh nhưng không biết có thể kết hợp chúng thành món gì.

**Vấn đề 2 – Có nguyên liệu nhưng không biết nấu món gì :**

**Ví dụ người dùng có:**

*   Thịt gà
*   Trứng
*   Cà chua
*   Cà rốt
*   Hành

**Ứng dụng cần giúp người dùng tìm ra:**

**"Với những nguyên liệu này, tôi có thể nấu được những món nào?"**

**Vấn đề 3 – Không biết công thức phù hợp với bản thân :**

**Một công thức có thể ngon nhưng không phù hợp với:**

*   Mục tiêu giảm cân.
*   Chế độ ăn uống.
*   Số người ăn.
*   Ngân sách.
*   Thời gian nấu.
*   Sở thích cá nhân.
*   Nguyên liệu người dùng không ăn được.

**Vấn đề 4 – Khó theo dõi quá trình nấu :**

**Các công thức truyền thống thường chỉ hiển thị:**

**Bước 1 → Bước 2 → Bước 3.**

Người dùng phải liên tục nhìn điện thoại trong khi nấu.

**SmartCook cung cấp Cooking Mode với:**

*   Hướng dẫn từng bước.
*   Timer.
*   Timeline.
*   Voice instruction.
*   Pause / Continue.
*   Skip step.
*   Notification.

Vấn đề 5 – Khó lập kế hoạch ăn uống

Người dùng muốn: "Lập thực đơn cho tôi trong 7 ngày với ngân sách 500.000đ."

Nhưng việc tự lập thực đơn và danh sách nguyên liệu rất mất thời gian.

SmartCook sẽ hỗ trợ tự động hóa quá trình này.

\# 3. Mục tiêu của dự án

**SmartCook hướng tới các mục tiêu chính:**

Mục tiêu 1

Giúp người dùng tìm kiếm và khám phá món ăn dễ dàng.

Mục tiêu 2

Giúp người dùng tận dụng các nguyên liệu đang có để hạn chế lãng phí thực phẩm.

Mục tiêu 3

Cung cấp công thức nấu ăn trực quan và dễ thực hiện.

Mục tiêu 4

Hỗ trợ người dùng quản lý dinh dưỡng và mục tiêu ăn uống.

Mục tiêu 5

Hỗ trợ lập kế hoạch bữa ăn theo ngày/tuần.

Mục tiêu 6

Tự động tạo danh sách nguyên liệu cần mua.

Mục tiêu 7

Cá nhân hóa đề xuất dựa trên sở thích và lịch sử sử dụng.

Mục tiêu 8

Ứng dụng AI để nâng cao trải nghiệm trong các chức năng phù hợp.

\# 4. Đối tượng sử dụng

Hệ thống hướng đến nhiều nhóm người dùng.

4.1. Người dùng cá nhân

**Ví dụ:**

*   Sinh viên.
*   Người đi làm.
*   Người sống một mình.
*   Người thích nấu ăn.

4.2. Gia đình

**Người muốn:**

*   Lập thực đơn gia đình.
*   Nấu cho nhiều người.
*   Quản lý ngân sách thực phẩm.
*   Chuẩn bị danh sách mua sắm.

4.3. Người quan tâm sức khỏe

**Ví dụ:**

*   Người muốn ăn healthy.
*   Người muốn kiểm soát calories.
*   Người muốn tăng protein.
*   Người muốn kiểm soát chế độ ăn.

4.4. Phụ huynh

**Có thể tìm:**

*   Món cho trẻ.
*   Món dễ ăn.
*   Món ít gia vị.
*   Bữa sáng cho trẻ.

II. DANH SÁCH CHỨC NĂNG CỦA DỰ ÁN

**MODULE 1  
AUTHENTICATION & ACCOUNT**

1.1. Đăng ký tài khoản

**Người dùng có thể tạo tài khoản bằng:**

*   Email.
*   Password.
*   Tên hiển thị.

1.2. Đăng nhập

Người dùng đăng nhập bằng tài khoản đã đăng ký.

1.3. Đăng xuất

Cho phép đăng xuất khỏi thiết bị.

1.4. Quên mật khẩu

Người dùng có thể yêu cầu khôi phục mật khẩu thông qua email.

1.5. Quản lý tài khoản

**Người dùng có thể:**

*   Thay đổi avatar.
*   Thay đổi tên.
*   Thay đổi email.
*   Thay đổi password.

**MODULE 2  
USER PROFILE & PERSONALIZATION**

Đây là module quan trọng vì nó phục vụ hệ thống recommendation.

**Người dùng có thể thiết lập:**

Thông tin ăn uống

**Mục tiêu:**

Ăn uống bình thường

Giảm cân

Tăng cơ

Ăn healthy

Sở thích

Món yêu thích

*   Gà
*   Bò
*   Hải sản
*   Món Việt
*   Món Âu

...

Không thích

**Ví dụ:**

**Không thích:**

Cá

Đồ cay

Chế độ ăn

Vegetarian

Vegan

Low Carb

High Protein

Eat Clean

Dị ứng

Trứng

Sữa

Hải sản

Đậu phộng

...

**MODULE 3  
HOME**

Trang chủ là trung tâm của ứng dụng.

**Hiển thị:**

Greeting

Xin chào

Hôm nay bạn muốn nấu gì?

Quick Actions

Tôi có gì trong tủ lạnh?

Scan nguyên liệu

Gợi ý cho tôi

Meal Planner

Categories

‍‍ Gia đình

️ Sức khỏe

Trẻ em

Cá nhân

Nhanh & Tiện lợi

Tiết kiệm

Tiệc & Dịp đặc biệt

Chế độ ăn

Ẩm thực

Đồ uống & Tráng miệng

Recommended for you

Hiển thị món phù hợp với từng người dùng.

**MODULE 4  
CATEGORY**

**Hệ thống category chính:**

‍‍ Gia đình

️ Sức khỏe

Trẻ em

Cá nhân

Nhanh & Tiện lợi

Tiết kiệm

Tiệc & Dịp đặc biệt

Chế độ ăn chay

Ẩm thực

Đồ uống & Tráng miệng

Mỗi category có thể có các subcategory/filter.

**MODULE 5  
RECIPE**

Đây là module cốt lõi.

**Người dùng có thể:**

*   Xem danh sách món.
*   Xem chi tiết món.
*   Tìm kiếm món.
*   Lọc món.
*   Lưu món yêu thích.
*   Đánh giá món.
*   Chia sẻ món.

**Một recipe bao gồm:**

Tên món

Ảnh

Mô tả

Thời gian chuẩn bị

Thời gian nấu

Độ khó

Khẩu phần

Nguyên liệu

Các bước thực hiện

Dinh dưỡng

Chi phí

Category

Tags

**MODULE 6  
"TÔI CÓ GÌ TRONG TỦ LẠNH?"**

Đây là một core feature của SmartCook.

**Người dùng nhập/chọn các nguyên liệu đang có:**

Thịt gà

Trứng

Cà rốt

Cà chua

Hành

Hệ thống tìm các recipe phù hợp.

**Ví dụ:**

Cơm gà áp chảo

Thịt gà

Cà rốt

Hành

Gạo

**Hiển thị:**

**Thiếu 1 nguyên liệu.**

Trứng xào cà chua

Trứng

Cà chua

Hành

**Hiển thị:**

**100% nguyên liệu có sẵn.**

**Có thể sắp xếp:**

100% nguyên liệu

↓

80%

↓

60%

**MODULE 7  
SCAN NGUYÊN LIỆU**

**Người dùng sử dụng camera để chụp:**

*   Tủ lạnh.
*   Bàn bếp.
*   Các nguyên liệu.

**Hệ thống nhận diện:**

**Chicken**

Egg

Carrot

Tomato

Lettuce

Onion

**Sau đó:**

**Bạn có thể nấu 8 món từ các nguyên liệu này.**

**Kiến trúc backend nên tách riêng:**

IngredientRecognitionService

để sau này có thể tích hợp AI Vision.

**MODULE 8  
SMART RECOMMENDATION**

**Hệ thống phân tích:**

Nguyên liệu

\\+

Sở thích

\\+

Lịch sử

\\+

Category

\\+

Mục tiêu

\\+

Thời gian

\\+

Ngân sách

**→ tạo danh sách đề xuất.**

**Ví dụ:**

**Hôm nay chúng tôi đề xuất 5 món dành cho bạn.**

**Recommendation sẽ ngày càng cá nhân hóa dựa trên hành vi:**

*   Xem món.
*   Like.
*   Save.
*   Rating.
*   Cook.
*   Search.
*   Bỏ qua món.

**MODULE 9  
COOK WITH ME**

Chế độ nấu ăn từng bước.

**Ví dụ:**

BƯỚC 2/7

Cho 300g thịt gà

vào chảo.

Lửa vừa

⏱ 5 phút

**Các chức năng:**

▶ Start

⏸ Pause

⏭ Skip

↩ Previous

**Có thể hỗ trợ:**

Voice

**"Cho thịt gà vào chảo và chiên trong 5 phút."**

**MODULE 10  
SMART TIMER**

Mỗi bước có thể có timer.

**Ví dụ:**

Ướp thịt 15 phút

Chiên 7 phút

Nấu sốt 5 phút

**Hệ thống tạo timeline:**

18:00 ─ Ướp thịt

18:15 ─ Chiên

18:22 ─ Nấu sốt

18:27 ─ Hoàn thành

**Hỗ trợ notification:**

**Đã đến lúc chuyển sang bước tiếp theo.**

**MODULE 11  
NUTRITION**

**Hiển thị thông tin dinh dưỡng của món:**

**Calories**

**Protein**

**Carbohydrates**

**Fat**

**Fiber**

**Sugar**

Người dùng thiết lập Daily Goal.

**Ví dụ:**

Calories: 2,000 kcal

Protein: 120g

Carbs: 200g

Fat: 60g

**Hệ thống theo dõi:**

**Breakfast**

**Lunch**

**Dinner**

và tính tổng dinh dưỡng trong ngày.

**MODULE 12  
SMART MEAL PLANNER**

**Người dùng tạo kế hoạch:**

**Mục tiêu:**

Giảm cân

**Số người:**

2

**Ngân sách:**

500.000đ

**Thời gian:**

7 ngày

**Hệ thống tạo:**

**Monday**

**Breakfast**

**Lunch**

**Dinner**

**Tuesday**

**Breakfast**

**Lunch**

**Dinner**

...

**Sunday**

**Breakfast**

**Lunch**

**Dinner**

Có thể thay đổi món thủ công.

**MODULE 13  
SHOPPING LIST**

**Từ Meal Planner → hệ thống tự động tạo shopping list.**

**Ví dụ:**

THỊT

Chicken 1.5kg

Beef 500g

RAU CỦ

Tomato 1kg

Carrot 500g

KHÁC

Eggs 12

Rice 2kg

**Quan trọng:**

**Nguyên liệu người dùng đã có sẽ được loại khỏi danh sách cần mua.**

**MODULE 14  
INVENTORY**

Người dùng quản lý nguyên liệu đang có.

**Ví dụ:**

My Kitchen

**Chicken**

**Quantity: 500g**

Eggs

**Quantity: 8**

Tomato

**Quantity: 4**

**Có thể bổ sung:**

*   Số lượng.
*   Đơn vị.
*   Ngày mua.
*   Hạn sử dụng.

**Sau này có thể cảnh báo:**

**️ Cà chua sắp hết hạn.**

**MODULE 15  
COST CALCULATION**

Hệ thống tính chi phí món ăn.

**Ví dụ:**

Chicken 25.000đ

Rice 5.000đ

Vegetables 8.000đ

Seasoning 2.000đ

–--------------------

**Total 40.000đ**

**Cho phép lọc:**

< 20K

20K – 30K

30K – 50K

\\> 50K

**MODULE 16  
PERSONALIZATION**

**Hệ thống ghi nhận hành vi:**

**Viewed**

**Liked**

**Saved**

**Cooked**

**Rated**

**Searched**

Sau đó xây dựng profile sở thích.

**Ví dụ:**

**Bạn thường thích:**

**Chicken**

Healthy

Spicy

⏱ <30 minutes

Home sẽ tự động thay đổi recommendation.

**MODULE 17  
RATING & REVIEW**

**Người dùng đánh giá:**

Hương vị

⏱ Độ dễ nấu

Chi phí

Thành phẩm

**Có thể thêm:**

*   Comment.
*   Upload ảnh thành phẩm.

Dữ liệu rating được sử dụng cho recommendation.

**MODULE 18  
COOKING HISTORY**

Lưu lại các món người dùng đã nấu.

**Ví dụ:**

My Cooking

42 meals cooked

Chicken Teriyaki

Caesar Salad

Tomato Egg

**Thống kê:**

Healthy: 12

High Protein: 8

Asian: 7

**MODULE 19  
RECIPE REMIX**

Cho phép biến đổi công thức.

**Ví dụ:**

**Recipe:**

Carbonara

**Không có:**

Bacon

**Có:**

**Chicken**

**Hệ thống đề xuất:**

**Thay bacon bằng chicken.**

**Hoặc:**

Không ăn cay

**→ Giảm chili**

Không ăn thịt

**→ Vegetarian version**

**MODULE 20  
INGREDIENT SUBSTITUTION**

Cho phép thay thế nguyên liệu.

**Ví dụ:**

**Cần:**

Butter

**Có:**

Olive Oil

**Hệ thống đề xuất:**

**Có thể thay thế Butter bằng Olive Oil.**

**MODULE 21  
TRENDING**

Hiển thị món đang phổ biến.

**Ranking dựa trên:**

Views

Likes

Saves

Cooks

Ratings

**Ví dụ:**

Trending

1.  Korean Cream Pasta
2.  Egg Drop Sandwich
3.  Vietnamese Chicken Salad
4.  Garlic Butter Shrimp

**MODULE 22  
SMART SEARCH**

**Search truyền thống:**

**Phở**

**Search thông minh:**

**"Món dưới 30 phút có thịt gà"**

**"Món healthy dưới 500 calories"**

**"Món cho 2 người dưới 100k"**

**"Món không cay có thịt bò"**

Hệ thống chuyển yêu cầu tự nhiên thành các điều kiện tìm kiếm.

**MODULE 23  
FAVORITE / SAVE**

**Người dùng có thể:**

*   Like recipe.
*   Save recipe.
*   Tạo danh sách món yêu thích.

**Ví dụ:**

️ Favorites

**Breakfast**

**Lunch**

**Dinner**

Healthy

**MODULE 24  
NOTIFICATION**

**Thông báo:**

Cooking Timer

Meal Reminder

Shopping Reminder

New Recipe

Personalized Recommendation

**Ví dụ:**

**Đã đến giờ chuẩn bị bữa tối.**

**MODULE 25  
AI RECIPE GENERATOR**

Đây là phần AI nâng cao.

**Người dùng nhập:**

**Tôi có:**

Thịt gà

Trứng

Cà chua

**Thời gian:**

20 phút

**Ngân sách:**

50.000đ

**Mục tiêu:**

Healthy

AI tạo công thức.

**Kết quả:**

Tên món

Nguyên liệu

Định lượng

Các bước

Thời gian

Dinh dưỡng

Chi phí