import AdminLayout from '../../../components/layout/AdminLayout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useEffect, useMemo, useState } from 'react';
import EventFormDialog from '../../../components/forms/EventFormDialog';
import type { Event } from '../../../lib/types';
import { useCreateEvent, useDeleteEvent, useEvents, useUpdateEvent } from '../../../hooks/useEvents';
import { useClubs } from '../../../hooks/useClubs';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, refetch, isFetching } = useEvents({ page, limit, search: searchTerm });
  const { data: clubsData } = useClubs({ page: 1, limit: 100 });
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const events = data?.events ?? [];
  const total = data?.total ?? 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total]);
  const clubs = clubsData?.clubs ?? [];

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getEventStatus = (startDate: string, endDate: string): string => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'sắp tới';
    if (now > end) return 'hoàn thành';
    return 'đang diễn ra';
  };

  const getStatusBadgeClass = (startDate: string, endDate: string) => {
    const status = getEventStatus(startDate, endDate);
    switch (status) {
      case 'sắp tới':
        return 'bg-blue-100 text-blue-800';
      case 'đang diễn ra':
        return 'bg-green-100 text-green-800';
      case 'hoàn thành':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    clubId: number;
    startDate: string;
    endDate: string;
    location: string;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('clubId', String(data.clubId));
    formData.append('startDate', new Date(data.startDate).toISOString());
    formData.append('endDate', new Date(data.endDate).toISOString());
    formData.append('location', data.location);
    if (data.image) {
      formData.append('image', data.image);
    }

    if (selectedEvent) {
      await updateEvent.mutateAsync({ id: selectedEvent.id, data: formData });
    } else {
      await createEvent.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    setSelectedEvent(null);
    refetch();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý sự kiện</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi các sự kiện của câu lạc bộ</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>Thêm sự kiện</Button>
        </div>

        <EventFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          initialData={
            selectedEvent
              ? {
                  title: selectedEvent.title,
                  description: selectedEvent.description,
                  clubId: selectedEvent.clubId,
                  startDate: selectedEvent.startDate,
                  endDate: selectedEvent.endDate,
                  location: selectedEvent.location,
                }
              : undefined
          }
          mode={selectedEvent ? 'edit' : 'create'}
          clubs={clubs}
        />

        {/* Search and Filter */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Tìm kiếm theo tên sự kiện hoặc CLB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Events Table */}
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
                    <TableHead className="min-w-[200px] font-semibold text-gray-700">Tên sự kiện</TableHead>
                    <TableHead className="w-40 font-semibold text-gray-700">CLB tổ chức</TableHead>
                    <TableHead className="w-40 font-semibold text-gray-700">Thời gian bắt đầu</TableHead>
                    <TableHead className="w-40 font-semibold text-gray-700">Thời gian kết thúc</TableHead>
                    <TableHead className="w-32 font-semibold text-gray-700">Địa điểm</TableHead>
                    <TableHead className="w-28 font-semibold text-gray-700">Trạng thái</TableHead>
                    <TableHead className="w-44 font-semibold text-gray-700">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event, index) => (
                    <TableRow 
                      key={event.id}
                      className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100/50'}
                    >
                      <TableCell className="font-medium text-gray-900">{event.id}</TableCell>
                      <TableCell className="font-medium text-gray-900">{event.title}</TableCell>
                      <TableCell className="text-gray-600">{event.clubName}</TableCell>
                      <TableCell className="text-gray-600">{formatDateTime(event.startDate)}</TableCell>
                      <TableCell className="text-gray-600">{formatDateTime(event.endDate)}</TableCell>
                      <TableCell className="text-gray-600">{event.location}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(
                            event.startDate,
                            event.endDate
                          )}`}
                        >
                          {getEventStatus(event.startDate, event.endDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsDialogOpen(true);
                            }}
                          >
                            Chi tiết
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              if (confirm(`Xóa sự kiện "${event.title}"?`)) {
                                await deleteEvent.mutateAsync(event.id);
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
            Tổng: <span className="font-semibold text-gray-900">{total}</span> sự kiện {isFetching && <span className="text-gray-400">(đang cập nhật...)</span>}
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

export default EventsPage;