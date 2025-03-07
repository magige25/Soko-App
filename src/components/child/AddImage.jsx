import React, { useRef } from "react";

const AddImage = ({ onImageSelect, children }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            const previewURL = URL.createObjectURL(file);

            // Pass the file and preview URL to AddProduct
            onImageSelect(file, previewURL);
        }
    };

    return (
        <>
            <div onClick={() => fileInputRef.current.click()}>
                {children}
            </div>
            
            <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
            />
        </>
    );
};

export default AddImage;