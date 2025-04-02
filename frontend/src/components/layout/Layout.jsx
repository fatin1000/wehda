import Navbar from './Navbar'

const layout = ({ children }) => {
  return (
    <div className='min-h-screen'>
      <Navbar/>
      <main className=' max-7xl mx-auto '>
        {children}
      </main>
    </div>
  )
}

export default layout
