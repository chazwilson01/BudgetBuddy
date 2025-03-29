import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/Context";

const Home = () => {
    const navigate = useNavigate();
    const { userId, plaidConnect, hasBudget  } = useUser();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
        document.body.appendChild(script);

        console.log(userId);
      }, []);
    
      const launchPlaid = async () => {
        const res = await fetch("https://localhost:5252/api/plaid/create-link-token");
        const { link_token } = await res.json();
      
        const handler = window.Plaid.create({
          token: link_token,
          onSuccess: async (public_token, metadata) => {
            await fetch("https://localhost:5252/api/plaid/exchange-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ publicToken: public_token, userId: userId }),
            });
            alert("Bank linked successfully!");
            navigate("/dashboard");

            console.log(metadata);
          },
        });
      
        handler.open();
      };

      const checkUser = async () => {
        const res = await fetch("https://localhost:5252/api/Auth/me", { withCredentials: true })
        console.log(res);
      }
      
    
      return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-blue-900 ">
          <div className="ml-50 flex flex-col items-center justify-center gap-4"> 
            <h1 className="text-2xl font-bold">Finance Tracker</h1>
            <div className="flex items-center justify-center gap-4">

              {!plaidConnect && (
                  <button onClick={launchPlaid}>Connect Bank</button>
              )}
              {!hasBudget && (
                <button onClick={checkUser}>Check User</button>
              )}
            </div>
          </div>
        </div>
      );
}


export default Home;