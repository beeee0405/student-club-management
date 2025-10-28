import UserLayout from '../../components/layout/UserLayout';

const UserDashboard = () => {
  return (
    <UserLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Trang của tôi</h1>
        <p className="text-muted-foreground">Đây là khu vực dành cho người dùng. Bạn có thể xem thông tin và cập nhật hồ sơ.</p>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
