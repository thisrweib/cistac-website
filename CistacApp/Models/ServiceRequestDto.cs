namespace CistacApp.Dtos
{
    public class ServiceRequestDto
    {
        public int ServiceRequestID { get; set; }
        public int RoomID { get; set; }
        public int UserID { get; set; }
        public int? StaffID { get; set; }
        public string Request { get; set; }
        public string? Status { get; set; }
    }
}