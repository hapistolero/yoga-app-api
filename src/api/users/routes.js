const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: (request, h) => handler.registerUsersHandler(request, h),
  },
  {
    method: "POST",
    path: "/admin",
    handler: (request, h) => handler.registerAdminHandler(request, h),
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: () => handler.getUserByIdHandler(),
  },
]

module.exports = routes
