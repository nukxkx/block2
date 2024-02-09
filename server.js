const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const fs = require('fs').promises;

app.use(express.static('public'));

//Google Maps
app.get('/',async (req, res) => {
  try {
    const htmlContent = await fs.readFile('index.html', 'utf-8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error: ', error.message);
    res.status(500).send('Error');
  }
});

app.get('/getCoords', async (req, res) => {
  try {
    const jsonData = require('./data.json');
    const { latitude, longitude } = jsonData;
    
    res.json({ latitude, longitude });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
});


//Country Info
app.get('/info', async (req, res) => {
  try {
    const htmlContent = await fs.readFile('countryInfo.html', 'utf-8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error');
  }
});

app.get('/getCountryInfo', async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/name/kazakhstan');
    const countryInfo = JSON.stringify(response.data, null, 2);
    res.send(`document.getElementById('country-info').innerText = ${JSON.stringify(countryInfo)};`);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error');
  }
});


//Money
const apiKey = 'cur_live_OxuekKQGp4HrRaRA6o4teKvuEZFugOK79Ye5LOyb';

async function getExchangeRate(currency) {
  const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=${currency}`;
 
    const response = await axios.get(apiUrl);
    return response.data;  
}

app.get('/money', async (req, res) => {
  const currency = 'KZT';

  try {
    const exchangeRate = await getExchangeRate(currency);

    const htmlContent = (await fs.readFile('money.html')).toString();

    const updatedHtml = htmlContent
      .replace('{currency}', exchangeRate.data.KZT.code)
      .replace('{value}', exchangeRate.data.KZT.value);

    res.send(updatedHtml);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error');
  }
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

