import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/Dialog';
import { Label } from '../../components/ui/Label';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import RichTextEditor from '../../components/ui/RichTextEditor';

const eventSchema = z.object({
  title: z.string().min(2, 'Tên sự kiện phải có ít nhất 2 ký tự'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  clubId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().min(2, 'Địa điểm phải có ít nhất 2 ký tự'),
});

type EventFormData = z.infer<typeof eventSchema> & {
  image?: File;
};

interface Club {
  id: number;
  name: string;
}

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
  mode: 'create' | 'edit';
  clubs: Club[]; // Danh sách câu lạc bộ để chọn
}

const EventFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
  clubs,
}: EventFormDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>(initialData?.description || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ...initialData,
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().slice(0, 16)
        : '',
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().slice(0, 16)
        : '',
    },
  });

  // Reset form values when switching between create/edit or when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        ...(initialData as any),
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString().slice(0, 16)
          : '',
        endDate: initialData.endDate
          ? new Date(initialData.endDate).toISOString().slice(0, 16)
          : '',
      });
      setDescription(initialData.description || '');
    } else {
      reset({
        title: '',
        description: '',
        clubId: undefined as any,
        startDate: '',
        endDate: '',
        location: '',
      } as any);
      setDescription('');
    }
  }, [initialData, reset]);

  // Cập nhật description trong form khi rich text editor thay đổi
  useEffect(() => {
    setValue('description', description);
  }, [description, setValue]);

  const startDate = watch('startDate');

  const onSubmitForm = async (data: EventFormData) => {
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
            {mode === 'create' ? 'Thêm sự kiện mới' : 'Chỉnh sửa sự kiện'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tên sự kiện</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Nhập tên sự kiện"
              className="bg-white border-gray-300 shadow-sm"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Mô tả về sự kiện..."
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clubId">Câu lạc bộ tổ chức</Label>
            <select
              id="clubId"
              {...register('clubId', { valueAsNumber: true })}
              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm"
            >
              <option value="">Chọn câu lạc bộ</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
            {errors.clubId && (
              <p className="text-sm text-red-500">{errors.clubId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Thời gian bắt đầu</Label>
              <Input
                id="startDate"
                type="datetime-local"
                {...register('startDate')}
                className="bg-white border-gray-300 shadow-sm"
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Thời gian kết thúc</Label>
              <Input
                id="endDate"
                type="datetime-local"
                {...register('endDate')}
                min={startDate} // Không cho chọn thời gian kết thúc trước thời gian bắt đầu
                className="bg-white border-gray-300 shadow-sm"
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Địa điểm</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Nhập địa điểm tổ chức"
              className="bg-white border-gray-300 shadow-sm"
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Ảnh sự kiện</Label>
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

export default EventFormDialog;