using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CistacApp.Data;
using CistacApp.Models;

namespace CistacApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryApiController : ControllerBase
    {
        private readonly CistacDbContext _context;

        public InventoryApiController(CistacDbContext context)
        {
            _context = context;
        }

        // 🔹 GET: api/InventoryApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Inventory>>> GetInventories()
        {
            var inventories = await _context.Inventory
                .Include(i => i.Hotel)
                .ToListAsync();
            return Ok(inventories);
        }

        // 🔹 GET by ID: api/InventoryApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Inventory>> GetInventoryById(int id)
        {
            var inventory = await _context.Inventory
                .Include(i => i.Hotel)
                .FirstOrDefaultAsync(i => i.InventoryID == id);

            if (inventory == null)
            {
                return NotFound($"ID'si {id} olan envanter bulunamadı.");
            }

            return Ok(inventory);
        }

        // 🔹 POST: api/InventoryApi
        [HttpPost]
        public async Task<ActionResult<Inventory>> CreateInventory([FromBody] Inventory newItem)
        {
            // HotelID kontrolü
            var hotelExists = await _context.Hotels.AnyAsync(h => h.HotelId == newItem.HotelID);
            if (!hotelExists)
            {
                return BadRequest($"HotelID {newItem.HotelID} bulunamadı.");
            }

            // Zorunlu navigation property'yi null yap
            newItem.Hotel = null;

            newItem.CreatedAt = DateTime.UtcNow;
            newItem.UpdatedAt = DateTime.UtcNow;

            _context.Inventory.Add(newItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInventoryById), new { id = newItem.InventoryID }, newItem);
        }

        // 🔹 PUT: api/InventoryApi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInventory(int id, [FromBody] Inventory updatedItem)
        {
            if (id != updatedItem.InventoryID)
            {
                return BadRequest("URL'deki ID ile body'deki ID uyuşmuyor.");
            }

            var existingItem = await _context.Inventory.FindAsync(id);
            if (existingItem == null)
            {
                return NotFound($"InventoryID {id} bulunamadı.");
            }

            // Alanları güncelle
            existingItem.ItemName = updatedItem.ItemName;
            existingItem.Category = updatedItem.Category;
            existingItem.CurrentStock = updatedItem.CurrentStock;
            existingItem.HotelID = updatedItem.HotelID;
            existingItem.UpdatedAt = DateTime.UtcNow;

            // Navigation property'yi sıfırla
            existingItem.Hotel = null;

            _context.Entry(existingItem).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
