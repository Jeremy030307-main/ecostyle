import "./Checkout.css"
import logo_text_image from "../Components/Assets/logo_text.png"


const CheckoutHeader = () => {

    return (
        <div className="checkout-header">
            <div className="checkout-header-back-btn">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
            <p>Back to Cart</p>
            </div>
            <img src={logo_text_image} alt="" className="checkout-header-logo-text"/>
        </div>
    );
  };
  
export default CheckoutHeader;