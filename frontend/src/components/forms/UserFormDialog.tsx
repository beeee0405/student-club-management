import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/Dialog';
import { Label } from '../../components/ui/Label';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const userSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  role: z.enum(['ADMIN', 'USER']),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: Partial<UserFormData>;
  mode: 'create' | 'edit';
}

const UserFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: UserFormDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
  });

  const onSubmitForm = async (data: UserFormData) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Nhập tên người dùng"
              className="bg-white border-gray-300 shadow-sm"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="email@example.com"
              className="bg-white border-gray-300 shadow-sm"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {mode === 'create' && (
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="bg-white border-gray-300 shadow-sm"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Vai trò</Label>
            <select
              id="role"
              {...register('role')}
              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm"
            >
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : mode === 'create' ? 'Thêm' : 'Lưu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;