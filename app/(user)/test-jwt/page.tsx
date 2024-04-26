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
            const response = await fetch(process.env.NEXT_PUBLIC_DJANGO_API_URL + '/api/user/login/', {
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
            setAccessToken(data.access_token);
            console.log(data)
            setUser(data.user);
        } catch (error) {
            console.error("Failed to login:", error);
        }
    };

    // Handle Partial Update
    const handlePartialUpdate = async () => {
        console.log(accessToken)
        const body = {
            name: "casual wardrobe update45",
        };
        const res = await  fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/products/${594}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        })
        const data = await res.json();
        console.log(data);

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

    // handle logout
    const handleLogout = async () => {
        const url = process.env.NEXT_PUBLIC_API_URL + "/logout";
        console.log(url);
        fetch(process.env.NEXT_PUBLIC_API_URL + "/logout" , {

            method: "POST",
            credentials: "include",
            body: JSON.stringify({}),
        }).then((res) => res.json())
            .then((data) => {
                setAccessToken(data.accessToken);
                setUser(null);
            console.log("Data from logout: ", data);
        }).catch((error) => {
            console.log("Failed to logout:", error);
        }
        );
    }


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
                Update Product
            </button>
            {/*Refresh token Button*/}
            {unauthorized && (
                <button className={"my-4 p-4 bg-blue-600 rounded-3xl text-3xl text-gray-100"}
                        onClick={handleRefreshToken}>Refresh Token
                </button>
            )}
            {/*Logout Button*/}
            <button className={"my-4 p-4 bg-blue-600 rounded-3xl text-3xl text-gray-100"}
                    onClick={handleLogout}>
                Logout
            </button>

        </main>
    );

}
