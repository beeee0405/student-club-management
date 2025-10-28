import AdminLayout from '../../../components/layout/AdminLayout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useEffect, useMemo, useState } from 'react';
import UserFormDialog from '../../../components/forms/UserFormDialog';
import type { User } from '../../../lib/types';
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '../../../hooks/useUsers';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, refetch, isFetching } = useUsers({ page, limit, search: searchTerm });
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total]);

  useEffect(() => {
    // Khi thay đổi searchTerm, quay về trang 1
    setPage(1);
  }, [searchTerm]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSubmit = async (
    formData: { name: string; email: string; password: string; role: 'ADMIN' | 'USER' }
  ) => {
    if (selectedUser) {
      // When editing, password is optional
      const { password, ...rest } = formData;
      await updateUser.mutateAsync({ id: selectedUser.id, data: password ? formData : rest });
    } else {
      await createUser.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    setSelectedUser(null);
    refetch();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản người dùng và phân quyền</p>
          </div>
          <Button 
            onClick={() => {
              setSelectedUser(null);
              setIsDialogOpen(true);
            }}
          >
            Thêm người dùng
          </Button>
        </div>

        <UserFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          initialData={selectedUser || undefined}
          mode={selectedUser ? 'edit' : 'create'}
        />

        {/* Search and Filter */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Đang tải...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-600">
              Lỗi tải dữ liệu: {error instanceof Error ? error.message : String(error)}
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="w-16 font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="min-w-[180px] font-semibold text-gray-700">Tên</TableHead>
                    <TableHead className="min-w-[200px] font-semibold text-gray-700">Email</TableHead>
                    <TableHead className="w-28 font-semibold text-gray-700">Vai trò</TableHead>
                    <TableHead className="w-32 font-semibold text-gray-700">Ngày tạo</TableHead>
                    <TableHead className="w-44 font-semibold text-gray-700">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow 
                      key={user.id}
                      className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100/50'}
                    >
                      <TableCell className="font-medium text-gray-900">{user.id}</TableCell>
                      <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            user.role === 'ADMIN'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDialogOpen(true);
                            }}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              if (confirm(`Xóa người dùng ${user.email}?`)) {
                                await deleteUser.mutateAsync(user.id);
                                refetch();
                              }
                            }}
                          >
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-600">
            Tổng: <span className="font-semibold text-gray-900">{total}</span> người dùng {isFetching && <span className="text-gray-400">(đang cập nhật...)</span>}
          </div>
          <div className="flex gap-2 items-center">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </Button>
            <span className="text-sm text-gray-700 px-3">
              Trang <span className="font-semibold">{page}</span> / {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;