import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../assets/Style/register.css";

const Register = () => {
  const initialValues = {
    nom: "",
    email: "",
    motDePasse: "",
    role: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);

    // Check if there are errors before redirecting
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:3000/api/users/register', formValues);
        console.log('Registration successful');

        navigate('/login'); // redirect to the login page
      } catch (error) {
        console.error('Registration failed', error);
      }
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors, formValues, isSubmit]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.nom) {
      errors.nom = "Nom is required!";
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }

    if (!values.motDePasse) {
      errors.motDePasse = "Mot de Passe is required";
    } else if (values.motDePasse.length < 4) {
      errors.motDePasse = "Mot de Passe must be more than 4 characters";
    } else if (values.motDePasse.length > 10) {
      errors.motDePasse = "Mot de Passe cannot exceed more than 10 characters";
    }

    if (!values.role) {
      errors.role = "Role is required";
    }

    return errors;
  };

  return (
    <>
      <div className="bgImg"></div>
      <div className="container">
        {Object.keys(formErrors).length === 0 && isSubmit ? (
          <div className="ui message success">
            Signed in successfully
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <div className="ui divider"></div>
                <div className="ui form">
                <div className="field">
                <label>Nom</label>
                <input
                type="text"
                name="nom"
                placeholder="Choose a nom"
                value={formValues.nom}
                onChange={handleChange}
              />
              <span>{formErrors.nom}</span>
                </div>
                <div className="field">
              <label>Email</label>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleChange}
              />
              <span>{formErrors.email}</span>
                </div>
                <div className="field">
              <label>Mot de Passe</label>
              <input
                type="password"
                name="motDePasse"
                placeholder="Mot de Passe"
                value={formValues.motDePasse}
                onChange={handleChange}
              />
                <span>{formErrors.motDePasse}</span>
                </div>
                 <div className="field">
              <label>Role</label>
              <select
                name="role"
                value={formValues.role}
                onChange={handleChange}
              >
                <option value="">Choose a role</option>
                <option value="administrateur">Administrateur</option>
                <option value="utilisateur">Utilisateur</option>
              </select>
              <span>{formErrors.role}</span>
                </div>
             <button className="fluid ui button blue">Submit</button>
             </div>
         </form>
          <div className="text">
             Already have an account? <span onClick={() => navigate('/login')}>Login</span>
            </div>
             </div>{" "}
    </>
  );
}

export default Register;
