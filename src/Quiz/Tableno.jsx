import React from 'react'

function Tableno({tableno, onChange ,onClick}) {
  return (
    <div>
      <h1>Table no</h1>
        <input value={tableno} onChange={onChange}/>
        <br></br>
        <button onClick={onClick}>submit</button>
    </div>
  )
}

export default Tableno