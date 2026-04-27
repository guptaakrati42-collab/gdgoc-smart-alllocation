//Importing functions that we need from sdk
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore,setDoc,doc} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
  


  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAR_N6pAjqsLDljHJLRNhlch7-ugsKgMnM",
    authDomain: "smart-allocation-app.firebaseapp.com",
    projectId: "smart-allocation-app",
    storageBucket: "smart-allocation-app.firebasestorage.app",
    messagingSenderId: "783028721130",
    appId: "1:783028721130:web:7db6cbdf239a29f00b4e93",
    measurementId: "G-6J5G9LWLK4"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  //Initialize analytics
  const analytics = getAnalytics(app);
  // Initialize firestore
  const db=getFirestore(app);
  window.db=db;
  window.setDoc=setDoc;
  window.doc=doc;
  if (app){
    console.log("firebase connect sucessfully");
  }
  else{
    console.error("Oops not connected");
  }
  if(db){
    console.log("Database connect sucessfully");
  }
  else{
    console.error("Oops not connected")
  }

//Intializing  authentication
const auth=getAuth(app);
auth.settings.appVerificationDisabledForTesting=true;
if (auth){
    console.log("Authentication connect sucessfully");
  }
  else{
    console.error("Oops not connected");
  }
window.selectUser=function(){
  localStorage.setItem("role", "user");
  window.location.href = "citizen_login.html"
}

window.selectVolunteer=function() {
  localStorage.setItem("role", "volunteer");
  window.location.href = "volunteer_login.html"
}

window.setupRecaptcha=function(){
    if(window.recaptchaVerifier){
        window.recaptchaVerifier.clear();
        document.getElementById('recaptchaVerifier').innerHTML='';
    }
    window.recaptchaVerifier=new RecaptchaVerifier(auth,'recaptcha-container',{
        'size':'invisible' });
       
}
window.confirmationResult=null;

window.sendOTP = function(e) {
    if(e) e.preventDefault();

    console.log("Button pressed");
    const number = document.getElementById('phoneNumber').value;
    //const fullnumber="+91"+ number;
    console.log(number);

    setupRecaptcha(); 
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, number, appVerifier)
        .then((result) => {
            window.confirmationResult = result;
            console.log("result saved successfully")
            alert("OTP sent!");
            const otparea=document.getElementById('otp-area');

            if(otparea!=null){
                otparea.innerHTML= `
                <div class="input-container" >
                   <input type="text" id="otp-value" placeholder="Enter 6-digit" width="80%"><br>
                   <button type="button" onclick="verifyOTP()"> Verify </button>
                </div>
            `;

            document.getElementById('phoneNumber').parentElement.style.display = 'none';
            document.querySelector('input[placeholder="Enter your name"]').parentElement.style.display = 'none';
            document.getElementById('btn-otp').style.display ='none';
            document.getElementById('profession').parentElement.style.display = 'none';

            }
            else{
                console.log("Error do not found the id otp area");
                alert("Technical error");
            }

            
                 
            

        })
        .catch((error) => {
            console.log("SMS  not sent successfully")

            alert("Error: " + error.message);
        });
};

const role = localStorage.getItem("role");
window.verifyOTP =function() {
    console.log("Button pressed");
    const code=document.getElementById("otp-value").value;
    const user_name=document.querySelector('input[placeholder="Enter your name"]').value;
    const number = document.getElementById('phoneNumber').value;
    
    if(code.length!==6){
        alert("Enter the 6 digit number");
        return;
    }

    const confirmation=window.confirmationResult;
    if(confirmation){
         confirmation.confirm(code)
         .then((result) => {
            alert("Verified");
            const loggedInUser=result.user
            console.log("User verified successfully");
            if( role=='user'){
                const userRef=doc(db,"Users",loggedInUser.uid)
                setDoc(userRef,{
                    name:user_name,
                    phone:number,
                    uid:loggedInUser.uid,
                    loginTime:new Date()
                })
                .then(()=>{
                    alert("Profile  saved")
                    window.location.href="Dashboard_issue.html"
                })
                .catch((error) => {
                    console.log("Error"+ error.message);
                });

                    
            }
            else{
                const profession_=document.getElementById('profession').value;
                const userRef=doc(db,"Volunteers",loggedInUser.uid)
                setDoc(userRef,{
                    name:user_name,
                    phone:number,
                    profession:profession_,
                    uid:loggedInUser.uid,
                    loginTime:new Date()
                })
                .then(()=>{
                     alert("Profile  saved")
                     window.location.href="index.html"
                })
                .catch((error) => {
                    console.log("Error"+ error.message);
                });
                   
            }

        });
    }

    else{
        alert("error",error.message);
    }
}
const volunteers = {
  "Medical": {
    name: "Dr. Rahul",
    phone: "9876543210"
  },
  "Electrician": {
    name: "Amit Kumar",
    phone: "9123456780"
  },
  "Plumber": {
    name: "Rajesh Kumar",
    phone: "9988776655"
  }
};
// 🎤 GLOBAL DECLARATION
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "hi-IN";

// 🎤 RESULT HANDLER
recognition.onresult = (event) => {
  const text = event.results[0][0].transcript;
  document.getElementById('user-input').value = text;
};

// 🎤 START FUNCTION
window.startVoice = function() {
  console.log("Mic clicked");

  try {
    recognition.start();
  } catch (err) {
    console.error("Mic error:", err);
  }
};
function isValidInput(userText) {
  userText = userText.trim().toLowerCase();

  // बहुत छोटा input
  if (userText.length < 5) 
    return false;

  // सिर्फ random characters / numbers
  if (/^[a-zA-Z0-9]+$/.test(userText)) 
    return false;

  // greeting / useless words
  const invalidWords = ["hello", "hi", "test", "abc", "xyz"];
  if (invalidWords.includes(userText)){
    return false;
  }
  return true;
}

async function askGemini(userText) {
    if (!isValidInput(userText)) {
  document.getElementById("result-display").innerHTML =
    "❌ समझ नहीं आया। कृपया अपनी समस्या साफ लिखें।";
  return;
}
  try {
    console.log("Sending to backend:", userText);

    const response = await fetch(
      "http://127.0.0.1:5001/smart-allocation-app/us-central1/askAI",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: userText })
      }
    );

    const data = await response.json();
    console.log("Backend response:", data);

    // ✅ ERROR HANDLE
    if (data.error) {
      console.error("Backend error:", data.error);
      return null;
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) {
      console.error("No valid AI response");
      return null;
    }

    return JSON.parse(raw.replace(/```json|```/g, "").trim());

  } catch (err) {
    console.error(err);
    return null;
  }
}
async function saveAndDisplay(userText, ai) {

  const person = volunteers[ai.category] || {
    name: "General Team",
    phone: "N/A"
  };

  try {
    // 🔥 SAVE TO FIRESTORE
    const docRef = await addDoc(collection(db, "Issues"), {
      text: userText,
      category: ai.category,
      priority: ai.priority,
      assignedTo: person.name,
      phone: person.phone,
      timestamp: new Date()
    });

    console.log("Saved with ID:", docRef.id);

    // 🎯 SHOW RESULT
    document.getElementById("result-display").innerHTML = `
      <div style="border:2px solid ${ai.priority === 'High' ? 'red' : 'green'}; padding:15px; border-radius:10px;">
        <h3>✅ Issue Submitted Successfully</h3>
        <p><strong>Problem:</strong> ${userText}</p>
        <p><strong>Category:</strong> ${ai.category}</p>
        <p><strong>Priority:</strong> ${ai.priority}</p>
        <p><strong>Assigned To:</strong> ${person.name}</p>
        <p><strong>Phone:</strong> ${person.phone}</p>
        <a href="tel:${person.phone}">📞 Call Now</a>
      </div>
    `;

  } catch (err) {
    console.error("DB Error:", err);
    alert("Database error");
  }
}

window.handleFinalSubmit = async function() {

  const inputField = document.getElementById('user-input');
  const userText = inputField.value.trim();

  const display = document.getElementById("result-display");

  if (!userText) {
    alert("Enter problem first!");
    return;
  }

  display.innerHTML = "⏳ Processing...";

  const ai = await askGemini(userText);

  // ❌ INVALID INPUT
  if (ai?.invalid) {
    display.innerHTML = "❌ समझ नहीं आया। कृपया सही समस्या लिखें।";
    return;
  }

  // ❌ API ERROR
  if (!ai) {
    display.innerHTML = "⚠️ Server error. Try again.";
    return;
  }

  // ✅ SUCCESS
  await saveAndDisplay(userText, ai);

  inputField.value = "";
};
