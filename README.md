## Lưu khi note khi thiết kế
- login chỉ xác thực qua otp không dùng password 
- logic khi đăng nhập và xác thực là qua sđt để tạo user khi gán vào trung tâm sẽ là user_workspaces và dùng username để định danh user_workspace
- nghiệp vụ trên cms sẽ tạo user_workspace = sdt , check sđt nếu chưa có user này thì sẽ tạo user còn có rồi sẽ gán user_id cho user_workspace đấy và có quyền chuyển tài khoản trong workspace(trung tâm) tạo.
- mobile màn login sẽ hiển input: mã trung tâm, sđt và otp để đăng nhập
- FLOW cms  
config trước:
-> tạo ca
-> tạo phòng học
-> tạo đánh giá hàng ngày
tiếp luồng:
-> tạo khoá học -> tạo lịch học -> sinh thời khoá biểu -> ghi danh học sinh

### sinh thời khoá biểu
-> dựa trên input lịch học (table: user_workspace_shift_scopes) + data bài học (table: lessons) và data bài giảng (table: lectures) vừa được auto generate khi tạo khoá học(table: courses) => output {number_of_lesson} số buổi học (timetable)