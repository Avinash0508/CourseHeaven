import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { BrowserRouter } from 'react-router-dom'
const stripePromise = loadStripe("pk_test_51ReCu2DCLk52beDiZmfz0WJ2nEDEW6f4Qm2GlQMsw56f8GOrz7qru9rqJ9cjkBNp1SfN7jGw7IjnMIo3vXi5Hlyh00lHlKGE0S");

createRoot(document.getElementById('root')).render(
  
  <Elements stripe={stripePromise}>
    <BrowserRouter>
     <App />
    </BrowserRouter>
  </Elements>
)
