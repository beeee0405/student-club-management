import AdminLayout from '../../../components/layout/AdminLayout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useEffect, useMemo, useState } from 'react';
import ClubFormDialog from '../../../components/forms/ClubFormDialog';
import type { Club } from '../../../lib/types';
import { useClubs, useCreateClub, useDeleteClub, useUpdateClub } from '../../../hooks/useClubs';

const ClubsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, refetch, isFetching } = useClubs({ page, limit, search: searchTerm });
  const createClub = useCreateClub();
  const updateClub = useUpdateClub();
  const deleteClub = useDeleteClub();

  const clubs = data?.clubs ?? [];
  const total = data?.total ?? 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const handleSubmit = async (formInput: {
    name: string;
    description: string;
    facebookUrl?: string;
    type: 'STUDENT' | 'FACULTY';
    faculty?: string;
    image?: File;
  }) => {
    try {
      const formData = new FormData();
      formData.append('name', formInput.name);
      formData.append('description', formInput.description);
      formData.append('type', formInput.type);
      if (formInput.facebookUrl) {
        formData.append('facebookUrl', formInput.facebookUrl);
      }
      if (formInput.faculty) {
        formData.append('faculty', formInput.faculty);
      }
      if (formInput.image) {
        formData.append('image', formInput.image);
      }

      if (selectedClub) {
        await updateClub.mutateAsync({ id: selectedClub.id, data: formData });
      } else {
        await createClub.mutateAsync(formData);
      }
      
      setIsDialogOpen(false);
      setSelectedClub(null);
      refetch();
    } catch (error) {
      console.error('Failed to submit club:', error);
      // Don't close dialog on error, let user see the error and retry
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý câu lạc bộ</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý thông tin và hoạt động của các câu lạc bộ</p>
          </div>
          <Button
            onClick={() => {
              setSelectedClub(null);
              setIsDialogOpen(true);
            }}
          >
            Thêm câu lạc bộ
          </Button>
        </div>

        <ClubFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          initialData={
            selectedClub
              ? {
                  name: selectedClub.name,
                  description: selectedClub.description,
                  facebookUrl: selectedClub.facebookUrl,
                  type: selectedClub.type,
                  faculty: selectedClub.faculty,
                }
              : undefined
          }
          mode={selectedClub ? 'edit' : 'create'}
        />

        {/* Search and Filter */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Tìm kiếm theo tên câu lạc bộ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Clubs Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Đang tải...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-600">
              Lỗi tải dữ liệu: {error instanceof Error ? error.message : String(error)}
            </div>
          ) : clubs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Chưa có câu lạc bộ nào. Hãy thêm mới!
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="w-16 font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="min-w-[200px] font-semibold text-gray-700">Tên CLB</TableHead>
                    <TableHead className="min-w-[300px] font-semibold text-gray-700">Mô tả</TableHead>
                    <TableHead className="min-w-[200px] font-semibold text-gray-700">Facebook</TableHead>
                    <TableHead className="w-32 text-center font-semibold text-gray-700">Sự kiện</TableHead>
                    <TableHead className="w-32 font-semibold text-gray-700">Ngày tạo</TableHead>
                    <TableHead className="w-44 font-semibold text-gray-700">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clubs.map((club, index) => (
                    <TableRow 
                      key={club.id}
                      className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100/50'}
                    >
                      <TableCell className="font-medium text-gray-900">{club.id}</TableCell>
                      <TableCell className="font-medium text-gray-900">{club.name}</TableCell>
                      <TableCell className="max-w-md truncate text-gray-600">{club.description}</TableCell>
                      <TableCell className="max-w-sm truncate text-blue-700">
                        {club.facebookUrl ? (
                          <a href={club.facebookUrl} target="_blank" rel="noreferrer" className="hover:underline">
                            {club.facebookUrl}
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                          {club.eventCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">{new Date(club.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedClub(club);
                              setIsDialogOpen(true);
                            }}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              if (confirm(`Xóa câu lạc bộ "${club.name}"?`)) {
                                await deleteClub.mutateAsync(club.id);
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
            Tổng: <span className="font-semibold text-gray-900">{total}</span> câu lạc bộ {isFetching && <span className="text-gray-400">(đang cập nhật...)</span>}
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

export default ClubsPage;