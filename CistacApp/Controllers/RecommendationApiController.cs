using CistacApp.Data;
using CistacApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CistacApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendationApiController : ControllerBase
    {
        private readonly CistacDbContext _context;

        public RecommendationApiController(CistacDbContext context)
        {
            _context = context;
        }

        // GET: api/recommendationapi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecommendationDto>>> GetAll()
        {
            var list = await _context.Recommendations
                .Select(r => new RecommendationDto
                {
                    RecommendationID = r.RecommendationID,
                    UserID = r.UserID,
                    RecommendedRoomID = r.RecommendedRoomID,
                    PredictedScore = r.PredictedScore,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(list);
        }

        // GET: api/recommendationapi/user/1
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<RecommendationDto>>> GetByUser(int userId)
        {
            var list = await _context.Recommendations
                .Where(r => r.UserID == userId)
                .Select(r => new RecommendationDto
                {
                    RecommendationID = r.RecommendationID,
                    UserID = r.UserID,
                    RecommendedRoomID = r.RecommendedRoomID,
                    PredictedScore = r.PredictedScore,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            if (list == null || list.Count == 0)
                return Ok(new List<RecommendationDto>());

            return Ok(list);
        }
    }

}
