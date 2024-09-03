const htmlTemplate = (qr, firstname, event, id) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  <style>
  .main-body{
  width: 100%;
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center:
  justify-content: center;
  }
  h1{
       font-size: 36px;
          color: #FFA500;
          font-weight: bold;
  }
          h3{
          text-transform: uppercase;
          font-weight: bold;
          font-size: 28px;
          color: black;
          padding: 15px 0;
          }
          h5{
           text-transform: uppercase;
          font-size: 24px;
          margin-bottom: 10px;
          }
            p{
          font-size: 16px;
          text-transform: capitalize;
          }
          .qr-container{
          width: 150px;
          height: 150px;
          }
          img{
          width: 100%;
          height: 100%;
          }
          .qr-container p{
          font-size: 14px;
          font-weight: bold;
          text-transform: capitalize;
          }
  </style>
  </head>
  <body>
  <div class="main-body">
    <h1>EKO-DIARY</h1>
    <hr>
  <h3>${event.name}</h3>
  <h5 class="location">${event.location.event_location}</h5>
  <p>${event.date}</p>
  <p>${event.time.start_time} - ${event.time.end_time}</p>
  <p>Ordered by: ${firstname}</p>
  <div class="qr-container">
  <img src=${qr} alt="QR- Image"/>
  <p>${id}</p>
  </div>
  </div>
  </body>
  </html>`
  }
  
  module.exports = htmlTemplate;