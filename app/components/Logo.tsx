export default function Logo() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 背景 */}
      <rect width="64" height="64" rx="16" fill="#1890FF"/>
      
      {/* 书本形状 */}
      <path d="M18 20C18 18.8954 18.8954 18 20 18H44C45.1046 18 46 18.8954 46 20V44C46 45.1046 45.1046 46 44 46H20C18.8954 46 18 45.1046 18 44V20Z" fill="white"/>
      
      {/* 书页纹理 */}
      <path d="M22 24H42M22 30H42M22 36H36" stroke="#1890FF" strokeWidth="2" strokeLinecap="round"/>
      
      {/* AI 符号 */}
      <path d="M30 38C33.866 38 37 34.866 37 31C37 27.134 33.866 24 30 24M30 38C26.134 38 23 34.866 23 31C23 27.134 26.134 24 30 24M30 38V24" stroke="#1890FF" strokeWidth="2"/>
      
      {/* 圆点装饰 */}
      <circle cx="42" cy="36" r="2" fill="#1890FF"/>
    </svg>
  );
} 