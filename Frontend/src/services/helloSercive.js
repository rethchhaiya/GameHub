const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function fetchHello() {
    const respone = await fetch(`${API_BASE_URL}/hello`);

    if(!respone.ok){
        throw new Error("Fetch is not successfull");
    }

    return respone.text();
}

export default fetchHello;