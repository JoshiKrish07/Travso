/* eslint-disable react/prop-types */

import React, { useState } from 'react';

function SuccessError({message, messageType}) {
  const [showSuccess, setShowSuccess] = useState(false);
  console.log("=====message====>", message);

  return (
    <div className="App">

      {messageType === 'success' && (
        <div
          className="fixed z-10 top-5 right-5 bg-green-500 text-white p-4 rounded shadow-lg"
        >
         {message}
        </div>
      )}

        {messageType === 'error' && (
        <div
          className="fixed z-10 top-5 right-5 bg-red-500 text-white p-4 rounded shadow-lg"
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default SuccessError;