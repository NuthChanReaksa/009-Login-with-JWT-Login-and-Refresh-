'use client';

import React, { useState } from 'react';

export default function TestJWT() {
    // Declare state variables at the top of your component
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState(null);

    // Handle Login
    const handleLogin = async () => {
        const email = "chanreaksanuth@gmail.com";
        const password = "admin@1234";

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // Assuming the response contains an access token and user information
            setAccessToken(data.accessToken);
            setUser(data.user);
        } catch (error) {
            console.error("Failed to login:", error);
        }
    };

    // Handle Partial Update
    const handlePartialUpdate = async () => {
        const body = {
            name: "casual wardrobe update1",
        };
        fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/products/${499}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((data) => console.log("Data from partial ",data))
            .then((response) => {
                console.log("Response from partial update: ", response);
            })
            .then((data) => {
                console.log("Data in jwt test: ", data);
            })
            .catch((error) => {
                console.error("Failed to update product:", error);
            });
    };

    return (
        <main className={"h-screen grid place-content-center"}>
            <h1 className={"text-5xl p-4"}>Test Handle Login</h1>

            {/* Login Button */}
            <button className={"p-4 bg-blue-600 rounded-3xl text-3xl text-gray-100"} onClick={handleLogin}>Login</button>
            {/* Partial Update Button */}
            <button className={"p-4 bg-blue-600 rounded-3xl text-3xl text-gray-100"} onClick={handlePartialUpdate}>Update Product</button>
        </main>
    );
}
