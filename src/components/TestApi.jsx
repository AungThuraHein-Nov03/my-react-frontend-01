import { useEffect, useState } from 'react'; 

function App() { 
  const [message, setMessage] = useState("...Loading..."); 

  async function fetchData() { 
    const result = await fetch('http://localhost:3000/api/hello');
    const data = await result.json();
    console.log("Result: ", result);
    console.log("DATA: ", data);
    setMessage(data.message);
  }

  
  useEffect(()=> {
    fetchData();
  }, []);

  return(
    <div>
      Message: {message}
    </div>
  )

} 
export default App