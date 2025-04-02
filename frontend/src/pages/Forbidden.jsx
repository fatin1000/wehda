import Contact from "../components/home/Contact"
const Forbidden = () => {
  return (
    <div className="bg-white pt-24">
      <h1 className="text-3xl font-semibold text-primary mb-2 text-center">You are Forbidden from entering</h1>
      <p className="text-gray-600 text-center">If you have any questions, you can contact the administration here</p>
      <Contact/>
    </div>
  )
}

export default Forbidden
