import https from 'https';

const url = 'https://wsrv.nl/?url=images.unsplash.com/photo-1626621341517-bbf3d9990a23';

https.get(url, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
}).on('error', (e) => {
  console.error(e);
});
