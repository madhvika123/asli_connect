const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const userRelationRoutes = require("./userRelationRoutes");
const jobRoutes = require('./jobRoutes');
const jobApplicationRoute = require('./jobApplicationRoute');
const walletRoute = require('./walletRoutes');
const reelsRoutes = require('./reelsRoutes');
const followRoutes = require('./followRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');

// admin routes
const adminRoutes = require('./admin/authRoutes');
const adminProfileRoutes = require('./admin/profileRoutes');
const userRoutes = require('./admin/userRoutes');
const custUserRoutes = require('./admin/custUserRoutes');

module.exports = [
  { path: "/auth", router: authRoutes },
  { path: "/profile", router: profileRoutes },
  { path: "/user-relation", router: userRelationRoutes },
  { path: "/jobs", router: jobRoutes},
  { path: "/job-application", router: jobApplicationRoute},
  { path: "/wallet", router: walletRoute},
  { path: "/reels", router: reelsRoutes },
  // { path: "/follow", router: followRoutes},
  { path: "/category", router: categoryRoutes},
  { path: "/products", router: productRoutes },

  { path: "/admin", router: adminRoutes },
  { path: "/admin-profile", router: adminProfileRoutes},
  { path: "/admin-user", router: userRoutes},
  { path: "/customers", router: custUserRoutes},
];