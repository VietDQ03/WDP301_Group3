import { Result } from "antd";
import { Link } from "react-router-dom";
import Header from "../../components/UserP/Header";
import Footer from "../../components/UserP/Footer";
import CustomButton from "../../components/Other/CustomButton";

const NotFound = () => {
  return (
    <div>
      <Header />

      <div
        style={{
          minHeight: '62vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Result
          status="404"
          title="404"
          subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
          extra={
            <Link to="/">
              <CustomButton style={{ width: "100%" }} type="primary">Quay lại trang chủ </CustomButton>
            </Link>
          }
        />
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
