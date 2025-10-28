import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useRegister } from '../../hooks/useAuth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const registerMutation = useRegister();
  const [params] = useSearchParams();
  const mode = params.get('mode') === 'register' ? 'register' : 'login';
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await registerMutation.mutateAsync({ name, email, password });
      } else {
        await login(email, password);
      }
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data &&
        typeof err.response.data.message === 'string'
          ? err.response.data.message
          : 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout contentSize="full">
      {/* Căn giữa toàn màn hình */}
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md mx-auto rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          {/* Tabs */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-lg border p-1 bg-gray-50 shadow-sm">
              <Link
                to="/auth"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Đăng nhập
              </Link>
              <Link
                to="/auth?mode=register"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  mode === 'register'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Đăng ký
              </Link>
            </div>
          </div>

          {/* Tiêu đề */}
          <div className="space-y-2 text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'register' ? 'Tạo tài khoản mới' : 'Chào mừng trở lại'}
            </h1>
            <p className="text-sm text-gray-600">
              {mode === 'register'
                ? 'Nhập thông tin để đăng ký tài khoản.'
                : 'Nhập thông tin đăng nhập để truy cập tài khoản của bạn.'}
            </p>
          </div>

          {/* Lỗi */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Họ tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              className="w-full text-white bg-blue-600 hover:bg-blue-700 font-semibold py-2 rounded-lg transition-colors duration-200"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Đang xử lý...'
                : mode === 'register'
                ? 'Đăng ký'
                : 'Đăng nhập'}
            </Button>
          </form>

          {/* Liên kết */}
          <div className="text-center text-sm mt-6 text-gray-600">
            {mode === 'register' ? (
              <p>
                Đã có tài khoản?{' '}
                <Link
                  to="/auth"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            ) : (
              <p>
                Chưa có tài khoản?{' '}
                <Link
                  to="/auth?mode=register"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Đăng ký
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Auth;
