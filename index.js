const express = require('express');
const app = express();
const port = 2000; // You can change this to your desired port

app.use(express.json());

const { Client, Chat, MessageMedia, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
  session: {
    // You can store the session data in a file for persistence
    // If you don't have it, the user will need to scan the QR code every time.
    // Remove the 'persistence' property to not store the session data.
    persistence: require('path').resolve(__dirname, 'session.json'),
  },
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false,
  }
});

client.on('qr', (qrCode) => {
  // Handle the QR code for user scanning
  console.log('QR Code:', qrCode);
});

client.on('authenticated', (session) => {
  console.log('Authenticated');
});

client.on('ready', () => {
  console.log('WhatsApp Web is ready');
});

client.initialize();
app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    console.log(number);
    console.log(message);
  
    try {
      const chat = await client.getChatById(number + '@c.us');
      await chat.sendMessage(message);
      console.log(chat);
      res.status(200).json({ success: true, message: 'Message sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to send message' });
    }
  });
  
  // Example endpoint for sending media files
  app.post('/send-media', async (req, res) => {
    const client = new Client({
      session: {
        // You can store the session data in a file for persistence
        // If you don't have it, the user will need to scan the QR code every time.
        // Remove the 'persistence' property to not store the session data.
        persistence: require('path').resolve(__dirname, 'session.json'),
      },
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: false,
      }
    });
    
    client.on('qr', (qrCode) => {
      // Handle the QR code for user scanning
      console.log('QR Code:', qrCode);
    });
    
    client.on('authenticated', (session) => {
      console.log('Authenticated');
    });
    
    client.on('ready', () => {
      console.log('WhatsApp Web is ready');
    });
    
    client.initialize();
    const { number, mediaUrl, caption } = req.body;

    console.log(number);
    console.log(mediaUrl);
    console.log(caption);
    try {
      const chat = await client.getChatById('234' + number + '@c.us');
      const media = MessageMedia.fromFilePath(mediaUrl);
      chat.sendMessage(media, { caption });
      res.status(200).json({ success: true, message: 'Media sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to send media' });
    }
  });
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
    
 