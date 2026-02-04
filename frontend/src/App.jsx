import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/Myprofile'
import MyAppointments from './pages/MyAppointments'
import Navbar from './components/Navbar'
import SignUp from './pages/SignUp'
import DoctorDetails from './pages/Doctorsdetail'
import BookAppointment from './pages/BookAppointment'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path="/doctor/:id" element={<DoctorDetails />} />
          <Route path="/book-appointment/:id" element={<BookAppointment />} />
        </Routes>
      </main>
    </div>
  )
}

export default App