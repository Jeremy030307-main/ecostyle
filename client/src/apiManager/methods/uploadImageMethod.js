import { ApiMethods } from "../ApiMethods";


export const uploadImage = (imagefile) => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Client-ID {{clientId}}");

    var formdata = new FormData();
    formdata.append("image", imagefile, "GHJQTpX.jpeg");
    formdata.append("type", "image");
    formdata.append("title", "Simple upload");
    formdata.append("description", "This is a simple image upload in Imgur");

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
    };

    fetch("https://api.imgur.com/3/image", requestOptions)
    .then(response =>  console.log(response.text()))
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}