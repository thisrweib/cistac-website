using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CistacApp.Data;
using CistacApp.Models;
using CistacApp.Dtos;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace CistacApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceRequestApiController : ControllerBase
    {
        private readonly CistacDbContext _context;

        public ServiceRequestApiController(CistacDbContext context)
        {
            _context = context;
        }

        // GET: api/ServiceRequestApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceRequestDto>>> GetAll()
        {
            var list = await _context.ServiceRequests
                .Select(sr => new ServiceRequestDto
                {
                    ServiceRequestID = sr.ServiceRequestID,
                    RoomID = sr.RoomID,
                    UserID = sr.UserID,
                    StaffID = sr.StaffID,
                    Request = sr.Request,
                    Status = sr.Status
                })
                .ToListAsync();

            return Ok(list);
        }

        // GET: api/ServiceRequestApi/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceRequestDto>> GetById(int id)
        {
            var sr = await _context.ServiceRequests
                .Where(x => x.ServiceRequestID == id)
                .Select(sr => new ServiceRequestDto
                {
                    ServiceRequestID = sr.ServiceRequestID,
                    RoomID = sr.RoomID,
                    UserID = sr.UserID,
                    StaffID = sr.StaffID,
                    Request = sr.Request,
                    Status = sr.Status
                })
                .FirstOrDefaultAsync();

            if (sr == null)
                return Ok(new List<ServiceRequestDto>());

            return Ok(sr);
        }

        // POST: api/ServiceRequestApi
        [HttpPost]
        public async Task<ActionResult<ServiceRequest>> Create([FromBody] ServiceRequestDto dto)
        {
            var sr = new ServiceRequest
            {
                RoomID = dto.RoomID,
                UserID = dto.UserID,
                StaffID = dto.StaffID,
                Request = dto.Request,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.ServiceRequests.Add(sr);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = sr.ServiceRequestID }, sr);
        }


        // PUT: api/ServiceRequestApi/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ServiceRequestDto dto)
        {
            var sr = await _context.ServiceRequests.FindAsync(id);
            if (sr == null)
                return NotFound();

            sr.RoomID = dto.RoomID;
            sr.UserID = dto.UserID;
            sr.StaffID = dto.StaffID;
            sr.Request = dto.Request;
            // Status sadece gönderildiyse güncellensin
            if (!string.IsNullOrWhiteSpace(dto.Status))
                sr.Status = dto.Status;
            sr.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ServiceRequests.Any(e => e.ServiceRequestID == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // GET: api/ServiceRequestApi/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ServiceRequestDto>>> GetByUserId(int userId)
        {
            var list = await _context.ServiceRequests
                .Where(sr => sr.UserID == userId)
                .Select(sr => new ServiceRequestDto
                {
                    ServiceRequestID = sr.ServiceRequestID,
                    RoomID = sr.RoomID,
                    UserID = sr.UserID,
                    StaffID = sr.StaffID,
                    Request = sr.Request,
                    Status = sr.Status
                })
                .ToListAsync();

            if (list == null || list.Count == 0)
                return Ok(new List<ServiceRequestDto>());

            return Ok(list);
        }

        // GET: api/ServiceRequestApi/staff/{staffId}
        [HttpGet("staff/{staffId}")]
        public async Task<ActionResult<IEnumerable<ServiceRequestDto>>> GetByStaffId(int staffId)
        {
            var list = await _context.ServiceRequests
                .Where(sr => sr.StaffID == staffId)
                .Select(sr => new ServiceRequestDto
                {
                    ServiceRequestID = sr.ServiceRequestID,
                    RoomID = sr.RoomID,
                    UserID = sr.UserID,
                    StaffID = sr.StaffID,
                    Request = sr.Request,
                    Status = sr.Status
                })
                .ToListAsync();

            if (list == null || list.Count == 0)
                return Ok(new List<ServiceRequestDto>());

            return Ok(list);
        }


    }
}
