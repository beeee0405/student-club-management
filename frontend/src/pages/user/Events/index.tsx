import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import Container from '../../../components/ui/Container';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useEvents } from '../../../hooks/useEvents';
import { assetUrl } from '../../../lib/utils';

const PublicEventsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useEvents({ page, limit, search });
  const total = data?.total ?? 0;
  const events = data?.events ?? [];
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <MainLayout>
      <div className="space-y-16 md:space-y-20 mt-[50px]">
        {/* Hero */}
        <Container size="wide">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Sự kiện nổi bật</h1>
            <p className="text-gray-600 text-lg md:text-xl">
              Theo dõi các sự kiện sắp diễn ra của các câu lạc bộ. Đừng bỏ lỡ những hoạt động thú vị!
            </p>

            <form onSubmit={onSubmitSearch} className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
              <Input
                placeholder="Tìm kiếm sự kiện..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-white border-2 h-12 text-base shadow-sm"
              />
              <Button type="submit" className="h-12 px-8 text-base font-semibold">Tìm</Button>
            </form>
          </div>
        </Container>

        {/* Events Grid */}
        <Container size="wide">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-96 rounded-2xl border-2 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const startDate = new Date(event.startDate);
                const isUpcoming = startDate > new Date();
                
                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="group w-full bg-white rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-2xl hover:border-emerald-300 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="relative h-56 overflow-hidden">
                      {event.image ? (
                        <img
                          src={assetUrl(event.image)}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
                          <span className="text-7xl">📅</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Date badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                          <div className="bg-emerald-600 text-white text-xs font-bold text-center py-1 px-3">
                            {startDate.toLocaleDateString('vi-VN', { month: 'short' }).toUpperCase()}
                          </div>
                          <div className="text-gray-900 text-2xl font-bold text-center py-2 px-3">
                            {startDate.getDate()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Status badge */}
                      {isUpcoming && (
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-600 text-white text-sm font-bold shadow-lg">
                            ⭐ Sắp diễn ra
                          </span>
                        </div>
                      )}
                      
                      {/* Location */}
                      {event.location && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/95 text-gray-800 text-sm font-bold shadow-lg backdrop-blur-sm">
                            📍 {event.location}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors mb-3">
                        {event.title}
                      </h2>
                      <p className="text-base text-gray-600 line-clamp-3 flex-1 leading-relaxed">{event.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500 font-medium">
                          CLB: <span className="text-emerald-600 font-semibold">{event.clubName}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                          Xem chi tiết →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy sự kiện nào.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-10 px-5"
              >
                Trước
              </Button>
              <span className="text-base font-semibold text-gray-700 px-4">
                Trang {page}/{totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-10 px-5"
              >
                Sau
              </Button>
            </div>
          )}
        </Container>
      </div>
    </MainLayout>
  );
};

export default PublicEventsPage;
