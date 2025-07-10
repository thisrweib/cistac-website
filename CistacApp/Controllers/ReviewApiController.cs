using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CistacApp.Data;
using CistacApp.Models;

namespace CistacApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewApiController : ControllerBase
    {
        private readonly CistacDbContext _context;

        public ReviewApiController(CistacDbContext context)
        {
            _context = context;
        }

        // GET: api/ReviewApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Room)
                .ToListAsync();
        }

        // GET: api/ReviewApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(int id)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Room)
                .FirstOrDefaultAsync(r => r.ReviewId == id);

            if (review == null)
                return NotFound();

            return review;
        }

        // POST: api/ReviewApi
        [HttpPost]
        public async Task<ActionResult<Review>> PostReview([FromBody] Review review)
        {
            var validRatings = new int[] { 1, 2, 3, 4, 5 };
            if (!validRatings.Contains(review.Rating))
                return BadRequest("Rating must be one of the following values: 0, 1, 2, ..., 5.");

            if (review.UserId <= 0 || review.RoomId <= 0)
                return BadRequest("Invalid UserId or RoomId.");

            review.CreatedAt = DateTime.UtcNow;
            review.UpdatedAt = DateTime.UtcNow;

            // navigation propertyleri sıfırla ki model binding zorlamasın
            review.User = null;
            review.Room = null;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReview), new { id = review.ReviewId }, review);
        }

        // PUT: api/ReviewApi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(int id, Review review)
        {
            if (id != review.ReviewId)
                return BadRequest();

            review.UpdatedAt = DateTime.UtcNow;
            _context.Entry(review).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Reviews.Any(e => e.ReviewId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // GET: api/review/hotel/5  --> hotelId=5 olan hotelin reviewları
        [HttpGet("hotel/{hotelId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviewsByHotel(int hotelId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Room)
                .Where(r => r.Room.HotelId == hotelId)
                .ToListAsync();

            if (reviews == null || reviews.Count == 0)
                return NotFound();

            return Ok(reviews);
        }

        // DELETE: api/ReviewApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                return NotFound();

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
