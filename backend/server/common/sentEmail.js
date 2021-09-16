const mailjet = require("../utils/mail");

// TODO Send Mail with all info        
let from_mail = "aitor.java@gmail.com";
let from_name = "Peluquería ARKUS";
let to_mail = "kevin.covas.91@gmail.com";
let to_name = "Kevin";
let text_part = "Test Email Texto";
let custom_id = "AppGettingStartedTest";


//HTML de correo de Cambio de Contraseña
let html_cambioContraseña = `
<br />Como solicitaste, a continuación le mostramos el link para cambiar la contraseña:
<br> LINK: 
 `;

 

module.exports = {
    from_mail,
    from_name,
    to_mail,
    to_name,
    text_part,
    html_cambioContraseña,
    custom_id,
};