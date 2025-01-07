import React, { useEffect, useState } from 'react';
import { AddressElement, useElements } from '@stripe/react-stripe-js';
import "./Account.css"
import { addNewAddress, editAddress, useUserAddress } from '../../apiManager/methods/addressMethods';
import { useLocation, useNavigate } from 'react-router-dom';


const AddAccountAddress = () => {
    const elements = useElements();
    const navigate = useNavigate(); // Initialize the navigate function

    const location = useLocation(); // Access the location object
    const { state } = location; // Get the state passed via navigate
    const [existingAddress, setExistingAddress] = useState(state?.address || null);
    const [addressName, setAddressName] = useState(existingAddress ? existingAddress.addressName : '');


    useEffect(() => {
        if (existingAddress) {
            // Prefill the AddressElement
            const addressElement = elements?.getElement('address');
            if (addressElement) {
                addressElement.update(
                    {
                        fields: {
                            phone: 'always', // Include the phone number field
                        },
                        defaultValues: {
                            name: existingAddress.name,
                            address: {
                              line1: existingAddress.line1,
                              line2: existingAddress.line2,
                              city: existingAddress.city,
                              state: existingAddress.state,
                              postal_code: existingAddress.postalCode,
                              country: existingAddress.phone,
                            },
                          },
                    });
            }
        }
    }, [existingAddress, elements]);

    const handleNextStep = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(event.currentTarget);
        const addressName = formData.get('addressName'); // Safely retrieve the value

        const addressElement = elements?.getElement('address');
        if (!addressElement) {
            console.error('Address Element not found!');
            return;
        }

        const { complete, value } = await addressElement.getValue();

        if (complete) {

            console.log('Address Name:', addressName);
            console.log('Address:', value.address);
            console.log('Phone:', value);
            
            try {

                if (existingAddress){
                    await editAddress(existingAddress.addressName, addressName, value.name, value.address.line1, 
                        value.address.line2, value.address.city, value.address.state, 
                        value.address.postal_code, value.address.country, value.phone)

                } else {
                    await addNewAddress(addressName, value.name, value.address.line1, 
                        value.address.line2, value.address.city, value.address.state, 
                        value.address.postal_code, value.address.country, value.phone)
                }

                navigate(-1);  // This goes back to the previous page
            } catch (error) {
                console.log(error.message)
            }
        } else {
            console.error('Address form is incomplete.');
        }
    };

    // Handle Address Name changes
    const handleAddressNameChange = (event) => {
        setAddressName(event.target.value);
    };

    return (
        <div className='payment-option-container'>
            <div className='payment-option-header'>
            <h1>{existingAddress ? `Edit Address: ${existingAddress.addressName}` : 'Add a New Address'}</h1>
            </div>

            <form className="card-detail-form" onSubmit={handleNextStep}>
                <div className="form-field">
                    <label htmlFor="address-name">Address Name</label>
                    <input
                        type="text"
                        id="address-name"
                        name="addressName"
                        value={addressName}  // Controlled input
                        onChange={handleAddressNameChange} 
                        placeholder="e.g., Home, Office, etc."
                        required
                    />
                </div>

                <AddressElement
                    options={{
                        mode: 'shipping',
                        fields: {
                            phone: 'always', // Include the phone number field
                        },
                        // Conditional check for existingAddress to set default values
                        defaultValues: existingAddress ? {
                            name: existingAddress.name || '',
                            address: {
                                line1: existingAddress.line1 || '',
                                line2: existingAddress.line2 || '',
                                city: existingAddress.city || '',
                                country: existingAddress.country || "",
                                state: existingAddress.state || '',
                                postal_code: existingAddress.postalCode || '',
                            },
                            phone: existingAddress.phone || ''
                        } : {},
                    }}
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddAccountAddress;