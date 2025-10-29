import MainLayout from '../../components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useClubs } from '../../hooks/useClubs';
import { useEvents } from '../../hooks/useEvents';
import { MapPin, Phone, Mail, Facebook } from 'lucide-react';
import { useRef, useState } from 'react';
import { assetUrl, cn } from '../../lib/utils';
import Section from '../../components/ui/Section';
import Skeleton from '../../components/ui/Skeleton';

const Home = () => {
  const { user } = useAuth();
  const CLUBS_PER_PAGE = 6;
  const [studentClubsPage, setStudentClubsPage] = useState(1);
  const [facultyClubsPage, setFacultyClubsPage] = useState(1);
  
  // CLB sinh viên
  const { data: studentClubsData, isLoading: loadingStudentClubs } = useClubs({ page: studentClubsPage, limit: CLUBS_PER_PAGE, type: 'STUDENT' });
  
  // CLB Trường/Khoa/Viện
  const { data: facultyClubsData, isLoading: loadingFacultyClubs } = useClubs({ page: facultyClubsPage, limit: CLUBS_PER_PAGE, type: 'FACULTY' });
  
  const { data: eventsData, isLoading: loadingEvents } = useEvents({ page: 1, limit: 12 });
  const eventsScrollerRef = useRef<HTMLDivElement | null>(null);
  const [expandedClubId, setExpandedClubId] = useState<number | null>(null);

  const getGridCols = (count: number) => {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  const studentClubsGridCols = getGridCols(studentClubsData?.clubs?.length ?? 0);
  const facultyClubsGridCols = getGridCols(facultyClubsData?.clubs?.length ?? 0);
  const studentClubsTotalPages = Math.max(1, Math.ceil((studentClubsData?.total ?? 0) / CLUBS_PER_PAGE));
  const facultyClubsTotalPages = Math.max(1, Math.ceil((facultyClubsData?.total ?? 0) / CLUBS_PER_PAGE));

  return (
    <MainLayout>
      <div className="space-y-40 md:space-y-48 overflow-x-hidden">
        {/* ===== Banner Section ===== */}
        <section className="relative w-full h-[450px] md:h-[550px] overflow-hidden">
          <img
            src="/images/tdmu-campus.jpg"
            alt="TDMU Campus"
            className="w-full h-full object-cover brightness-[0.85]"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.src = '/images/nen.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-blue-800/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="px-6 text-white">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-xl leading-tight">
                CÂU LẠC BỘ SINH VIÊN<br />TRƯỜNG ĐẠI HỌC THỦ DẦU MỘT
              </h1>
              {/* CTA buttons removed per request */}
            </div>
          </div>
        </section>

        {/* ===== Clubs Title Section (moved up) ===== */}
  <div className="flex flex-col items-center gap-6 mt-2 mb-2 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 relative inline-block">
            CLB/Đội/Nhóm trực thuộc TDMU
            <span className="absolute left-1/2 -bottom-2 w-24 h-1 bg-blue-600 -translate-x-1/2 rounded-full"></span>
          </h2>
          <p className="text-gray-500 text-lg md:text-xl">
            Cùng nhau kết nối, phát triển đam mê và tạo nên những kỷ niệm đáng nhớ tại TDMU
          </p>
        </div>

  {/* ===== Student Clubs (CLB Sinh viên) ===== */}
  <Section id="clubs" tone="white" paddingY="sm">
          <div className="flex flex-col items-center text-center gap-16 md:gap-20">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">CLB/Đội/Nhóm Sinh viên</h3>

            {/* danh sách CLB sinh viên */}
            {loadingStudentClubs ? (
              <div className={`grid ${studentClubsGridCols} gap-10 justify-items-center w-full`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-full max-w-lg bg-white rounded-2xl border p-8 md:p-10">
                    <div className="flex flex-col items-center text-center gap-4">
                      <Skeleton className="h-32 w-32 rounded-full" />
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : studentClubsData?.clubs?.length ? (
              <>
                <div className={`grid ${studentClubsGridCols} gap-10 justify-items-center`}>
                  {studentClubsData.clubs.map((club) => (
                    <div
                      key={club.id}
                      className="group relative w-full max-w-lg bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-8 md:p-10 flex flex-col items-center text-center min-h-[340px] overflow-hidden animate-fade-up"
                    >
                      <div className="relative w-32 h-32 md:w-36 md:h-36 mb-6 ring-4 ring-blue-50 rounded-full overflow-hidden">
                        {club.image ? (
                          <img src={assetUrl(club.image)} alt={club.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-2xl font-bold">
                            {club.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-xl md:text-2xl text-gray-900 line-clamp-2 min-h-[3.5rem] md:min-h-[4rem]">{club.name}</h3>
                      
                      {/* Preview box with expand-on-click */}
                      <div className="relative w-full mt-4 pb-10">
                        <div
                          className={cn(
                            'relative rounded-xl border-2 px-5 py-4 text-left transition-all duration-500 ease-in-out',
                            expandedClubId === club.id 
                              ? 'max-h-[32rem] overflow-y-auto border-blue-300 bg-white shadow-lg' 
                              : 'max-h-20 overflow-hidden border-gray-200 bg-gray-50'
                          )}
                          aria-label={`Giới thiệu ${club.name}`}
                        >
                          <div className={cn(
                            'text-gray-700 leading-relaxed',
                            expandedClubId === club.id ? 'text-base prose prose-sm max-w-none' : 'text-sm'
                          )}>
                            <span className="font-semibold">Giới thiệu: </span>
                            {expandedClubId === club.id ? (
                              <div dangerouslySetInnerHTML={{ __html: club.description }} />
                            ) : (
                              <span className="align-middle whitespace-pre-wrap line-clamp-2">
                                {club.description.replace(/<[^>]*>/g, '')}
                              </span>
                            )}
                          </div>

                          {/* Bottom gradient when collapsed */}
                          {expandedClubId !== club.id && (
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent" />
                          )}
                        </div>

                        {/* Toggle button */}
                        <button
                          type="button"
                          onClick={() => setExpandedClubId(expandedClubId === club.id ? null : club.id)}
                          className="absolute bottom-2 right-3 inline-flex items-center rounded-full bg-blue-600 text-white text-sm font-semibold px-4 py-2 shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
                        >
                          {expandedClubId === club.id ? '✕ Thu gọn' : '📖 Xem đầy đủ'}
                        </button>
                      </div>
                        {club.facebookUrl && (
                          <div className="mt-5">
                            <a
                              href={club.facebookUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center rounded-full bg-blue-600 text-white text-sm font-semibold px-4 py-2 hover:bg-blue-700 transition shadow-md"
                            >
                              Trang Facebook CLB
                            </a>
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                {studentClubsTotalPages > 1 && (
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStudentClubsPage((p) => Math.max(1, p - 1))}
                      disabled={studentClubsPage === 1}
                      className="px-4 py-2 rounded-full border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      aria-label="Trang trước"
                    >
                      ← Trước
                    </button>
                    <span className="text-sm text-gray-600">
                      Trang {studentClubsPage}/{studentClubsTotalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStudentClubsPage((p) => Math.min(studentClubsTotalPages, p + 1))}
                      disabled={studentClubsPage === studentClubsTotalPages}
                      className="px-4 py-2 rounded-full border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      aria-label="Trang sau"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center">Chưa có CLB sinh viên nào.</p>
            )}
          </div>
        </Section>

  {/* ===== Faculty Clubs (CLB Trường/Khoa/Viện) ===== */}
  <Section id="faculty-clubs" tone="muted" paddingY="sm">
          <div className="flex flex-col items-center text-center gap-16 md:gap-20">
            <div className="flex flex-col items-center gap-6 mt-2">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 relative inline-block">
                Câu lạc bộ theo Trường/Khoa/Viện trực thuộc TDMU
                <span className="absolute left-1/2 -bottom-2 w-24 h-1 bg-blue-600 -translate-x-1/2 rounded-full"></span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl">
                Các CLB học thuật, kỹ năng và chuyên môn trực thuộc Đoàn - Hội cơ sở
              </p>
            </div>

            {/* Danh sách CLB Trường/Khoa/Viện */}
            {loadingFacultyClubs ? (
              <div className={`grid ${facultyClubsGridCols} gap-10 justify-items-center w-full`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-full max-w-lg bg-white rounded-2xl border p-8 md:p-10">
                    <div className="flex flex-col items-center text-center gap-4">
                      <Skeleton className="h-32 w-32 rounded-full" />
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : facultyClubsData?.clubs?.length ? (
              <>
                <div className={`grid ${facultyClubsGridCols} gap-10 justify-items-center w-full`}>
                  {facultyClubsData.clubs.map((club) => (
                    <div
                      key={club.id}
                      className="group relative w-full max-w-lg bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-8 md:p-10 flex flex-col items-center text-center min-h-[340px] overflow-hidden animate-fade-up"
                    >
                      <div className="relative w-32 h-32 md:w-36 md:h-36 mb-6 ring-4 ring-orange-50 rounded-full overflow-hidden">
                        {club.image ? (
                          <img src={assetUrl(club.image)} alt={club.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-2xl font-bold">
                            {club.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      {club.faculty && (
                        <div className="text-xs text-orange-600 font-semibold mb-2 bg-orange-50 px-3 py-1 rounded-full">
                          {club.faculty}
                        </div>
                      )}
                      <h3 className="font-semibold text-xl md:text-2xl text-gray-900 line-clamp-2 min-h-[3.5rem] md:min-h-[4rem]">{club.name}</h3>
                      
                      {/* Preview box with expand-on-click */}
                      <div className="relative w-full mt-4 pb-10">
                        <div
                          className={cn(
                            'relative rounded-xl border-2 px-5 py-4 text-left transition-all duration-500 ease-in-out',
                            expandedClubId === club.id 
                              ? 'max-h-[32rem] overflow-y-auto border-orange-300 bg-white shadow-lg' 
                              : 'max-h-20 overflow-hidden border-gray-200 bg-gray-50'
                          )}
                          aria-label={`Giới thiệu ${club.name}`}
                        >
                          <div className={cn(
                            'text-gray-700 leading-relaxed',
                            expandedClubId === club.id ? 'text-base prose prose-sm max-w-none' : 'text-sm'
                          )}>
                            <span className="font-semibold">Giới thiệu: </span>
                            {expandedClubId === club.id ? (
                              <div dangerouslySetInnerHTML={{ __html: club.description }} />
                            ) : (
                              <span className="align-middle whitespace-pre-wrap line-clamp-2">
                                {club.description.replace(/<[^>]*>/g, '')}
                              </span>
                            )}
                          </div>

                          {/* Bottom gradient when collapsed */}
                          {expandedClubId !== club.id && (
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent" />
                          )}
                        </div>

                        {/* Toggle button */}
                        <button
                          type="button"
                          onClick={() => setExpandedClubId(expandedClubId === club.id ? null : club.id)}
                          className="absolute bottom-2 right-3 inline-flex items-center rounded-full bg-orange-600 text-white text-sm font-semibold px-4 py-2 shadow-md hover:bg-orange-700 hover:shadow-lg transition-all"
                        >
                          {expandedClubId === club.id ? '✕ Thu gọn' : '📖 Xem đầy đủ'}
                        </button>
                      </div>
                        {club.facebookUrl && (
                          <div className="mt-5">
                            <a
                              href={club.facebookUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center rounded-full bg-orange-600 text-white text-sm font-semibold px-4 py-2 hover:bg-orange-700 transition shadow-md"
                            >
                              Trang Facebook CLB
                            </a>
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                {facultyClubsTotalPages > 1 && (
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFacultyClubsPage((p) => Math.max(1, p - 1))}
                      disabled={facultyClubsPage === 1}
                      className="px-4 py-2 rounded-full border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      aria-label="Trang trước"
                    >
                      ← Trước
                    </button>
                    <span className="text-sm text-gray-600">
                      Trang {facultyClubsPage}/{facultyClubsTotalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFacultyClubsPage((p) => Math.min(facultyClubsTotalPages, p + 1))}
                      disabled={facultyClubsPage === facultyClubsTotalPages}
                      className="px-4 py-2 rounded-full border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      aria-label="Trang sau"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center">Chưa có CLB Trường/Khoa/Viện nào.</p>
            )}
          </div>
        </Section>

  {/* ===== Events Section ===== */}
  <Section id="events" tone="white" paddingY="sm">
          <div className="flex flex-col items-center text-center gap-16 md:gap-20">
            <div className="flex flex-col items-center gap-6 mt-2">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 relative inline-block">
                Sự kiện sắp diễn ra
                <span className="absolute left-1/2 -bottom-2 w-24 h-1 bg-blue-600 -translate-x-1/2 rounded-full"></span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl">
                Các sự kiện mới nhất từ các CLB
              </p>
            </div>

            {loadingEvents ? (
              <div className="flex gap-4 w-full">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="min-w-[280px] md:min-w-[360px] max-w-sm rounded-xl overflow-hidden border p-4 bg-white">
                    <Skeleton className="h-44 md:h-48 w-full" />
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : eventsData?.events?.length ? (
              <div className="relative w-full">
                {/* Gradient edges to hint scroll */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent" />

                {/* Horizontal scroller */}
                <div
                  ref={eventsScrollerRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 pb-2"
                >
                  {eventsData.events.map((event) => (
                    <div
                      key={event.id}
                      className="snap-start min-w-[280px] md:min-w-[360px] max-w-sm group rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                    >
                      <Link to={`/events/${event.id}`}>
                        {event.image && (
                          <div className="relative h-44 md:h-48">
                            <img
                              src={assetUrl(event.image)}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
                              {new Date(event.startDate).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                              })}
                            </div>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Removed "View all" button since listing page is no longer used */}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Chưa có sự kiện nào. {user?.role === 'ADMIN' && 'Hãy tạo sự kiện đầu tiên!'}
              </p>
            )}
          </div>
        </Section>

  {/* ===== Contact Section ===== */}
  <Section id="contact" tone="muted" paddingY="sm">
          <div className="flex flex-col items-center text-center gap-10 md:gap-14">
            <div className="flex flex-col items-center gap-4 mt-2">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 relative inline-block">
                Liên hệ
                <span className="absolute left-1/2 -bottom-2 w-24 h-1 bg-blue-600 -translate-x-1/2 rounded-full"></span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-3xl">
                Mọi thắc mắc về hoạt động Đoàn - Hội và các Câu lạc bộ, vui lòng liên hệ các kênh bên dưới.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl text-left">
              {/* Info cards */}
              <div className="space-y-6">
                <div className="rounded-2xl border-2 border-blue-100 bg-white p-6 shadow">
                  <h3 className="text-2xl font-bold text-gray-900">Đoàn Thanh niên – Hội Sinh viên TDMU</h3>
                  <div className="mt-4 space-y-3 text-gray-700">
                    <div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <span>Số 06, đường Trần Văn Ơn, phường Phú Lợi, Thành phố Hồ Chí Minh</span>
                    </div>
                    <a href="tel:0878608688" className="flex items-center gap-3 hover:text-blue-700 transition">
                      <Phone className="h-5 w-5 text-blue-600" /> 0878 60 86 88
                    </a>
                    <a href="mailto:doanthanhnien@tdmu.edu.vn" className="flex items-center gap-3 hover:text-blue-700 transition">
                      <Mail className="h-5 w-5 text-blue-600" /> doanthanhnien@tdmu.edu.vn
                    </a>
                    <a href="mailto:hoisinhvien@tdmu.edu.vn" className="flex items-center gap-3 hover:text-blue-700 transition">
                      <Mail className="h-5 w-5 text-blue-600" /> hoisinhvien@tdmu.edu.vn
                    </a>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href="https://www.facebook.com/tuoitredhthudaumot" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 shadow-md">
                      <Facebook className="h-5 w-5" /> Đoàn Thanh niên TDMU
                    </a>
                    <a href="https://www.facebook.com/hsvdhtdm" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 shadow-md">
                      <Facebook className="h-5 w-5" /> Hội Sinh viên TDMU
                    </a>
                    <a href="https://tuoitre.tdmu.edu.vn/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-green-700 shadow-md">
                      🌐 Website Tuổi Trẻ TDMU
                    </a>
                  </div>
                </div>
              </div>

              {/* Embedded map */}
              <div className="rounded-2xl overflow-hidden border-2 border-blue-100 bg-white shadow">
                <iframe
                  title="Bản đồ TDMU"
                  src="https://www.google.com/maps?q=10.980763,106.674973&z=16&output=embed"
                  className="w-full h-[320px] md:h-[420px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </Section>

      </div>
    </MainLayout>
  );
};

export default Home;
