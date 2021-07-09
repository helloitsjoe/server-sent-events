import React from 'react';
import Box, { SpacedBox } from './components/Box';
import Input from './components/Input';

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
  const [name, setName] = React.useState('');
  const [text, setText] = React.useState('');
  const [messages, setMessages] = React.useState([]);

  // TODO: disconnect

  const source = React.useRef();

  React.useEffect(() => {
    source.current = new EventSource('/subscribe');

    source.current.addEventListener('error', err => {
      console.error('EventSource error:', err);
    });

    source.current.addEventListener('message', e => {
      try {
        const { messages: incomingMessages } = JSON.parse(e.data);
        setMessages(prev => [...prev, ...incomingMessages].filter(Boolean));
      } catch (err) {
        if (e.data.match(/connected/i)) {
          console.log('Connected...');
        } else {
          console.error(err);
        }
      }
    });
  }, []);

  return (
    <Box maxWidth="700px" textAlign="center" m="2em auto">
      <h1>You&apos;re doing great.</h1>
      <SpacedBox
        as="form"
        m="1em auto"
        display="flex"
        flexDirection="column"
        maxWidth="200px"
        onSubmit={e => e.preventDefault() || sendMessage({ name, text })}
      >
        <Input
          id="name"
          label="Name"
          value={name}
          hiddenLabel
          placeholder="Name"
          onChange={e => setName(e.target.value)}
        />
        <Input
          id="message"
          label="Message"
          value={text}
          hiddenLabel
          placeholder="Message"
          onChange={e => setText(e.target.value)}
        />
        <button type="submit">Send message</button>
        {/* <button type="button" onClick={source.current?.close || (() => {})}>
          Disconnect
        </button> */}
      </SpacedBox>
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
