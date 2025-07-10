using CistacApp.Data;
using CistacApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CistacApp.ApiControllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountApiController : ControllerBase
    {
        private readonly CistacDbContext _context;
        private readonly IConfiguration _configuration;

        public AccountApiController(CistacDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/ApiAccount/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.EMail == model.Email && u.Password == model.Password);

            if (user == null)
                return Unauthorized(new { message = "Invalid credentials." });

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.UserId,
                    user.EMail,
                    user.Name,
                    user.Surname,
                    user.Role
                }
            });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.EMail),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Name + " " + user.Surname),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpireMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public class RegisterViewModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;

            [Required]
            [MinLength(6)]
            public string Password { get; set; } = string.Empty;

            [Required]
            public string Name { get; set; } = string.Empty;

            [Required]
            public string Surname { get; set; } = string.Empty;

            // Yeni eklenen opsiyonel PhoneNumber alanı
            [Phone]
            public string? PhoneNumber { get; set; }  // nullable olarak
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.Users.AnyAsync(u => u.EMail == model.Email))
                return BadRequest(new { message = "Email already registered." });

            var user = new User
            {
                Name = model.Name,
                Surname = model.Surname,
                EMail = model.Email,
                Password = model.Password, // Not: gerçekte hash’le
                Role = "customer", // veya istediğin default rol
                PhoneNumber = model.PhoneNumber, // Burada hata olmaz artık

                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }


    }


}
