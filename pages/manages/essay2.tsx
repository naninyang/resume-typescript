import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

type Essay = {
  id?: number;
  avatar_path: string;
  avatar_name: string;
  avatar_type: string;
  eng_name: string;
  eng_occupation: string;
  title: string;
  bio: string;
  show: boolean;
};

const Essay: React.FC = () => {
  const [essay, setEssay] = useState<Essay>({
    avatar_path: '',
    avatar_name: '',
    avatar_type: '',
    eng_name: '',
    eng_occupation: '',
    title: '',
    bio: '',
    show: false,
  });

  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEssay(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('/api/essay/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setEssay(prev => ({
        ...prev,
        avatar_path: response.data.avatar_path,
        avatar_name: response.data.avatar_name,
        avatar_type: response.data.avatar_type,
      }));
    } catch (error) {
      console.error('Error uploading the file', error);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpe', '.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      if (essay.id) {
        await axios.put(`/api/essay/${essay.id}`, essay, { headers });
      } else {
        await axios.post('/api/essay', essay, { headers });
      }
    } catch (error) {
      console.error('Error saving the essay', error);
    }
  };

  const [essayData, setEssayData] = useState<Essay | null>(null);

  useEffect(() => {
    async function fetchEssayData() {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('/api/essay/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setEssayData(response.data);
          setAvatarPreview(response.data.avatar_path || '');
        }

      } catch (error) {
        console.error("Error fetching essay data:", error);
      }
    }

    fetchEssayData();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        Drag & drop some files here, or click to select files
      </div>
      {avatarPreview && (
        <div className='AvatarPreview'>
          <strong>사진 미리보기</strong>
          <Image src={avatarPreview} alt="사진 미리보기" width='100' height='100' />
          <p>미리보기에서는 100 by 100으로 보여드립니다.<br />이미지 비율은 정방형을 추천합니다.</p>
        </div>
      )}
      <input
        type="text"
        name="eng_name"
        value={essay.eng_name}
        onChange={handleChange}
        placeholder="English Name"
      />
      <input
        type="text"
        name="eng_occupation"
        value={essay.eng_occupation}
        onChange={handleChange}
        placeholder="English Occupation"
      />
      <input
        type="text"
        name="title"
        value={essay.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <TextareaAutosize
        minRows={3}
        name="bio"
        value={essay.bio}
        onChange={handleChange}
        placeholder="Bio"
      />
      <input
        type="checkbox"
        name="show"
        checked={essay.show}
        onChange={(e) => setEssay(prev => ({
          ...prev,
          show: e.target.checked
        }))}
      />
      Show
      <button type="submit">Submit</button>
    </form>
  );
};

export default Essay;
