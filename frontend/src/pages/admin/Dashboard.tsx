import AdminLayout from '../../components/layout/AdminLayout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { useUsers } from '../../hooks/useUsers';
import { useClubs } from '../../hooks/useClubs';
import { useUpcomingEvents } from '../../hooks/useEvents';

const Dashboard = () => {
  // Lấy dữ liệu thật từ API
  const { data: usersData } = useUsers({ page: 1, limit: 1 });
  const { data: clubsData } = useClubs({ page: 1, limit: 1 });
  const { data: upcomingEvents } = useUpcomingEvents(10);

  const totalUsers = usersData?.total ?? 0;
  const totalClubs = clubsData?.total ?? 0;
  const upcomingEventsCount = upcomingEvents?.length ?? 0;

  const stats = [
    { name: 'Câu lạc bộ năng động', value: totalClubs.toString() },
    { name: 'Sự kiện sắp tới', value: upcomingEventsCount.toString() },
    { name: 'Tổng số thành viên', value: totalUsers.toString() },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng quan về hoạt động của hệ thống</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.name}</div>
            </div>
          ))}
        </div>

        {/* Recent Events Table */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sự kiện sắp diễn ra</h2>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {!upcomingEvents || upcomingEvents.length === 0 ? (
              <div className="p-8 text-sm text-gray-500 text-center">
                Chưa có sự kiện sắp diễn ra
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Tên sự kiện</TableHead>
                      <TableHead className="font-semibold text-gray-700">Câu lạc bộ</TableHead>
                      <TableHead className="font-semibold text-gray-700">Ngày bắt đầu</TableHead>
                      <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingEvents.map((event, index) => (
                      <TableRow 
                        key={event.id}
                        className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100/50'}
                      >
                        <TableCell className="font-medium text-gray-900">{event.title}</TableCell>
                        <TableCell className="text-gray-600">{event.clubName}</TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(event.startDate).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Sắp tới
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;