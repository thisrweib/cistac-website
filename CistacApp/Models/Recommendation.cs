using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CistacApp.Models
{
    [Table("Recommendations")] // Explicitly map to the "Recommendations" table in SQLite
    public class Recommendation
    {
        [Key] // Primary Key
        [Column("id")] // Map to the "id" column in SQLite
        public int RecommendationID { get; set; } // C# property name can differ if mapped

        [Column("user_id")] // Map to the "user_id" column
        public int UserID { get; set; } // Assuming this is a foreign key
        [ForeignKey("UserID")]
        public virtual User User { get; set; } // Navigation property to your User model

        [Column("recommended_room_id")] // Map to the "recommended_room_id" column
        public int RecommendedRoomID { get; set; } // Assuming this is a foreign key
        [ForeignKey("RecommendedRoomID")]
        public virtual Room RecommendedRoom { get; set; } // Navigation property to your Room model

        [Column("predicted_score")] // Map to the "predicted_score" column
        public double PredictedScore { get; set; } // Use double or decimal based on precision needed

        [Column("Created_At")] // Map to the "Created_At" column
        public DateTime CreatedAt { get; set; }

        // Default constructor
        public Recommendation()
        {
            // If CreatedAt is always set by the Python script, you might not need to set it here.
            // If EF Core might create instances, setting a default is good.
            // CreatedAt = DateTime.UtcNow; 
        }
    }
}