// Example POST method implementation:

async function post(url, data) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // *client, no-referrer
    })
    .then(response => response.json()).then(resp => {
      resolve(resp);
    }).catch(e => {
      reject(e);
    })
  })
}

async function get(url) {

  return new Promise((resolve, reject) => {
    fetch(url)
    .then(response => response.json())
    .then(resp => {
      resolve(resp);
    }).catch(e => {
      console.log(e);
      reject(e);
    })
  })
}

export {get, post};
