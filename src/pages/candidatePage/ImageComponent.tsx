import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../API/candidatesApi';

interface ImageProps {
    token: string;
    id: string;
    image: {
        fileName: string;
    };
}

export const ImageComponent: React.FC<ImageProps> = ({ token, id, image }) => {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchImageUrl = async () => {
            if (id && image.fileName) {
                try {
                    const url = await getImageUrl(token, id, image.fileName);
                    setImageUrl(url);
                } catch (error) {
                    console.error('Error fetching image URL:', error);
                }
            }
        };

        fetchImageUrl();
    }, [token, id, image.fileName]);

    // const handleImageClick = async (event: React.MouseEvent) => {
    //     event.stopPropagation(); // Prevent event bubbling to avoid file upload
    //     if (imageUrl) {
    //         window.open(imageUrl, '_blank');
    //     }
    // };
    const handleImageClick = async () => {
        if (imageUrl) {
            // Convert Base64 to Blob
            const byteCharacters = atob(imageUrl.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });

            // Create an object URL
            const url = URL.createObjectURL(blob);

            // Open in a new tab
            window.open(url, '_blank');

            // Revoke the object URL after some time to free up memory
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    };


    return (
        <div key={image.fileName} className="w-36 h-36 flex items-center space-x-2">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={image.fileName}
                    className="w-full h-full object-cover rounded-full cursor-pointer"
                    onClick={handleImageClick}
                />
            ) : (
                <p>Loading image...</p>
            )}
        </div>
    );
};



//! End
// import React, { useState, useEffect } from 'react';
// import { getImageUrl } from '../../API/candidatesApi';

// interface ImageProps {
//     token: string;
//     id: string;
//     image: {
//         fileName: string;
//     };
// }

// export const ImageComponent: React.FC<ImageProps> = ({ token, id, image }) => {
//     const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

//     useEffect(() => {
//         const fetchImageUrl = async () => {
//             if (id && image.fileName) {
//                 try {
//                     const url = await getImageUrl(token, id, image.fileName);
//                     setImageUrl(url);
//                 } catch (error) {
//                     console.error('Error fetching image URL:', error);
//                 }
//             }
//         };

//         fetchImageUrl();
//     }, [token, id, image.fileName]);

//     const handleImageClick = async () => {
//         if (imageUrl) {
//             // Open the image in a new tab using the Base64 URL
//             // window.open(imageUrl, '_blank');
//             window.open(await getImageUrl(token, id!, image.fileName), '_blank')
//         }
//     };

//     return (
//         <div key={image.fileName} className="flex items-center space-x-2">
//             {imageUrl ? (
//                 <img
//                     src={imageUrl}
//                     alt={image.fileName}
//                     className="w-full h-full object-cover rounded-full cursor-pointer"
//                     onClick={handleImageClick}
//                 />
//             ) : (
//                 <p>Loading image...</p>
//             )}
//         </div>
//     );
// };

//! End
// import React, { useState, useEffect } from 'react';
// import { getImageUrl } from '../../API/candidatesApi';

// interface ImageProps {
//     token: string;
//     id: string;
//     image: {
//         fileName: string;
//     };
// }

// export const ImageComponent: React.FC<ImageProps> = ({ token, id, image }) => {
//     const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

//     useEffect(() => {
//         const fetchImageUrl = async () => {
//             if (id && image.fileName) {
//                 try {
//                     const url = await getImageUrl(token, id, image.fileName);
//                     console.log("url: ", url);
//                     setImageUrl(url);
//                 } catch (error) {
//                     console.error('Error fetching image URL:', error);
//                 }
//             }
//         };

//         fetchImageUrl();
//     }, [token, id, image.fileName]);

//     const handleImageClick = async () => {
//         if (imageUrl) {
//             console.log("imageUrl: ", imageUrl);
//               window.open(imageUrl, '_blank');
//             // window.open(await getImageUrl(token, id!, image.fileName), '_blank')
//         }
//     };

//     return (
//         <div key={image.fileName} className="flex items-center space-x-2">
//             {imageUrl ? (
//                 <img
//                     src={imageUrl}
//                     alt={image.fileName}
//                     className="w-full h-full object-cover rounded-full cursor-pointer"
//                     onClick={handleImageClick} // Ensure this is triggered by a user click
//                 />
//             ) : (
//                 <p>Loading image...</p>
//             )}
//         </div>
//     );
// };

//! End
// import React, { useState, useEffect } from 'react';
// import { getImageUrl } from '../../API/candidatesApi';

// interface ImageProps {
//     token: string;
//     id: string;
//     // image: string;
//     image: {
//       fileName: string;
//     //   fileData: string; // Assuming fileData is a base64 or a URL
//     };
//   }

// // export const ImageComponent = ({ token, id, image }) => {
// export const ImageComponent: React.FC<ImageProps> = ({ token, id, image }) => {
//     const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

//     useEffect(() => {
//         const fetchImageUrl = async () => {
//             if (id && image.fileName) {
//                 const url = await getImageUrl(token, id, image.fileName);
//                 setImageUrl(url);
//             }
//         };

//         fetchImageUrl();
//     }, [token, id, image.fileName]);

//     return (
//         // <div>
//         //   {imageUrl ? (
//         //     <img src={imageUrl} alt={image.fileName} />
//         //   ) : (
//         //     <p>Loading image...</p>
//         //   )}
//         // </div>
//         <div key={image.fileName} className="flex items-center space-x-2">
//             <img
//                 // src={getImageUrl(id!, image.fileName)}
//                 // src={getImageUrl(token, id!, image.fileName)}
//                 src={imageUrl}
//                 alt={image.fileName}
//                 className="w-full h-full object-cover rounded-full cursor-pointer"
//                 // onClick={() => window.open(getImageUrl(id!, image.fileName), '_blank')}
//                 onClick={async () => window.open(await getImageUrl(token, id!, image.fileName), '_blank')}
//             />
//         </div>
//     );
// };
