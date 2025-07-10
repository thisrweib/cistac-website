using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CistacApp.Data;
using CistacApp.Models;

namespace CistacApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsApiController : ControllerBase
    {
        private readonly CistacDbContext _context;

        public RoomsApiController(CistacDbContext context)
        {
            _context = context;
        }

        //get room by id 
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoomById(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Hotel) // Otel bilgisi gerekirse
                .FirstOrDefaultAsync(r => r.RoomId == id);

            if (room == null)
            {
                return NotFound();
            }

            return Ok(room);
        }

        //post
        [HttpPost]
        public async Task<ActionResult<Room>> CreateRoom([FromBody] Room newRoom)
        {
            // HotelId zorunlu çünkü Room bir otele bağlı olmalı
            var hotelExists = await _context.Hotels.AnyAsync(h => h.HotelId == newRoom.HotelId);
            if (!hotelExists)
            {
                return BadRequest($"HotelId {newRoom.HotelId} bulunamadı.");
            }


            // Varsayılan durum ataması
            newRoom.AvailabilityStatus = string.IsNullOrWhiteSpace(newRoom.AvailabilityStatus)
                ? "Available"
                : newRoom.AvailabilityStatus;

            newRoom.CreatedAt = DateTime.UtcNow;
            newRoom.UpdatedAt = DateTime.UtcNow;

            // Navigasyon property’yi sıfırla, model validasyonu için
            newRoom.Hotel = null;

            _context.Rooms.Add(newRoom);
            await _context.SaveChangesAsync();

            // Yeni oluşturulan kaydın bulunduğu endpoint bilgisiyle dön
            return CreatedAtAction(nameof(GetRoomById), new { id = newRoom.RoomId }, newRoom);
        }


        //put
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] Room updatedRoom)
        {
            if (id != updatedRoom.RoomId)
            {
                return BadRequest("URL'deki ID ile gönderilen RoomID uyuşmuyor.");
            }

            var existingRoom = await _context.Rooms.FindAsync(id);
            if (existingRoom == null)
            {
                return NotFound($"ID'si {id} olan oda bulunamadı.");
            }

            // Güncellenebilir alanlar
            existingRoom.RoomNumber = updatedRoom.RoomNumber;
            existingRoom.Type = updatedRoom.Type;
            existingRoom.PricePerNight = updatedRoom.PricePerNight;
            existingRoom.Capacity = updatedRoom.Capacity;
            existingRoom.RoomAmenities = updatedRoom.RoomAmenities;

            // HotelID isteniyorsa güncelle:
            existingRoom.HotelId = updatedRoom.HotelId;

            // Availability boşsa "Available" ata
            existingRoom.AvailabilityStatus = string.IsNullOrWhiteSpace(updatedRoom.AvailabilityStatus)
                ? "Available"
                : updatedRoom.AvailabilityStatus;

            // CreatedAt dokunulmaz, UpdatedAt güncellenir
            existingRoom.UpdatedAt = DateTime.UtcNow;

            // Navigasyon property’leri sıfırla
            existingRoom.Hotel = null;

            _context.Entry(existingRoom).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Rooms.Any(r => r.RoomId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // 204 başarı
        }

        [HttpPost("bulk")]
        public async Task<ActionResult> CreateRoomsBulk([FromBody] List<Room> rooms)
        {
            foreach (var room in rooms)
            {
                var hotelExists = await _context.Hotels.AnyAsync(h => h.HotelId == room.HotelId);
                if (!hotelExists)
                    return BadRequest($"HotelId {room.HotelId} bulunamadı.");

                room.AvailabilityStatus = string.IsNullOrWhiteSpace(room.AvailabilityStatus)
                    ? "Available"
                    : room.AvailabilityStatus;

                room.CreatedAt = DateTime.UtcNow;
                room.UpdatedAt = DateTime.UtcNow;
                room.Hotel = null;

                _context.Rooms.Add(room);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"{rooms.Count} oda başarıyla eklendi." });
        }

        // PUT api/room/bulk
        [HttpPut("bulk")]
        public async Task<IActionResult> UpdateRoomsBulk([FromBody] Room[] updatedRooms)
        {
            if (updatedRooms == null || updatedRooms.Length == 0)
            {
                return BadRequest("Güncellenecek odalar listesi boş olamaz.");
            }

            foreach (var updatedRoom in updatedRooms)
            {
                var existingRoom = await _context.Rooms.FindAsync(updatedRoom.RoomId);
                if (existingRoom == null)
                {
                    return NotFound($"ID'si {updatedRoom.RoomId} olan oda bulunamadı.");
                }

                // Güncellenebilir alanlar
                existingRoom.RoomNumber = updatedRoom.RoomNumber;
                existingRoom.Type = updatedRoom.Type;
                existingRoom.PricePerNight = updatedRoom.PricePerNight;
                existingRoom.Capacity = updatedRoom.Capacity;
                existingRoom.RoomAmenities = updatedRoom.RoomAmenities;

                existingRoom.HotelId = updatedRoom.HotelId;

                existingRoom.AvailabilityStatus = string.IsNullOrWhiteSpace(updatedRoom.AvailabilityStatus)
                    ? "Available"
                    : updatedRoom.AvailabilityStatus;

                existingRoom.UpdatedAt = DateTime.UtcNow;
                existingRoom.Hotel = null;

                _context.Entry(existingRoom).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Veritabanı güncellemesi sırasında bir hata oluştu.");
            }

            return NoContent();
        }



        //delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound($"ID'si {id} olan oda bulunamadı.");
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content başarılı silme
        }

    }
}
