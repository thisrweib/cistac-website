using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CistacApp.Data;
using CistacApp.Models;

namespace CistacApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserApiController : ControllerBase
    {
        private readonly CistacDbContext _context;

        public UserApiController(CistacDbContext context)
        {
            _context = context;
        }

        // GET: api/UserApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/UserApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            return user;
        }
    }
}
