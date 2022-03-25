
const clickButton = document.getElementById("search-button")
const searchContent = document.getElementById("search-content")

clickButton.addEventListener("click", searchPhoto);

function searchPhoto() {
    
    var value=searchContent.value
    var ul=document.getElementById("photo-list")
    var serachResult=apigClient.searchGet({"q":value}).then((response) => {
        //This is where you would put a success callback
        var url=response.data.body//["https://photo-album-b2.s3.amazonaws.com/download.jpeg","https://photo-album-b2.s3.amazonaws.com/1.jpg"]
        for (let i = 0; i < url.length; i++){
            var li = document.createElement("li")
            
            var img=document.createElement('img')
            img.src="https://photo-album-b2.s3.amazonaws.com/"+url[i]
            li.appendChild(img)
            ul.appendChild(li)
    }

    })
    
    
    
}


const clearButton = document.getElementById('clear-button')

clearButton.addEventListener("click", () => {
    // 1. write a function that removes any previous results from the page
    document.getElementById("photo-list").innerHTML=""
})

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);


        fileReader.onload = () => {
            
            let encodedImage = fileReader.result.toString().replace(/^data:(.*;base64,)?/, '');
            
            if ((encodedImage.length%4)>0) {
              encodedImage += '='.repeat(4 - (encodedImage.length % 4));
            }
            
            document.getElementById('custom-label').value=encodedImage


            resolve(encodedImage);
        };
        fileReader.onerror = error => reject(error);
        
    })
}

const uploadphoto= document.getElementById("upload-photo")
const image=document.getElementById("file")
uploadphoto.addEventListener("click",e=>{
    e.preventDefault();

    const formData= new FormData();

    var imagefile=image.files[0]
    const reader=new FileReader();
    reader.onload=()=>{
        data=reader.result
        //apigClient.uploadFolderObjectPut({'folder':'photo-album-b2','object':'car.jpg','x-amz-meta-customLabels': 'car','Content-Type': imagefile.type,'Accept':'*/*'},data)
        var currentdate = new Date();
        var output_filename = currentdate.getDate()+"_" +(currentdate.getMonth()+1)+"_" + currentdate.getFullYear()+"_"
        + currentdate.getHours()+'_'
        + currentdate.getMinutes()+'_'
        + currentdate.getSeconds();

        fetch("https://6vx72kpgj9.execute-api.us-east-1.amazonaws.com/test/upload/photo-album-b2/"+output_filename+".jpg",
        {
           method: "PUT",
           body: data,
           headers:{'x-amz-meta-customLabels': document.getElementById('custom-lable').value,'Content-Type': imagefile.type,'Accept':'*/*'}
       })
       
    };
    reader.readAsArrayBuffer(imagefile)
    //getBase64(imagefile).then(data => 
    //  apigClient.uploadFolderObjectPut({'folder':'photo-album-b2','object':'car.jpg','x-amz-meta-customLabels': 'car','Content-Type': imagefile.type,'Accept':'*/*'},data))
        /*
    apigClient.uploadFolderObjectPut({'folder':'photo-album-b2','object':'test.jpg','x-amz-meta-customLabels':'car'}, image.files[0])
    */
    /*
    const config = {
        headers: {
         'Content-Type': 'multipart/form-data'
        }
     }
    //axios.put("https://6vx72kpgj9.execute-api.us-east-1.amazonaws.com/test/upload/photo-album-b2/test.jpg", formData, config)
    */

    /*
    formData.append('image', {
        uri: image.uri,
        name: image.uri.split('/').pop(), //split the uri at / and get the last element of the resulting array which actually is the name with the image extention (e.g, abc.jpg)
       type: image.type // type needs to be modified. keep reading
    })
    */
    //formData.append('image', image.blob())
    /*
    var reader = new FileReader()
    reader.onloadend = function() {
        console.log('Encoded Base 64 File String:', reader.result);
        
        
        var data=(reader.result).split(',')[1];
        var binaryBlob = atob(data);
        console.log('Encoded Binary File String:', binaryBlob);
      }
    reader.readAsDataURL(file);
    */

    
    //getBase64(imagefile).then(data=>
    //    fetch("https://6vx72kpgj9.execute-api.us-east-1.amazonaws.com/test/upload/photo-album-b2/car.jpg",
    //    {
    //        method: "PUT",
    //        body: data,
            //headers:{'x-amz-meta-customLabels': 'car','Content-Type': imagefile.type,'Accept':'*/*'}
    //    })
    //)
    
}
)
