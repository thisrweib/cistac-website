namespace CistacApp.Dtos
{
    public class BookingDto
    {
        public int BookingId { get; set; }
        public string? BookingStatus { get; set; }
        public DateOnly CheckInDate { get; set; }
        public DateOnly CheckOutDate { get; set; }
        public int UserId { get; set; }
        public int HotelId { get; set; }
        public int RoomId { get; set; }
    }
}
