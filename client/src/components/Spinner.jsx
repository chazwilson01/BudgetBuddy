import React from 'react';
import "./Spinner.css";
const CoinFlipLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
    <span className="loader"></span>
    <h2 className='text-2xl font-bold'>Fetching your data, please keep my friend company...</h2>
    </div>
  )
}
export default CoinFlipLoader;