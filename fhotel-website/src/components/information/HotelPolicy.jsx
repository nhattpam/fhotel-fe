import React from 'react'

const HotelPolicy = () => {
    return (
        <>
            <div className="hotel-policies" style={{ textAlign: 'left' }}>
                <h3 style={{ fontWeight: 'bold' }}>Chính sách của khách</h3>

                <section>
                    <h4>Điều khoản và điều kiện chung</h4>
                    <ul>
                        <li>Khách chính phải trên 16 tuổi mới được nhận phòng tại khách sạn.</li>
                        <li>
                            Khách phải xuất trình giấy tờ tùy thân có ảnh hợp lệ khi nhận phòng. Các loại giấy tờ tùy thân được chấp nhận bao gồm:
                            <ul>
                                <li>Chứng minh nhân dân</li>
                                <li>Giấy phép lái xe</li>
                                <li>Hộ chiếu</li>
                            </ul>
                            Nếu không có ID hợp lệ, sẽ không được phép làm thủ tục nhận phòng.
                        </li>
                        <li>Khách sạn có quyền thực hiện hành động chống lại khách có hành vi không phù hợp sau khi điều tra.</li>
                        <li>Khách phải chịu trách nhiệm về mọi thiệt hại, ngoại trừ hao mòn thông thường, đối với tài sản của khách sạn. Phòng phải được giữ sạch sẽ và vệ sinh.</li>
                        <li>Khách có thể được liên hệ trước khi nhận phòng để xác nhận tình trạng hoặc thời gian đến. Nếu không liên lạc được, đặt phòng có thể bị giữ lại hoặc hủy bỏ.</li>
                        <li>FHotel có thể liên hệ với khách hàng để xin phản hồi nhằm cải thiện dịch vụ.</li>
                    </ul>
                </section>

                <section>
                    <h4>Chính sách gia hạn đặt phòng</h4>
                    <ul>
                        <li>Việc gia hạn đặt phòng tùy thuộc vào tình trạng phòng trống và giá phòng hiện tại, có thể khác với giá ban đầu.</li>
                    </ul>
                </section>

                <section>
                    <h4>Chính sách hủy bỏ</h4>
                    <p>Hủy đặt phòng FHotel nhanh chóng và dễ dàng. Dưới đây là thông tin chi tiết:</p>
                    <ul>
                        <li>Thời gian nhận phòng tiêu chuẩn là 2 giờ chiều và bạn có thể nhận phòng bất cứ lúc nào sau đó trong khi đặt phòng của bạn vẫn còn hiệu lực.</li>
                        <li>
                            <strong>Trước khi nhận phòng:</strong> Hủy miễn phí trước 24 giờ so với ngày nhận phòng. Sau đó, toàn bộ số tiền đặt phòng sẽ được hoàn 100%.
                        </li>
                        <li>
                            <strong>Vào ngày nhận phòng:</strong> Nếu bạn hủy hoặc không đến, toàn bộ số tiền đặt phòng sẽ không được hoàn lại.
                        </li>
                    </ul>
                </section>

                <section>
                    <h4>Chính sách thanh toán</h4>
                    <ul>
                        <li>Đối với kỳ nghỉ trên 7 đêm, bắt buộc thanh toán trước.</li>
                    </ul>
                </section>

                <section>
                    <h4>Trả phòng muộn</h4>
                    <table>
                        <thead>
                            <tr><th>Giờ trả phòng</th><th>Phí</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>12 PM - 2 PM</td><td>Miễn phí</td></tr>
                            <tr><td>2 PM trờ đi</td><td>100% của tỷ giá ngày hôm sau</td></tr>
                        </tbody>
                    </table>
                </section>

                <section>
                    <h4>Chính sách cụ thể của khách sạn</h4>
                    <ul>
                        <li>Tiện nghi và chính sách được liệt kê trên ứng dụng. Vui lòng xem lại trước khi đặt phòng.</li>
                        <li>Một số khách sạn có thể hạn chế khách vào phòng. Xác nhận với khách sạn trước khi mời khách.</li>
                    </ul>
                </section>
            </div>
            <style>
                {`
        /* HotelPolicies.css */

.hotel-policies {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
}

.hotel-policies h2 {
  text-align: center;
  color: #333;
}

.hotel-policies h3 {
  margin-top: 20px;
  color: #444;
  border-bottom: 2px solid #f0a500;
  padding-bottom: 5px;
}

.hotel-policies h4 {
  margin-top: 15px;
  color: #555;
  font-weight: bold;
}

.hotel-policies ul {
  list-style-type: disc;
  padding-left: 20px;
}

.hotel-policies ul ul {
  list-style-type: circle;
  padding-left: 20px;
}

.hotel-policies p {
  margin: 10px 0;
}

.hotel-policies table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.hotel-policies th, .hotel-policies td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.hotel-policies th {
  background-color: #f7f7f7;
  font-weight: bold;
}

.hotel-policies tr:nth-child(even) {
  background-color: #f9f9f9;
}

.hotel-policies tr:hover {
  background-color: #f1f1f1;
}

        `}
            </style>
        </>
    );


}

export default HotelPolicy