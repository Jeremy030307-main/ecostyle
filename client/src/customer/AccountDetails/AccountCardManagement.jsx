import { useEffect, useState } from "react";
import { ApiMethods } from "../../apiManager/ApiMethods";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Outlet } from "react-router-dom";
import { getClientSecret } from "../../apiManager/methods/paymentMethod";

const stripePromise = loadStripe('pk_test_51PnWiiGrBUkxkf9EfMve8DW3an5XYGU1KGENbAdVsfeJHDmVz7ARJmwOQ40uRe0qqkiak6MxzxXhC40hcnaKL9zG00CQSMphuS');

const AccountCardManagement = ({ includeClientSecret = true }) => {

    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
      const fetchClientSecret = async () => {
        if (includeClientSecret) {
          try {
            const data = await getClientSecret();
            setClientSecret(data.client_secret);
          } catch (error) {
            console.error('Error fetching client secret:', error);
          }
        }
      };
  
      fetchClientSecret();
    }, [includeClientSecret]);

    const appearance = {
        theme: 'flat',
        variables: {
          fontFamily: ' "Gill Sans", sans-serif',
          fontLineHeight: '1.5',
          borderRadius: '10px',
          colorBackground: '#F6F8FA',
          accessibleColorOnColorPrimary: '#262626'
        },
        rules: {
          '.Block': {
            backgroundColor: 'var(--colorBackground)',
            boxShadow: 'none',
            padding: '12px'
          },
          '.Input': {
            padding: '12px'
          },
          '.Input:disabled, .Input--invalid:disabled': {
            color: 'lightgray'
          },
          '.Tab': {
            padding: '10px 12px 8px 12px',
            border: 'none'
          },
          '.Tab:hover': {
            border: 'none',
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
          },
          '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
            border: 'none',
            backgroundColor: '#fff',
            boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
          },
          '.Label': {
            fontWeight: '500'
          }
        }
      };
    
    const options = includeClientSecret
    ? clientSecret
      ? {
          clientSecret: clientSecret,
          appearance: appearance,
        }
      : null
    : { appearance: appearance };

    if (includeClientSecret && !clientSecret) {
      return <div>Loading...</div>;
    }

  return (
    <Elements stripe={stripePromise} options={options}>
      <Outlet />
    </Elements>
  );
};

export default AccountCardManagement;