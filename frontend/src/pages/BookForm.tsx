import { useState } from 'react';
import { booksApi } from '../api/books';
import { useToast } from '../contexts/ToastContext';

function BookForm() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    year: '2024',
    description: '',
    category: '',
    quantity: '1'
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let coverImagePath = '';
      
      // Upload cover image first if selected
      if (coverImage) {
        const uploadResult = await booksApi.uploadCoverImage(coverImage);
        coverImagePath = uploadResult.coverUrl;
      }

      // Create book with cover image path
      const bookData = {
        ...formData,
        year: parseInt(formData.year),
        quantity: parseInt(formData.quantity),
        coverImage: coverImagePath,
      };

      await booksApi.createBook(bookData);
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        isbn: '',
        year: '2024',
        description: '',
        category: '',
        quantity: '1',
      });
      setCoverImage(null);
      setCoverImagePreview('');
      
      showSuccess('เพิ่มหนังสือสำเร็จ!', `หนังสือ "${formData.title}" ได้ถูกเพิ่มเข้าระบบแล้ว`);
    } catch (error) {
      console.error('Error creating book:', error);
      showError('เกิดข้อผิดพลาดในการเพิ่มหนังสือ', 'กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <span style={{ color: '#6b7280' }}>← Back to Books</span>
          <h1 style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            Add New Book
          </h1>
        </div>
      </div>

      <div className='card'>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className='form-group'>
              <label htmlFor='title' className='form-label'>
                Title *
              </label>
              <input
                type='text'
                id='title'
                name='title'
                className='form-input'
                placeholder='Enter book title'
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='author' className='form-label'>
                Author *
              </label>
              <input
                type='text'
                id='author'
                name='author'
                className='form-input'
                placeholder='Enter author name'
                value={formData.author}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='isbn' className='form-label'>
                ISBN *
              </label>
              <input
                type='text'
                id='isbn'
                name='isbn'
                className='form-input'
                placeholder='978-0-123456-78-9'
                value={formData.isbn}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='year' className='form-label'>
                Publication Year *
              </label>
              <input
                type='number'
                id='year'
                name='year'
                className='form-input'
                placeholder='2024'
                value={formData.year}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='category' className='form-label'>
                Category *
              </label>
              <select
                id='category'
                name='category'
                className='form-input'
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value=''>Select category</option>
                <option value='Fiction'>Fiction</option>
                <option value='Non-Fiction'>Non-Fiction</option>
                <option value='Science'>Science</option>
                <option value='Technology'>Technology</option>
                <option value='History'>History</option>
                <option value='Biography'>Biography</option>
                <option value='Education'>Education</option>
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='quantity' className='form-label'>
                Quantity *
              </label>
              <input
                type='number'
                id='quantity'
                name='quantity'
                className='form-input'
                placeholder='1'
                min='1'
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className='form-group'>
            <label htmlFor='description' className='form-label'>
              Description
            </label>
            <textarea
              id='description'
              name='description'
              className='form-input form-textarea'
              placeholder='Brief description of the book'
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='coverImage' className='form-label'>
              Cover Image
            </label>
            <input
              type='file'
              id='coverImage'
              className='form-input'
              accept='image/*'
              onChange={handleImageChange}
            />
            {coverImagePreview && (
              <div style={{ marginTop: '1rem' }}>
                <img
                  src={coverImagePreview}
                  alt='Cover preview'
                  style={{
                    maxWidth: '200px',
                    maxHeight: '250px',
                    objectFit: 'cover',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )}
          </div>

          <div className='d-flex gap-2 justify-content-between' style={{ marginTop: '2rem' }}>
            <button type='button' className='btn btn-secondary'>
              Cancel
            </button>
            <button type='submit' className='btn btn-primary' disabled={isUploading}>
              {isUploading ? 'Creating...' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookForm;