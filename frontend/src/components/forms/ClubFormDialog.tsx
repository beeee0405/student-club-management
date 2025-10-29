import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/Dialog';
import { Label } from '../../components/ui/Label';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import RichTextEditor from '../../components/ui/RichTextEditor';

const clubSchema = z.object({
  name: z.string().min(2, 'Tên câu lạc bộ phải có ít nhất 2 ký tự'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  facebookUrl: z
    .string()
    .url('Đường dẫn Facebook không hợp lệ')
    .optional()
    .or(z.literal('')),
});

type ClubFormData = z.infer<typeof clubSchema> & {
  image?: File;
};

interface ClubFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClubFormData) => void;
  initialData?: Partial<ClubFormData>;
  mode: 'create' | 'edit';
}

const ClubFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: ClubFormDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>(initialData?.description || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
    defaultValues: initialData,
  });

  // Cập nhật form khi initialData thay đổi (mở dialog sửa)
  useEffect(() => {
    if (initialData) {
      reset(initialData as any);
      setDescription(initialData.description || '');
    } else {
      reset({ name: '', description: '', facebookUrl: '' } as any);
      setDescription('');
    }
  }, [initialData, reset]);

  // Cập nhật description trong form khi rich text editor thay đổi
  useEffect(() => {
    setValue('description', description);
  }, [description, setValue]);

  const onSubmitForm = async (data: ClubFormData) => {
    try {
      const submitData = { ...data, image: selectedFile || undefined };
      await onSubmit(submitData);
      onOpenChange(false);
      reset();
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Thêm câu lạc bộ mới' : 'Chỉnh sửa câu lạc bộ'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên câu lạc bộ</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Nhập tên câu lạc bộ"
              className="bg-white border-gray-300 shadow-sm"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Mô tả về câu lạc bộ..."
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebookUrl">Đường dẫn Facebook (tuỳ chọn)</Label>
            <Input
              id="facebookUrl"
              {...register('facebookUrl')}
              placeholder="https://www.facebook.com/ten-cau-lac-bo"
              className="bg-white border-gray-300 shadow-sm"
            />
            {errors.facebookUrl && (
              <p className="text-sm text-red-500">{errors.facebookUrl.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Ảnh đại diện</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              className="cursor-pointer bg-white border-gray-300 shadow-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Đã chọn: {selectedFile.name}
              </p>
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

export default ClubFormDialog;