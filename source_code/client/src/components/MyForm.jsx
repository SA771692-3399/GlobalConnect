// import React from "react";
// import "./mainCss.css";
// import logo from "../assets/GlobalConnect.png";
// export default function MyForm() {
//   return (
//     <>
//       <div className="registration-form">
//         <form  onSubmit={handleSubmit}>
//           <div className="register-logo">
//             <img src={logo} alt="Company Logo" />
//           </div>

//           <div className="form-group">
//           <select
//                 id="Role"
//                 className="form-control item"
//                 value={Role}
//                 onChange={(e) => setRole(e.target.value)}
//               >
//                 <option value="User">User</option>
//                 <option value="Seller">Seller</option>
//                 <option value="LocalOwner">LocalOwner</option>
//               </select>
//           </div>
//           <div className="form-group">
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="email"
//               value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="password"
//               className="form-control item"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <input
//               type="password"
//               className="form-control item"
//               value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//             />
//           </div>
//           <div className="form-group">
//             <button type="button" className="btn btn-block create-account" style={{background:"#7e5888"}}>
//               Create Account
//             </button>
//           </div>
//         </form>
//         <div className="login-link">
//             Already have an account? <Link to="/login">Login</Link>
//           </div>
//       </div>
//       <script
//         type="text/javascript"
//         src="https://code.jquery.com/jquery-3.2.1.min.js"
//       ></script>
//       <script
//         type="text/javascript"
//         src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.15/jquery.mask.min.js"
//       ></script>
//       <script src="assets/js/script.js"></script>
//     </>
//   );
// }
