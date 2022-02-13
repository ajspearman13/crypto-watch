import './App.css';
import axios from 'axios';
import React, { useState , useEffect, useRef} from 'react';

function App() {
  const [orgArr, setOrgArr] =useState([])
  const [arrAZ, setArrAZ] =useState([])
  const [perUP, setPerUP] =useState([])
  const [perDwn, setPerDwn] =useState([])
  const [arrZA, setArrZA] =useState([])
  const [reverseArr, setReverseArr] =useState([])
  const [search , setSearch] = useState('')
  const [tester, setTester] = useState(0)

  const [amount , setAmount] = useState('')
  const [coinPrice, setCoinPrice] =useState('')
  const [coinSym, setCoinSym] =useState('')
  const [coinPic, setCoinPic] =useState('')

  const box = useRef()
  const box1 = useRef()
  const box2 =useRef()
  const header = useRef()
  const tableBox = useRef()
  
  const margin = {marginTop : '160px'}
  const [tableMargin, setTableMargin] = useState(margin)

  useEffect(()=> { 
    function getApi(){
      axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
      .then(res => {
        // setArr0(res.data.map(x => x)   ) 
         setArrAZ(res.data.map(x => x).sort(  (a,b) => a.id.localeCompare(b.id)     )   ) 
         setPerUP(res.data.map(x => x).sort(  (a,b) => b["price_change_percentage_24h"] - a["price_change_percentage_24h"]   )   ) 
         setPerDwn(res.data.map(x => x).sort(  (a,b) => a["price_change_percentage_24h"] - b["price_change_percentage_24h"]   )   )
         setArrZA(res.data.map(x => x).sort(  (a,b) => b.id.localeCompare(a.id)     )   ) 
         setReverseArr(res.data.map(x => x).reverse()   ) 
         setOrgArr(res.data.map(x => x)   ) 
        } )
      .catch(error => {
          console.log(error);
      })
    }
    
    setTester(0)
    const interval = setInterval(getApi, 500) //// clearinterval parameters
    return ()=> clearInterval(interval)   
  }, [])

  function test1() { (tester === 0)? setTester(1) : setTester(0)   }
  function test2() {(tester === 2)? setTester(3) : setTester(2)   }
  function test4(){  (tester === 4)? setTester(5) : setTester(4) }
  function filterArr(a){return  (search === '')? a : (a.name.toLowerCase() ).includes(search.toLowerCase() )  ||  (search === '')? a : (a.symbol ).includes(search.toLowerCase() ) }
  function money(x) {return(x > .9999  )? x.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : x}
  function clearData(){
    setCoinPic('')
    setAmount(0)
    setCoinSym('')
    setCoinPrice('')
    setTableMargin(margin)
  }
  return (
    <div className="App">
      <div ref={header} id='header' >
        <h1> Cryptocurrency Price Tracker</h1>
        <div >
          <img src={coinPic} id='box1' style={{width : '40px'}} ref={box1} /> <div style={{textAlign: 'center', marginTop: '-20px'}} alt={coinPrice}>  <br/>{coinSym}</div><br/>
        </div>
        <div ref={box} id='box' style={{paddingBottom : '20px', marginTop : '-20px'}} >
          <div style={{ fontSize : '20px'  }} > Total $ {money(coinPrice * amount)}</div> 
          <div style={{ marginLeft: '20px', fontSize : '18px'  }}>  Amount: <input type='number' style={{width:'60px' }} value={amount} onChange={(e) => setAmount(e.target.value)}  /> </div><br/>  
          <div style={{ marginLeft: '30px' , marginTop: '5px' }} onClick={clearData} > <button >Clear</button></div>
        </div>
        
        <div ref={box2} id='box2' style={{paddingBottom : '10px'}} >
          <div>
            Filter By:
            <button  onClick={test1} style={{marginRight : '5px', marginLeft: '5px'}} > Market Capacity</button>
            <button onClick={test2} style={{marginRight : '5px'}}> % Change   </button> 
            <button onClick={test4} style={{marginRight : '5px'}} >  Name </button>
          </div>
          <div style={{marginLeft : '10px'}}>
            Search:  <input placeholder='Enter Text Here' type='text' onChange={ (e) => setSearch( e.target.value )} /> 
          </div>
        </div>
      </div>
      <Coinz  />
    </div>
  );
function Coinz(props){
  const arr0 = [orgArr ,reverseArr,  perUP ,perDwn, arrAZ ,  arrZA ]
  const item = arr0[tester].filter(filterArr).map(x => <Coin name={x['name']} key={x['name']} pic={x.image} price={x["current_price"]}  json={x} 
          marketCap={x["market_cap"]} symbol={x.symbol} highPrice={x['high_24h']} lowPrice={x["low_24h"]}  
          priceChangePer={x["price_change_percentage_24h"]} priceChange24={x["price_change_24h"]} />)

  return(
    <div ref={tableBox}  id="tableBox" >  
       <table style={tableMargin}  >
         <thead>
            <tr>
            <th> Select</th>
              <th>Symbol</th> <th> Name </th><th> Symbol</th><th>Price</th>
              <th>Price <br/>Change %</th> <th>Price <br/> Change</th>
              <th> Market Cap</th>
            </tr> 
         </thead>
         <tbody>
          {item} 
         </tbody>
      </table>
    </div>
  )
}

function Coin(props){
                           // if price is near $1 api displays 1 
function money(x) {
   return(x > .9999  )? x.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : x
}
function moneyDiff(x) {
  return(props.price > 3  )? x.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : x
}
 const fontColor = (props.priceChangePer > 0)? {color:"green"} : {color:"red"}
 const changePer = Math.round(props.priceChangePer * 100) / 100
 const arrow = (props.priceChangePer > 0)? "⬆" : "⬇"
 function test(){
  setCoinPrice(props.price)
  setCoinSym(props.symbol)
  setCoinPic(props.pic)
  setAmount(1)
  setTableMargin({marginTop : '220px'})
}
const centerPic = {display : 'block', marginRight : 'auto', marginLeft : 'auto'}
   return(
     <tr >  
       <td > <button onClick={test} style={centerPic} > +</button> </td>
       <td  > <img src={props.pic} style={{width: '30px', display : 'block', marginLeft : 'auto', marginRight : 'auto'} } alt={props.pic}/> </td> 
       <td> {props.name} </td>
       <td >{props.symbol} </td>
       <td>${money(props.price)} </td>
       <td> <span style={fontColor}> {arrow} {changePer}% </span> </td>
       <td><span style={fontColor} > {arrow} ${moneyDiff(props.priceChange24)} </span></td>
       <td>${money(props.marketCap)} </td>  
     </tr>
   )
 }
}
export default App;