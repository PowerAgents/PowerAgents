"use client";

// Add this
import { useAuth } from "@crossmint/client-sdk-react-ui";

function AuthButton() {
    const { login, logout, user, jwt } = useAuth();
  
    return (
      <div className="flex gap-4">
        {user == null ? (
          <button
            type="button"
            onClick={login}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        ) : (
          <button
            type="button"
            onClick={logout}
            className="bg-black text-white font-bold py-2 px-4 rounded border-2 border-blue-500"
          >
            Logout
          </button>
        )}
        <p>User: {user?.userId}</p>
        <p>Email: {user?.email ?? "Not email"}</p>
        <p>Phone Number: {user?.phoneNumber ?? "Not phone number"}</p>
        <p>Farcaster username: {user?.farcaster?.username ?? "None"}</p>
        <p>Google display name: {user?.google?.displayName ?? "None"}</p>
        <p>JWT: {jwt}</p>
      </div>
    );
  }
  
export default AuthButton