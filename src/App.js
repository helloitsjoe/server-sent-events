import React from 'react';
import Box from './components/Box';

const sendMessage = message => {
  fetch('/message', {
    body: JSON.stringify({ message }),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then(res => {
    if (!res.ok) {
      throw new Error('Problem!');
    }
    return res.json();
  });
};

const App = () => {
  // const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState('');
  const [text, setText] = React.useState('');
  const [messages, setMessages] = React.useState([]);

  // disconnect

  const source = React.useRef();

  React.useEffect(() => {
    source.current = new EventSource('/subscribe');

    source.current.addEventListener('message', e => {
      try {
        const { messages: incomingMessages } = JSON.parse(e.data);
        setMessages(prev => [...prev, ...incomingMessages].filter(Boolean));
      } catch (err) {
        console.log('Connected...');
      }
    });
  }, []);

  return (
    <Box maxWidth="500px" textAlign="center" m="2em auto">
      <h1>You&apos;re doing great.</h1>
      {/* <h2>Count is {count}</h2> */}
      <Box
        as="form"
        m="auto"
        display="flex"
        flexDirection="column"
        onSubmit={e => e.preventDefault() || sendMessage({ name, text })}
      >
        <label>
          Name
          <input onChange={e => setName(e.target.value)} value={name} />
        </label>
        <label>
          Message
          <input onChange={e => setText(e.target.value)} value={text} />
        </label>
        <button type="submit">Send message to group</button>
        <button type="button" onClick={source.current?.close || (() => {})}>
          Disconnect
        </button>
      </Box>
      <Box as="ul">
        {messages.map(m => (
          <li key={m}>
            {m.name} says: {m.text}
          </li>
        ))}
      </Box>
    </Box>
  );
};

export default App;
