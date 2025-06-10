import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email format is invalid";
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/identify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, phoneNumber })
      });

      const data = await response.json();
      console.log("Result from backend:", data);
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Check the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Contact Identifier</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {formErrors.email && <p className="error">{formErrors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          {formErrors.phoneNumber && <p className="error">{formErrors.phoneNumber}</p>}
        </div>

        <div className="btn">
          <button type="submit" disabled={loading}>
            {loading ? "Identifying..." : "Identify"}
          </button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h2>Result :</h2>
          <p>
            <strong>Primary Contact ID:</strong> {result.primaryContactId}
          </p>
          <p>
            <strong>Emails:</strong> {result.emails.join(", ")}
          </p>
          <p>
            <strong>Phone Numbers:</strong> {result.phoneNumbers.join(", ")}
          </p>
          <p>
            <strong>Secondary Contact IDs:</strong>{" "}
            {result.secondaryContactIds.length === 0
              ? "[]"
              : result.secondaryContactIds.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
