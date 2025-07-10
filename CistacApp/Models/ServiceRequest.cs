using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CistacApp.Models
{
    public class ServiceRequest
    {
        [Key]
        public int ServiceRequestID { get; set; }

        [Required]
        public int RoomID { get; set; } // Foreign key to Rooms table
        [ForeignKey("RoomID")]
        public virtual Room Room { get; set; }

        [Required]
        public int UserID { get; set; } // Foreign key to Users table (who made the request)
        [ForeignKey("UserID")]
        public virtual User User { get; set; }

        public int? StaffID { get; set; } // Foreign key to Staff table (who is assigned/completed, nullable)
        [ForeignKey("StaffID")]
        public virtual Staff Staff { get; set; }

        [Required]
        [StringLength(100)]
        public string Request { get; set; } // e.g., "Room Cleaning", "Maintenance", "Room Service

        [Required]
        [StringLength(50)]
        public string Status { get; set; } // e.g., "Pending", "In Progress", "Completed", "Cancelled

        // Standard audit fields
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ServiceRequest()
        {
            CreatedAt = DateTime.UtcNow;
            Status = "Pending"; // Default status
        }
    }
}