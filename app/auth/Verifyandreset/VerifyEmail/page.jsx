
// "use client"


// import React, { use } from 'react'
// import { useState, useEffect,useRef} from 'react'
// import toast from 'react-hot-toast';
// import { useRouter, usePathname } from "next/navigation";
// import { useAuth } from '@/app/contexts/AuthContext';
// import { useUser } from '@/app/contexts/UserContext';
// import { fetchWithAuth } from '@/lib/utility/fetchWithAuth';


// const EmailVerify = () => {

//   const navigate = useRouter();
//   const location = usePathname();
//   const inputRefs = useRef([]);

//   const {isLoggedIn} = useAuth()
//   const {Reseller} = useUser()

  

//   const otpArray = inputRefs.current.map(e=>e.value)




// //MOVING FROM ONE INOUT TO THE NEXT AUTOMATICALLY
// const handleInput = (e, index) => {
//     console.log("Current value:", e.target.value);

//     // Example: move focus to next input automatically
//     if (e.target.value.length === e.target.maxLength) {
//       const nextInput = inputRefs.current[index + 1];
//       if (nextInput) {
//         nextInput.focus();
//       }
//     }
//   };



//     //DELETING THE CODE
//     const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !e.target.value) {
//       // Move focus to previous input
//       const prevInput = inputRefs.current[index - 1];
//       if (prevInput) {
//         prevInput.focus();
//       }
//     } else if (e.key >= "0" && e.key <= "9") {
//       // Allow only numbers and move to next
//       const nextInput = inputRefs.current[index + 1];
//       if (nextInput) {
//         setTimeout(() => nextInput.focus(), 10); // slight delay to allow input
//       }
//     } else if (e.key === "ArrowLeft") {
//       const prevInput = inputRefs.current[index - 1];
//       if (prevInput) {
//         prevInput.focus();
//       }
//     } else if (e.key === "ArrowRight") {
//       const nextInput = inputRefs.current[index + 1];
//       if (nextInput) {
//         nextInput.focus();
//       }
//     }
//   };



// // PASTING THE CODE 
//   const handlePaste = (e) => {
//     e.preventDefault();
//     const paste = e.clipboardData.getData("text");
//     if (paste.length === 0) return;
//     const pasteArray = paste.split('');
//     pasteArray.forEach((char, index)=>{
//       if(inputRefs.current[index]){
//         inputRefs.current[index].value = char
//       }
//     })
//   }


 



    
//     //SUBMIT THE FORM TO GET EMAIL VERIFIED
//      const onSubmitHandlerEmailVerify = async (e) =>{  
//     try {
//        e.preventDefault();
//        const otpArray = inputRefs.current.map(e=>e.value)
//       const payload = {
//         otp:otpArray.join('')
//       }

//       const res = await fetchWithAuth(`/auth/verify-account`, {
//         method: "POST",

//         body: JSON.stringify(payload)


//       })

      
//         if (!res.ok) {
//                 const errorData = await res.json().catch(() => ({}));
//                 return toast.error(errorData.message || "Something went wrong");
//             }



//       const data = await res.json()
//       if (data.success) {
//         toast.success(data.message) 
//        navigate.push("/reseller")
//       }else{
//         toast.error(data.message)
//       }
     

//     } catch (error) {
//       console.log(error)
//     }


//   }



// useEffect(()=>{
//   isLoggedIn && Reseller && Reseller.isAccountVerified && navigate.push("/reseller")
// },[isLoggedIn,Reseller])






//   return (
// <div className="">
//   <div className="h-24 px-4 flex items-center justify-center text-center text-sm bg-green-100 text-green-700 font-medium">
//     kindly Check Spam for OTP Code If not Visible in Inbox
//   </div>

//   <div className='flex items-center justify-center min-h-screen relative overflow-hidden'>
//     {/* Animated background elements */}

 
//     {/* Verification Card */}
//     <form 
//       className='relative z-20 bg-white/95 backdrop-blur-md border border-green-200 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md text-sm' 
//       onSubmit={onSubmitHandlerEmailVerify}
//     >
//       <h1 className='text-green-600 text-3xl font-bold text-center mb-3'>
//         Verify Email
//       </h1>

//       <p className='text-center mb-8 text-green-700/70 leading-relaxed'>
//         Enter the 6-digit code sent to your email
//       </p>

//       {/* OTP Input Fields */}
//       <div className='flex justify-between gap-2 sm:gap-3 mb-8' onPaste={handlePaste}>
//         {Array(6).fill(0).map((_, index) => (
//           <input
//             type="text"
//             inputMode="numeric"
//             maxLength='1'
//             key={index}
//             required
//             className='w-12 h-12 sm:w-14 sm:h-14 bg-green-50 border-2 border-green-300 text-green-900 text-center text-2xl font-bold rounded-lg transition-all duration-200 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-300/50 focus:outline-none hover:border-green-400'
//             ref={(e) => inputRefs.current[index] = e}
//             onInput={(e) => handleInput(e, index)}
//             onKeyDown={(e) => handleKeyDown(e, index)}
//           />
//         ))}
//       </div>

//       <button 
//         type="submit" 
//         className='w-full bg-[#63E8FD] hover:bg-[#4DD5EA] text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-300/50 active:scale-95'
//       >
//         Verify Email
//       </button>

//       {/* <p className='text-center mt-6 text-green-600/70 text-xs'>
//         Didn't receive the code? <span className='text-green-600 cursor-pointer hover:text-green-700 font-semibold'>Resend</span>
//       </p> */}
      
//     </form>
//   </div>
// </div>
//   )
// }

// export default EmailVerify
