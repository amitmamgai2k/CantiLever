import { useParams } from 'react-router-dom'

function ChattingPage() {
  const { id } = useParams();
  console.log('Chat ID:', id);



  return (
    <div>ChatPage</div>
  )
}

export default ChattingPage;