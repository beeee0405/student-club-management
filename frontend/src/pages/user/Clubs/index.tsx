import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import Container from '../../../components/ui/Container';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useClubs } from '../../../hooks/useClubs';
import { assetUrl } from '../../../lib/utils';

const PublicClubsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useClubs({ page, limit, search });
  const total = data?.total ?? 0;
  const clubs = data?.clubs ?? [];
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
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Khám phá Câu lạc bộ</h1>
            <p className="text-gray-600 text-lg md:text-xl">
              Tìm và tham gia các câu lạc bộ phù hợp với sở thích của bạn. Kết nối, học hỏi và tạo nên những kỷ niệm đáng nhớ.
            </p>

            <form onSubmit={onSubmitSearch} className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
              <Input
                placeholder="Tìm kiếm câu lạc bộ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-white border-2 h-12 text-base shadow-sm"
              />
              <Button type="submit" className="h-12 px-8 text-base font-semibold">Tìm</Button>
            </form>
          </div>
        </Container>

        {/* Clubs Grid */}
        <Container size="wide">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-96 rounded-2xl border-2 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : clubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clubs.map((club) => (
                <Link
                  key={club.id}
                  to={`/clubs/${club.id}`}
                  className="group w-full bg-white rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-2xl hover:border-blue-300 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    {club.image ? (
                      <img
                        src={assetUrl(club.image)}
                        alt={club.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <span className="text-7xl">🎓</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1.5 rounded-full bg-white/95 text-gray-800 text-sm font-bold shadow-lg backdrop-blur-sm">
                        👥 {club.memberCount} thành viên
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-white/95 text-gray-800 text-sm font-bold shadow-lg backdrop-blur-sm">
                        📅 {club.eventCount} sự kiện
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-3">
                      {club.name}
                    </h2>
                    <p className="text-base text-gray-600 line-clamp-3 flex-1 leading-relaxed">{club.description}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                        Xem chi tiết →
                      </span>
                      {club.facebookUrl && (
                        <a
                          href={club.facebookUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="ml-auto inline-flex items-center rounded-lg bg-blue-600 text-white text-sm font-semibold px-4 py-2 hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Facebook
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy câu lạc bộ nào.</p>
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

export default PublicClubsPage;
