using Microsoft.AspNetCore.Mvc;
using CistacApp.Models;
using CistacApp.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore; // for First or Default 


namespace CistacApp.Models
{
    public class AccountController : Controller
    {
        private readonly CistacDbContext _context;
        public AccountController(CistacDbContext context)
        {
            _context = context;
        }

        // GET: Account/Login
        [HttpGet]
        public IActionResult Login(string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        // POST: /Account/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            if (ModelState.IsValid)
            {
                if (_context.Users == null)
                {
                    ModelState.AddModelError(string.Empty, "User data is not available.");
                    return View(model);
                }

                // !!! SECURITY WARNING: Plain text password comparison !!!
                // This is for demonstration with your current schema ONLY.
                // In a real application, you MUST hash passwords and compare hashes.
                var user = await _context.Users
                                     .FirstOrDefaultAsync(u => u.EMail == model.Email && u.Password == model.Password);
                // Assuming your User model has EMail and Password properties

                if (user != null)
                {
                    // Create claims
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.EMail), // Using email as the name claim
                        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), // Storing UserID
                        new Claim("FullName", $"{user.Name} {user.Surname}"), // Example custom claim
                        new Claim(ClaimTypes.Role, user.Role.ToString()) // Assuming Role is an int/enum in User model
                        // Add other claims as needed, e.g., user.Role
                    };

                    // Create claims identity
                    var claimsIdentity = new ClaimsIdentity(
                        claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    // Sign in
                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity),
                        new AuthenticationProperties
                        {
                            IsPersistent = model.RememberMe, // For "Remember Me"
                            ExpiresUtc = model.RememberMe ? DateTimeOffset.UtcNow.AddDays(30) : (DateTimeOffset?)null // Cookie persistence
                        });

                    // Log successful login (optional)
                    // _logger.LogInformation($"User {user.EMail} logged in.");

                    if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }
                    else
                    {
                        return RedirectToAction("Index", "Home"); // Or your desired default page
                    }
                }
                else
                {
                    // !!! SECURITY: Do not reveal if username or password was wrong specifically.
                    ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                    return View(model);
                }
            }
            // If we got this far, something failed, redisplay form
            return View(model);
        }

        // POST: /Account/Logout
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            // Log successful logout (optional)
            // _logger.LogInformation("User logged out.");
            return RedirectToAction("Index", "Home"); // Redirect to home or login page
        }

        // GET: /Account/AccessDenied
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }

    }
}
