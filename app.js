import QRCode from 'qrcode';

/**
 * GÃŠnÃ¨re un QR Code au format Data URL depuis du texte
 */
export const generateQRCodeDataUrl = async (data) => {
    return await QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    });
};

generateQRCodeDataUrl('THE GOURMET SPOT').then(url => {
    console.log(url); // Affiche le Data URL du QR Code
}).catch(err => {
    console.error('Erreur lors de la gÃŠnÃ¨ration du QR Code :', err);
})