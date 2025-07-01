import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import {  Link, useNavigate, useParams } from 'react-router-dom'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { BACKEND_URL } from '../utils/utils';

function Buy() {
  const {courseId}=useParams();
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const user=JSON.parse(localStorage.getItem("user"));
  const token=user?.token;
  const [course,setCourse]=useState([])//backend lo unna course ni store cheynadiki ikkada idhi use chesthunnam same next line kuda anthe
  const [clientSecret,setClientSecret]=useState("");
  const [error,setError]=useState("");
  const [cardError,setCardError]=useState("");

  const stripe = useStripe();
  const elements = useElements();


  //cause we need the data immediately when we render into buy page so we use useEffect() here;
  useEffect(()=>{
    const fetchBuyCourseData=async ()=>{
      if(!token){
      setError("please LogIn to purchase the courses");
      return
    }
    try {
      const response=await axios.post(`${BACKEND_URL}/course/buy/${courseId}`,{},{
        headers:{
          Authorization:`Bearer ${token}`
        },
        withCredentials:true,
      })
      console.log(response.data)
      setCourse(response.data.course);
      setClientSecret(response.data.clientSecret);
      setLoading(false)      
    } catch (error) {
      setLoading(false);
      if(error?.response?.status===401)
      {
        
        setError("you have already purchased this course");
        navigate("/purchases")        
      }
      
      else
      {
        setError(error?.response?.data?.errors)
      }
    }
    }
    fetchBuyCourseData()
  },[courseId/* whenever the courseId changes then useeffct runs immidiately */])


  const handlePurchase=async (event)=>{
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element not found")
      return;
    }

    setLoading(true)
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Card Element not found ")
      setLoading(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('Stripe Payment method error : ', error);
      setLoading(false);
      setCardError(error.message)
    } else {
      console.log('PaymentMethod created : ', paymentMethod);
    }
    if(!clientSecret)
    {
      console.log("No clientSecret Found")
      setLoading(false)
      return
    }
    const {paymentIntent, error:confirmError} = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method:
        {
          card: card,
          billing_details:
          {
            name: user?.user?.firstName,
            email:user?.user?.email,
          },
        },
      },
    );
    if(confirmError)
    {
      setCardError(confirmError.message);
    }
    else if(paymentIntent.status==="succeeded")
    {
      console.log("Payment Succeeded",paymentIntent)
      setCardError("your payment Id: ",paymentIntent.id)
      const paymentInfo={
        email:user.user?.email,
        userId: user.user._id,
        courseId:courseId,
        paymentId: paymentIntent.id,
        amount:paymentIntent.amount,
        status:paymentIntent.status
      }
      console.log("payment Information",paymentInfo);
      await axios.post(`${BACKEND_URL}/order`,paymentInfo,{
        headers:{
          Authorization:`Bearer ${token}`
        },
        withCredentials:true,
      })//It goes to the endpoint with the body
      .then(response =>{
        console.log(response.data)
      }).catch((error)=>{//for then catch we have to use arrow function for catch
        console.log(error);
        toast.error("Error in making payment");
      })

      toast.success("Payment Successfull..");
      navigate('/purchases');
    }
    setLoading(false);
    
  };
  return (
    <>
    {
      error?(
        <div className='flex justify-center items-center h-screen'>
          <div className='bg-red-100 text-red-700 px-6 py-4 rounded-lg'>
            <p className='text-lg font-bold'>{error}</p>
            <Link to={'/purchases'}
             className='w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300 mt-3 flex items-center justify-center'>
             Purchases
            </Link>

          </div>
        </div>
      ):
      (
        <div className='flex flex-col sm:flex-row my-40 container mx-auto'>
          <div className='w-full md:w-1/2'>
            <h1 className='text-xl font-semibold underline'>Order details</h1>
            <div>
              <h2 className='text-gray-600 text-sm'>Total price</h2>
              <p className='text-red-500 font-bold'>${course.price}</p>
            </div>
            <div className='flex items-center text-center space-x-2'>
              <h1 className='text-gray-600 text-sm'>Course name</h1>
              <p className='text-red-500 font-bold'>{course.title}</p>
            </div>
          </div>
          <div className='w-full md:w-1/2 flex justify-center items-center'>
            <div className='bg-white shadow-md p-6 rounded-lg w-full max-w-sm'>
              <h2 className='mb-4 text-lg font-semibold'>Processing your Payment!</h2>
              <div className='mb-4'>
                <label className='block text-gray-700 mb-2 text-sm' htmlFor='card-number'>Credit/Debit Card</label>
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style:{
                        base:{
                          fontSize:"16px",
                          color:"#424770",
                          "::placeholder":{
                            color:"#aab7c4",
                          },
                        },
                        invalid:{
                          color:"#9e2146",
                        },
                      },
                    }}
                   />
                   <button
                    type='submit' disabled={!stripe || loading} className='mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200'
                   >
                    {loading ?"processing..":"Pay"}
                   </button>

                </form>
                {cardError &&(
                  <p className='text-red-500 font-semibold text-xs'>{cardError}</p>
                )}

              </div>
              <button className='w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300 mt-3 flex items-center justify-center'>
                <span className='mr-2'>🅿️</span>Other Payments Methods
              </button>

            </div>
          </div>

        </div>
      )
    }
    </>
  );
}

export default Buy