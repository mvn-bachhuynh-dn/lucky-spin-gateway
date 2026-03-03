import { Post, User } from '../types';

export const generateMockPosts = (startDate: string, endDate: string): Post[] => {
  const posts: Post[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const numPosts = Math.floor(Math.random() * 20) + 10; // 10 to 30 posts
  
  for (let i = 0; i < numPosts; i++) {
    const randomDay = Math.floor(Math.random() * diffDays);
    const postDate = new Date(start.getTime() + randomDay * 24 * 60 * 60 * 1000);
    posts.push({
      id: `post_${i + 1}`,
      content: `Bài viết chia sẻ kiến thức chạy bộ ngày ${postDate.toLocaleDateString('vi-VN')}...`,
      date: postDate.toISOString(),
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 300) + 20,
    });
  }
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const middleNames = ['Văn', 'Thị', 'Hữu', 'Đức', 'Minh', 'Ngọc', 'Hải', 'Xuân', 'Thu', 'Thanh', 'Quang', 'Bảo', 'Gia', 'Tuấn', 'Anh'];
const lastNames = ['An', 'Bình', 'Cường', 'Dũng', 'Em', 'Phong', 'Giang', 'Hà', 'Hùng', 'Hương', 'Linh', 'Mai', 'Nam', 'Nga', 'Oanh', 'Phúc', 'Quân', 'Sơn', 'Tâm', 'Thảo', 'Uyên', 'Vinh', 'Yến'];

const generateRandomName = () => {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const middle = middleNames[Math.floor(Math.random() * middleNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${middle} ${last}`;
};

export const generateMockUsers = (post: Post): User[] => {
  const users: User[] = [];
  const numUsers = Math.floor(Math.random() * 100) + 50; // 50 to 150 users
  
  for (let i = 0; i < numUsers; i++) {
    const hasReacted = Math.random() > 0.2; // 80% reacted
    const hasCommented = Math.random() > 0.3; // 70% commented
    const commentCount = hasCommented ? (Math.random() > 0.9 ? Math.floor(Math.random() * 5) + 2 : 1) : 0; // 10% spam
    const isSpam = commentCount > 3;
    const isValid = hasReacted && hasCommented && !isSpam;
    
    users.push({
      id: `user_${i + 1}`,
      name: generateRandomName(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      hasReacted,
      hasCommented,
      commentCount,
      isSpam,
      isValid,
    });
  }
  return users;
};
