const o =
{
    txt_ExerciseOK: "Chắc chắn",
    txt_ExerciseContinue: "Làm tiếp",
    txt_ExerciseDoNow: "Làm ngay",
    txt_ExerciseHelpThenDoNow: "Xem hướng dẫn rồi làm",
    txt_ExerciseNQuestion: "Đề thi có %s câu hỏi",
    txt_ExerciseTime: "Thời gian làm bài: %s",
    txt_ExerciseTimeLeft: "Thời gian còn lại: %s",
    txt_ExerciseTimeAndCount: "Bạn có %s để làm bài, thời gian bắt đầu tính ngay bây giờ",
    txt_ExerciseOnTest1: "Bạn đang trong một bài thi, không thể làm bài thi khác.",
    txt_ExerciseOnTest2: "Vui lòng kết thúc bài thi hiện tại trước.",
    txt_ExerciseNext: ">",
    txt_ExercisePrevious: "<",
    txt_ExerciseSubmit: "Nộp bài",
    txt_ExerciseSubmitComfirm: "Bạn có chắc muốn nộp bài không?",
    txt_ExerciseReady: "Đã hiểu",
    txt_ExerciseChooseQuestion: "Mời chọn câu hỏi",
    txt_ExerciseQuestion: "Câu %s",
    txt_ExerciseCompleteQuestion: "Bạn đã hoàn thành %s/%s câu hỏi",
    txt_ExerciseResultQuestion: "Kết quả bài thi: %s/%s",
    txt_ExerciseResultScore: "Điểm số đạt được: %s/%s",
    txt_ExerciseResultViewInWeb: "Xem chi tiết%s",
    txt_ExerciseHelp1: "HƯỚNG DẪN LÀM BÀI THI NGAY TRÊN CHATBOT",
    txt_ExerciseHelp2: "Chọn câu hỏi hỏi bằng cách nhấn vào nút câu hỏi tương ứng.",
    txt_ExerciseHelp3: `Nhấn "%s" để nộp bài`,
    txt_ExerciseHelp4: `Nhấn "%s" chuyển sang danh sách câu hỏi trước đó và "%s" cho danh sách câu hỏi kế tiếp.`,
    txt_ExerciseHelp5: "Câu hỏi nào đã trả lời sẽ được đánh dấu bởi %s.",
    txt_ExerciseHelp6: "Chọn đáp án bằng cách chọn đúng màu so với đáp án.",
    txt_ExerciseHelp7: "Đối với câu hỏi đã được trả lời, câu trả vời trước đó sẽ được đánh dấu bởi hình vuông thay vì hình tròn",
    txt_ExerciseHelp8: "Nhấn %s để tạm thời bỏ qua câu hỏi hiện tại",
    txt_ExerciseHelp9: "Nhấn %s để quay lại danh sách các câu hỏi",
    txt_ExerciseHelp10: `Nhấn "%s" ở dưới để bắt đầu`,
    txt_ExerciseSearchText: "Bạn muốn tìm bài thi gì?",
    txt_ExerciseForceEnd: "Hết giờ làm bài, đang tính toán kết quả bài làm...",
    txt_exerciseNotFound: "Không tìm thấy bài thi liên quan",

    get: function (stringOrTxt: string, ...args) {
        let s = this[stringOrTxt] || stringOrTxt
        args.forEach(e => s = s.replace(/%s|%d/, () => e))
        return s
    }
}
export default o