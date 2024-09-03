const mailTemplate = (firstname, event, id) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  <style>
  @font-face{
  font-family: "Genos";
  src: url(.//FONTS/Genos/Genos-Regular.ttf) format('truetype');
  }
  @font-face{
   font-family: 'BN Nokyo';
    src: url(./FONTS/Nokyo/BNNokyoVariableVF.ttf) format('truetype');
  }
  h1{
   font-weight: bold;
            font-size: 40px;
            line-height: 25px;
            letter-spacing: -0.457589px;
          color: #FFA500;
          font-family: 'BN Nokyo';
  }
          .order{
          font-weight: bold;
          font-size: 24px;
          color: #000;
          margin-bottom: 30px;
           font-family: 'Genos';
          }
          p{
          font-size: 16px;
          text-transform: capitalize;
           font-family: 'Genos';
          }
          .name{
          font-size: 24px;
          text-transform: uppercase;
           color: #FFA500;
            font-family: 'Genos';
          }
           .details{
           font-size: 18px;
           font-weight: bold;
            font-family: 'Genos';
            text-transform: uppercase;
           }
  </style>
  </head>
  <body>
    <h1>EKO-DIARY</h1>
    <hr>
    <h3 className="order">Order in the bag!</h3>
    <p>Hi ${firstname}</p>
    <p>Here are your items.</p>
  <h3 class="name">${event.name}</h3>
 <h5 class="details">${event.details}</h5>
 <p>Make sure you are on time to secure the best seat.</p>
  <p>${event.date}</p>
  <p>${event.time.start_time} - ${event.time.end_time}</p>
  <p>TIcket Id: ${id}</p>
  <p>Ordered by: ${firstname}</p>
  <hr>
  <p>Your tickets are attached as PdF to this mail.</p>
  </body>
  </html>`
  }
  
  module.exports = mailTemplate;