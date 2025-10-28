import UserLayout from '../../components/layout/UserLayout';

const ProfilePage = () => {
  // TODO: Wire to real user profile when API ready
  return (
    <UserLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Hồ sơ</h1>
        <p className="text-muted-foreground">Thông tin cá nhân và cài đặt tài khoản sẽ hiển thị tại đây.</p>
      </div>
    </UserLayout>
  );
};

export default ProfilePage;
