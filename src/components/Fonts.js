import { useState } from 'react';

function Fonts() {
  const [text, setText] = useState('消す');

  return (
    <div>
      <input type='text' onChange={(e) => { setText(e.target.value); }} />
      <p style={{ fontFamily: 'sans-serif' }}>{text}</p>
      <p style={{ fontFamily: 'serif' }}>{text}</p>
    </div>
  );
}

export default Fonts;
