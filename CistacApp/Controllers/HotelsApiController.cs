using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CistacApp.Data;
using CistacApp.Models;

namespace CistacApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelsApiController : ControllerBase
    {
        private readonly CistacDbContext _context;

        public HotelsApiController(CistacDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hotel>>> GetHotels()
        {
            if (_context.Hotels == null)
            {
                return NotFound();
            }

            var hotels = await _context.Hotels
                .Include(h => h.Rooms) // Rooms varsa, yoksa kaldır.
                .ToListAsync();

            return Ok(hotels);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Hotel>> GetHotelById(int id)
        {
            if (_context.Hotels == null)
                return NotFound();

            var hotel = await _context.Hotels
                .Include(h => h.Rooms)
                .FirstOrDefaultAsync(h => h.HotelId == id);

            if (hotel == null)
                return NotFound();

            return Ok(hotel);
        }

        //post
        [HttpPost]
        public async Task<ActionResult<Hotel>> CreateHotel([FromBody] Hotel hotel)
        {
            if (_context.Hotels == null)
            {
                return Problem("Entity set 'CistacDbContext.Hotels' is null.");
            }

            // Basit validation: Name ve Location zorunlu
            if (string.IsNullOrWhiteSpace(hotel.Name) || string.IsNullOrWhiteSpace(hotel.Location))
            {
                return BadRequest("Name and Location fields are required.");
            }

            hotel.CreatedAt = DateTime.UtcNow;
            hotel.UpdatedAt = DateTime.UtcNow;

            _context.Hotels.Add(hotel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException != null && ex.InnerException.Message.Contains("UNIQUE constraint failed"))
                {
                    return Conflict("A hotel with the same email already exists.");
                }

                return StatusCode(500, "An error occurred while saving the hotel.");
            }

            return CreatedAtAction(nameof(GetHotelById), new { id = hotel.HotelId }, hotel);
        }

        //delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            if (_context.Hotels == null)
            {
                return Problem("Entity set 'CistacDbContext.Hotels' is null.");
            }

            var hotel = await _context.Hotels.FindAsync(id);
            if (hotel == null)
            {
                return NotFound();
            }

            _context.Hotels.Remove(hotel);
            await _context.SaveChangesAsync();

            return NoContent(); // 204
        }


    }
}
