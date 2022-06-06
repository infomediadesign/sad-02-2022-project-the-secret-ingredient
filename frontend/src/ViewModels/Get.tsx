export var userID = getGeneric("http://localhost:1234/users");

export async function getGeneric(url : string , id?: string){
    var token = localStorage.getItem("jwt");
    if(id){
        url + "/" + id;
    }

    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }),
    };
        
    return await fetch(url, requestOptions).then((data) => {
        return data.json();
    });
}