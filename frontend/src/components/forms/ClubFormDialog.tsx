import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/Dialog';
import { Label } from '../../components/ui/Label';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import RichTextEditor from '../../components/ui/RichTextEditor';

type ClubFormData = {
  name: string;
  description: string; // Required - validated manually in onSubmitForm
  facebookUrl?: string;
  type: 'STUDENT' | 'FACULTY';
  faculty?: string;
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
  const [serverError, setServerError] = useState<string>('');
  const [description, setDescription] = useState<string>(initialData?.description || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    clearErrors,
  } = useForm<ClubFormData>({
    // Validate manually in onSubmitForm to handle RichTextEditor state
    defaultValues: initialData as any,
    mode: 'onSubmit',
  });

  const clubType = watch('type');

  // Cập nhật form khi initialData thay đổi (mở dialog sửa)
  // Cập nhật form khi initialData thay đổi (mở dialog sửa)
  useEffect(() => {
    if (open) {
      // Reset form và clear errors khi dialog mở
      clearErrors();
      setServerError('');
      if (initialData) {
        reset(initialData as any);
        setDescription(initialData.description || '');
      } else {
        reset({ name: '', description: '', facebookUrl: '', type: 'STUDENT', faculty: '' } as any);
        setDescription('');
      }
    }
  }, [open, initialData, reset, clearErrors]);
  // Cập nhật description trong form khi rich text editor thay đổi
  useEffect(() => {
    setValue('description', description, { shouldValidate: false, shouldDirty: false });
  }, [description, setValue]);

  const onSubmitForm = async (data: ClubFormData) => {
    try {
      setServerError('');
      clearErrors();
      
      // Manual validation
      if (!data.name || data.name.trim().length < 2) {
        setServerError('Tên câu lạc bộ phải có ít nhất 2 ký tự');
        return;
      }
      
      // Validate description from RichTextEditor state
      const trimmedDescription = description.replace(/<[^>]*>/g, '').trim();
      if (!trimmedDescription || trimmedDescription.length < 1) {
        setServerError('Mô tả không được để trống');
        return;
      }
      
      // Ensure description is synced from rich text editor
      const submitData = { 
        ...data, 
        description: description, // Use state value from RichTextEditor
        image: selectedFile || undefined 
      };
      
      // Debug log - detailed
      console.log('=== SUBMITTING CLUB DATA ===');
      console.log('Form data from react-hook-form:', data);
      console.log('Description from state:', description);
      console.log('Trimmed description:', trimmedDescription);
      console.log('Final submit data:', submitData);
      console.log('===========================');
      
      await onSubmit(submitData);
      onOpenChange(false);
      reset();
      setSelectedFile(null);
      setDescription('');
      clearErrors();
    } catch (error) {
      console.error('Failed to submit form:', error);
      // Try show server message if available (Axios-style error)
      try {
        // @ts-expect-error dynamic
        const message = error?.response?.data?.message || 'Lưu thất bại, vui lòng thử lại.';
        setServerError(String(message));
      } catch {
        setServerError('Lưu thất bại, vui lòng thử lại.');
      }
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

        {(serverError || Object.keys(errors).length > 0) && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            <strong>Vui lòng kiểm tra lại:</strong>
            <ul className="list-disc list-inside mt-1">
              {serverError && <li>{serverError}</li>}
              {errors.name && <li>{errors.name.message}</li>}
              {errors.description && <li>{errors.description.message}</li>}
              {errors.facebookUrl && <li>{errors.facebookUrl.message}</li>}
              {errors.type && <li>{errors.type.message}</li>}
              {errors.faculty && <li>{errors.faculty.message}</li>}
            </ul>
          </div>
        )}

        <form onSubmit={(e) => {
          console.log('Form submit event triggered');
          console.log('Current errors:', errors);
          console.log('Form values:', watch());
          handleSubmit(onSubmitForm)(e);
        }} className="space-y-4">
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
            <Label htmlFor="type">Loại câu lạc bộ</Label>
            <select
              id="type"
              {...register('type')}
              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white shadow-sm"
            >
              <option value="STUDENT">CLB Sinh viên</option>
              <option value="FACULTY">CLB Trường/Khoa/Viện</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {clubType === 'FACULTY' && (
            <div className="space-y-2">
              <Label htmlFor="faculty">Tên Trường/Khoa/Viện</Label>
              <Input
                id="faculty"
                {...register('faculty')}
                placeholder="VD: Viện Đào tạo Công nghệ thông tin"
                className="bg-white border-gray-300 shadow-sm"
              />
              {errors.faculty && (
                <p className="text-sm text-red-500">{errors.faculty.message}</p>
              )}
            </div>
          )}

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