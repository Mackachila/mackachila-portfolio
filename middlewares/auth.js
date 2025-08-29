  

// function isAuthenticated(req, res, next) {
//     // Allow access if either email (normal user) or reg_number (admin) is in session
//     if (!req.session || (!req.session.email && !req.session.reg_number && !req.session.code_number)) {
//         return res.redirect('/login');
//     }
//     next();
//   }
  

  // module.exports = { isAuthenticated};
  

  
// function isAuthenticated(req, res, next) {
//   // Allow access if either email (normal user) or reg_number (admin) is in session
//   if (!req.session || (!req.session.email && !req.session.reg_number && !req.session.code_number)) {
//       return res.redirect('/home');
//   }
//   next();
// }
// function isAuthenticated(req, res, next) {
//   // Allow only normal users (email in session)
//   if (!req.session || !req.session.email) {
//       return res.redirect('/login');
//   }
//   next();
// }

function isAuthenticated(req, res, next) {
  if (
    !req.session || 
    !req.session.email || 
    req.session.role !== 'student'
  ) {
    return res.redirect('/login'); // 
  }
  next();
}


function isAdminAuthenticated(req, res, next) {
  if (
    !req.session || 
    !req.session.email || 
    req.session.role !== 'admin'
  ) {
    return res.redirect('/beybos'); // 
  }
  next();
}



// function isDoctorAuthenticated(req, res, next) {
//   // Allow only admins (reg_number in session)
//   if (!req.session || !req.session.reg_number) {
//       return res.redirect('/home');
//   }
//   next();
// }

// function isAdminAuthenticated(req, res, next) {
//   // Allow only admins (reg_number in session)
//   if (!req.session || !req.session.code_number) {
//       return res.redirect('/home');
//   }
//   next();
// }
module.exports = { isAuthenticated, isAdminAuthenticated};