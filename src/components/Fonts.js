import { useState } from 'react';

function Fonts() {
  const [text, setText] = useState('奇想天外！生き物のふしぎ生態図鑑【どうぶつ奇想天外／WAKUWAKU】');

  return (
    <div>
      <input type='text' onChange={(e) => { setText(e.target.value); }} />
      <p style={{ fontFamily: 'sans-serif' }}>{text}</p>
      <p style={{ fontFamily: 'serif' }}>{text}</p>
    </div>
  );
}

export default Fonts;
