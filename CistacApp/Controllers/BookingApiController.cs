using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CistacApp.Data;
using CistacApp.Models;
using CistacApp.Dtos;  // DTO klasörünü varsayıyorum
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CistacApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingApiController : ControllerBase
    {
        private readonly CistacDbContext _context;

        public BookingApiController(CistacDbContext context)
        {
            _context = context;
        }

        // GET: api/booking
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Hotel)
                .Include(b => b.Room)
                .Include(b => b.Payment)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    HotelId = b.HotelId,
                    RoomId = b.RoomId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingStatus = b.BookingStatus,
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // GET: api/booking/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDto>> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Hotel)
                .Include(b => b.Room)
                .Include(b => b.Payment)
                .Where(b => b.BookingId == id)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    HotelId = b.HotelId,
                    RoomId = b.RoomId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingStatus = b.BookingStatus,
                })
                .FirstOrDefaultAsync();

            if (booking == null)
                return NotFound();

            return Ok(booking);
        }

        // POST: api/booking
        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking([FromBody] BookingDto dto)
        {
            var booking = new Booking
            {
                UserId = dto.UserId,
                HotelId = dto.HotelId,
                RoomId = dto.RoomId,
                CheckInDate = dto.CheckInDate,
                CheckOutDate = dto.CheckOutDate,
                BookingStatus = "pending", // Otomatik atanıyor
                CreatedAt = DateTime.UtcNow,
                PaymentId = null
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBooking), new { id = booking.BookingId }, booking);
        }

        // PUT: api/booking/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, [FromBody] BookingDto dto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return NotFound();

            booking.UserId = dto.UserId;
            booking.HotelId = dto.HotelId;
            booking.RoomId = dto.RoomId;
            booking.CheckInDate = dto.CheckInDate;
            booking.CheckOutDate = dto.CheckOutDate;

            // BookingStatus dışarıdan gelen değere göre güncelleniyor
            booking.BookingStatus = dto.BookingStatus;

            booking.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Bookings.Any(b => b.BookingId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/booking/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return NotFound();

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/booking/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookingsByUserId(int userId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Hotel)
                .Include(b => b.Room)
                .Include(b => b.Payment)
                .Where(b => b.UserId == userId)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    HotelId = b.HotelId,
                    RoomId = b.RoomId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingStatus = b.BookingStatus,
                })
                .ToListAsync();

            if (bookings == null || bookings.Count == 0)
                return NotFound($"No bookings found for user with ID {userId}.");

            return Ok(bookings);
        }

        // GET: api/booking/room/{roomId}
        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookingsByRoomId(int roomId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Hotel)
                .Include(b => b.Room)
                .Include(b => b.Payment)
                .Where(b => b.RoomId == roomId)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    HotelId = b.HotelId,
                    RoomId = b.RoomId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingStatus = b.BookingStatus,
                })
                .ToListAsync();

            if (bookings == null || bookings.Count == 0)
                return Ok(new List<Booking>());

            return Ok(bookings);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] BookingStatusUpdateDto dto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();

            booking.BookingStatus = dto.Status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public class BookingStatusUpdateDto
        {
            public string Status { get; set; }
        }

    }
}
