import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import Button from '../../../components/ui/Button';
import { useEvent } from '../../../hooks/useEvents';
import { useClub } from '../../../hooks/useClubs';
import { assetUrl } from '../../../lib/utils';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);

  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const { data: club } = useClub(event?.clubId ?? 0);

  if (eventLoading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </MainLayout>
    );
  }

  if (!event) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sự kiện</h1>
          <Button asChild>
            <Link to="/events">Quay lại danh sách</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isUpcoming = startDate > new Date();
  const isOngoing = startDate <= new Date() && endDate >= new Date();

  return (
    <MainLayout>
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        {/* Hero Section */}
          <div className="relative">
          {event.image ? (
              <div className="w-full h-40 md:h-48 lg:h-56 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={assetUrl(event.image)}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
              <div className="w-full h-40 md:h-48 lg:h-56 rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center shadow-lg">
               <span className="text-7xl md:text-8xl">📅</span>
            </div>
          )}
          <div className="mt-4">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                  {isOngoing && (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      Đang diễn ra
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      Sắp tới
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{event.title}</h1>
                <div className="flex flex-wrap gap-4 text-lg text-gray-600 justify-center">
                  <span className="flex items-center gap-1.5">
                    📅 {startDate.toLocaleDateString('vi-VN', { dateStyle: 'long' })}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">📍 {event.location}</span>
                </div>
              <Button asChild variant="outline" className="h-12 px-6 text-base">
                <Link to="/#events">← Về trang chủ</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="bg-white border-2 border-emerald-100 rounded-2xl shadow-md p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Chi tiết sự kiện</h2>
          <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{event.description}</p>
        </section>

        {/* Event Info */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-emerald-100 rounded-2xl shadow-md p-6 md:p-8 space-y-4 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Thời gian</h3>
            <div className="space-y-3 text-base text-gray-700">
              <div>
                <span className="font-semibold">Bắt đầu:</span>{' '}
                {startDate.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
              <div>
                <span className="font-semibold">Kết thúc:</span>{' '}
                {endDate.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-emerald-100 rounded-2xl shadow-md p-6 md:p-8 space-y-4 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">Địa điểm</h3>
            <p className="text-base text-gray-700">{event.location}</p>
          </div>
        </section>

        {/* Club Info */}
        {club && (
          <section className="bg-white border-2 border-emerald-100 rounded-2xl shadow-md p-6 md:p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Tổ chức bởi</h2>
            <div className="flex flex-col items-center gap-6">
              {club.image && (
                <img
                  src={assetUrl(club.image)}
                  alt={club.name}
                  className="w-28 h-28 rounded-xl object-cover shadow-md shrink-0"
                />
              )}
              <div className="flex-1 space-y-4">
                <h3 className="font-bold text-xl md:text-2xl text-gray-900">{club.name}</h3>
                <p className="text-base text-gray-700 leading-relaxed">{club.description}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default EventDetailPage;
