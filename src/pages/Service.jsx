import React from 'react';

export default function Service() {
  return (
    <Header />
    <Menu />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/notice" element={<Notice />} />
    </Routes>
  );
}
