const form = document.getElementById('Loguearse')

from.addEventListener('Submit',(evt)=>{
    evt.preventDefault();
    const data = new FormData(form)
    const obj = {};

    data.forEach((value, key)=>obj[key]=value);
    fetch('/login',{
        method: 'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>result.json())
})