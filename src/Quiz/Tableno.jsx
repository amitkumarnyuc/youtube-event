import React from 'react'

function Tableno({tableno, onChange ,onClick}) {
  return (
    <div>
        <input value={tableno} onChange={onChange}/>
        <button onClick={onClick}>submit</button>
    </div>
  )
}

export default Tableno