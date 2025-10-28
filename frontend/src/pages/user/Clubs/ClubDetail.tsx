import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import Button from '../../../components/ui/Button';
import { useClub, useClubMembers } from '../../../hooks/useClubs';
import { useClubEvents } from '../../../hooks/useEvents';
import { assetUrl } from '../../../lib/utils';

const ClubDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const clubId = Number(id);

  const { data: club, isLoading: clubLoading } = useClub(clubId);
  const { data: members = [], isLoading: membersLoading } = useClubMembers(clubId);
  const { data: events = [], isLoading: eventsLoading } = useClubEvents(clubId);

  if (clubLoading) {
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

  if (!club) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy câu lạc bộ</h1>
          <Button asChild>
            <Link to="/clubs">Quay lại danh sách</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout contentSize="wide">
      <div className="space-y-8 md:space-y-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center">
          {club.image ? (
            <div className="w-full max-w-3xl h-56 md:h-64 lg:h-72 rounded-2xl overflow-hidden bg-white border border-gray-200 shadow">
              <img
                src={assetUrl(club.image)}
                alt={club.name}
                className="w-full h-full object-contain p-4 md:p-6"
              />
            </div>
          ) : (
            <div className="w-full max-w-3xl h-56 md:h-64 lg:h-72 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow">
              <span className="text-7xl md:text-8xl">🎓</span>
            </div>
          )}
          <div className="mt-6 w-full">
            <div className="flex flex-col items-center text-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{club.name}</h1>
              <div className="flex items-center gap-4 text-base text-gray-600">
                <span className="font-semibold">{club.memberCount} thành viên</span>
                <span>·</span>
                <span className="font-semibold">{club.eventCount} sự kiện</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                {club.facebookUrl && (
                  <a
                    href={club.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full bg-blue-600 text-white text-sm font-bold px-4 py-2 hover:bg-blue-700 transition shadow"
                  >
                    Trang Facebook CLB
                  </a>
                )}
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Đăng ký thành viên
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/#clubs">← Về trang chủ</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <section>
          <div className="bg-white border-2 border-blue-100 rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Giới thiệu</h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed whitespace-pre-wrap">{club.description}</p>
          </div>
        </section>

        {/* Events */}
        <section>
          <div className="bg-white border-2 border-blue-100 rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Sự kiện của câu lạc bộ</h2>
            {eventsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    {event.image ? (
                      <img
                        src={assetUrl(event.image)}
                        alt={event.title}
                        className="w-full h-36 md:h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-36 md:h-40 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                        <span className="text-4xl md:text-5xl">📅</span>
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <div className="text-xs font-semibold text-blue-600">
                        {new Date(event.startDate).toLocaleDateString('vi-VN')}
                      </div>
                      <h3 className="font-bold text-lg line-clamp-1 text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-base md:text-lg">Chưa có sự kiện nào.</p>
            )}
          </div>
        </section>

        {/* Members */}
        <section>
          <div className="bg-white border-2 border-blue-100 rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Thành viên ({club.memberCount})</h2>
            {membersLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : members.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {members.map((member) => (
                  <div key={member.id} className="border-2 border-gray-200 rounded-xl p-4 space-y-1 hover:border-blue-200 transition">
                    <div className="font-bold text-base text-gray-900">{member.user?.name || member.user?.email}</div>
                    <div className="text-sm text-gray-600">{member.role || 'Thành viên'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-base md:text-lg">Chưa có thành viên nào.</p>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ClubDetailPage;
