import React, { useState, useEffect, useRef } from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = useState('UAH');
  const [toCurrency, setToCurrency] = useState('USD');
  const ratesRef = useRef({});
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(0);

  useEffect(() => {
    fetch('https://api.currencyapi.com/v3/latest?apikey=cur_live_xSObrzpRtb7ZjNAzEnz0gZn17h0XnkbEklR0TV52')
      .then((res) => res.json())
      .then((json) => {
        ratesRef.current = json.data
        onChangeToPrice(1)
      })
      .catch((err) => {
        console.warn(err);
        alert('Не удалось загрузить данные');
      });
  }, []);

  const convertPrice = (value, fromCurrency, toCurrency) => {
    if (!ratesRef.current[fromCurrency] || !ratesRef.current[toCurrency]) {
      return 0;
    }
    const rateFrom = ratesRef.current[fromCurrency].value;
    const rateTo = ratesRef.current[toCurrency].value;
    return (value / rateFrom) * rateTo;
  };

  const onChangeFromPrice = (value) => {
    const convertedValue = convertPrice(value, fromCurrency, toCurrency);
    setFromPrice(value);
    setToPrice(convertedValue.toFixed(1));
  };

  const onChangeToPrice = (value) => {
    const convertedValue = convertPrice(value, toCurrency, fromCurrency);
    setToPrice(value);
    setFromPrice(convertedValue.toFixed(1));
  };

  React.useEffect(() => {
    onChangeFromPrice(fromPrice)
  }, [fromCurrency, fromPrice])

  React.useEffect(() => {
    onChangeToPrice(toPrice)
  }, [toCurrency, toPrice])

  return (
    <div className="App">
      <Block 
        value={fromPrice} 
        currency={fromCurrency} 
        onChangeCurrency={setFromCurrency} 
        onChangeValue={onChangeFromPrice} 
      />
      <Block 
        value={toPrice} 
        currency={toCurrency} 
        onChangeCurrency={setToCurrency} 
        onChangeValue={onChangeToPrice} 
      />
    </div>
  );
}

export default App;