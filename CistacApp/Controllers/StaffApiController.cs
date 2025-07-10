using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CistacApp.Data;
using CistacApp.Models;

namespace CistacApp.Controllers
{
    [ApiController]
    [Route("api/staff")]
    public class StaffApiController : ControllerBase
    {
        private readonly CistacDbContext _context;

        public StaffApiController(CistacDbContext context)
        {
            _context = context;
        }

        // GET: api/staff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Staff>>> GetAllStaff()
        {
            return await _context.Staff
                .Include(s => s.Hotel)
                .ToListAsync();
        }

        // GET: api/staff/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Staff>> GetStaff(int id)
        {
            var staff = await _context.Staff
                .Include(s => s.Hotel)
                .FirstOrDefaultAsync(s => s.StaffId == id);

            if (staff == null)
                return NotFound();

            return staff;
        }

        // POST: api/staff
        [HttpPost]
        public async Task<ActionResult<Staff>> CreateStaff([FromBody] Staff staff)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            staff.CreatedAt = DateTime.UtcNow;
            _context.Staff.Add(staff);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStaff), new { id = staff.StaffId }, staff);
        }

        // PUT: api/staff/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaff(int id, [FromBody] Staff staff)
        {
            if (id != staff.StaffId)
                return BadRequest("Staff ID mismatch.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingStaff = await _context.Staff.FindAsync(id);
            if (existingStaff == null)
                return NotFound();

            try
            {
                existingStaff.HotelId = staff.HotelId;
                existingStaff.Name = staff.Name;
                existingStaff.Surname = staff.Surname;
                existingStaff.Position = staff.Position;
                existingStaff.EMail = staff.EMail;
                existingStaff.Shift = staff.Shift;
                existingStaff.PhoneNumber = staff.PhoneNumber;
                existingStaff.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Staff updated successfully." });
            }
            catch (Exception ex)
            {
                // Hata mesajını response olarak gönderiyoruz
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        // DELETE: api/staff/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null)
                return NotFound();

            _context.Staff.Remove(staff);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
