// import { Form } from "react-router-dom"

// // library
// import { UserPlusIcon } from "@heroicons/react/24/solid";

// // assets
// import illustration from "../assets/illustration.jpg"

// const Intro = () => {
//   return (
//     <div className="intro">
//       <div>
//         <h1>
//           Take Control of <span className="accent">Your Money</span>
//         </h1>
//         <p>
//           Personal budgeting is the secret to financial freedom. Start your journey today.
//         </p> 

// {/*          if (!confirm("user data will be saved?")) {
//                 event.preventDefault()
//               } */}
//         <Form
//           method="post"             
//           >
//           <input
//             type="text"
//             name="userName"
//             required
//             placeholder="What is your name?" aria-label="Your Name" autoComplete="given-name"
//           />
//           <input
//             type="text"
//             name="password"
//             required
//             placeholder="Enter Password" aria-label="Your Name" autoComplete="given-password"
//           />
//           <input type="hidden" name="_action" value="newUser" />
//           <button type="submit" className="btn btn--dark">
//             <span>Create Account</span>
//             <UserPlusIcon width={20} />
//           </button>
//         </Form>
//       </div>
//       {/* <img src={illustration} alt="Person with money" width={600} /> */}
//     </div>
//   )
// }
// export default Intro


import { useState } from "react";
import { Form } from "react-router-dom";
import { UserPlusIcon } from "@heroicons/react/24/solid";

const Intro = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ userName: "", password: "" });

  const validateForm = (userName, password) => {
    let isValid = true;
    const newErrors = { userName: "", password: "" };

    // Username validation (required and min length 3)
    if (!userName) {
      newErrors.userName = "Username is required.";
      isValid = false;
    } else if (userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters long.";
      isValid = false;
    }

    // Password validation (required, min length 6, complexity check)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 6 characters long, contain one uppercase, one lowercase, one number, and one special character.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission initially

    const formData = new FormData(event.target);
    const userName = formData.get("userName");
    const password = formData.get("password");

    // Validate the form
    if (validateForm(userName, password)) {
      setIsLoading(true);

      // Simulate form submission delay
      setTimeout(() => {
        event.target.submit(); // Submit the form after the loading state
      }, 1000); // Optional delay to demonstrate loading spinner
    }
  };

  return (
    <div className="intro">
      <div>
        <h1>
          Take Control of <span className="accent">Your Money</span>
        </h1>
        <p>
          Personal budgeting is the secret to financial freedom. Start your journey today.
        </p>

        <Form method="post" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="userName"
              required
              placeholder="What is your name?"
              aria-label="Your Name"
              autoComplete="given-name"
              minLength={3} // HTML5 validation
            />
            {errors.userName && <p className="error">{errors.userName}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter Password"
              aria-label="Your Password"
              autoComplete="current-password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$" // HTML5 pattern validation
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <input type="hidden" name="_action" value="newUser" />
          <button type="submit" className="btn btn--dark" disabled={isLoading}>
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              <>
                <span>Create Account</span>
                <UserPlusIcon width={20} />
              </>
            )}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default Intro;

