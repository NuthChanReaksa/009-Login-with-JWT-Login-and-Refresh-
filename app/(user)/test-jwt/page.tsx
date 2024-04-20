'use client';

import React, { useState } from 'react';

export default function TestJWT() {
    // Declare state variables at the top of your component
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState(null);
    const [unauthorized, setUnauthorized] = useState(false);

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
        const res = await  fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/products/${499}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        })
       if (res.status === 401) {
           setUnauthorized(true);
       }
       const data = await res.json();
        console.log("Data from partial update: ", data)
    };

    // handle refresh token
    const handleRefreshToken = async () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({}),
        }).then((res) => res.json())
            .then((data) => {
                setAccessToken(data.accessToken);
            console.log("Data from refresh token: ", data);
        }).catch((error) => {
            console.log("Failed to refresh token:", error);
        }
        );
    };


    return (
        <main className={"h-screen grid place-content-center"}>
            <h1 className={"text-5xl p-4 mb-4"}>Test Handle Login</h1>

            {/* Login Button */}
            <button className={"my-4 p-4 bg-blue-600 rounded-3xl text-3xl text-gray-100 mt-4"}
                    onClick={handleLogin}>Login
            </button>
            {/* Partial Update Button */}
            <button className={"my-4 p-4 bg-blue-600 rounded-3xl text-3xl text-gray-100"}
                    onClick={handlePartialUpdate}>
                Update Product</button>

            {unauthorized && (
                <button className={"my-4 p-4 bg-blue-600 rounded-3xl text-3xl text-gray-100"}
                                      onClick={handleRefreshToken}>Refresh Token
            </button>
            )}


        </main>
    );

}
