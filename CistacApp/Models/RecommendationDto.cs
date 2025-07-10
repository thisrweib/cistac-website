namespace CistacApp.Models
{
    public class RecommendationDto
    {
        public int RecommendationID { get; set; }
        public int UserID { get; set; }
        public int RecommendedRoomID { get; set; }
        public double PredictedScore { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
