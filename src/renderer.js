const func = async () => {
  const response = await window.myApi.ping();
  console.log(response) // prints out 'pong'
}

func()