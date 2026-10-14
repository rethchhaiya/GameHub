import React, { use, useEffect, useState } from 'react'
import fetchHello from '../services/helloSercive';

function ExplorePage() {

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadHello() {
            try{
                const result = fetchHello();
                setMessage(result);
            }catch(e){
                setError(e.message);
            }finally{
                setLoading(false);
            }
        }
        loadHello();
    }, []);

    if(loading) return <p>Loading...</p>
    if(error) return <p>{error}</p>
  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}

export default ExplorePage
