using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CistacApp.Models
{
    public class Inventory
    {
        [Key] // Primary Key
        public int InventoryID { get; set; }

        [Required]
        [StringLength(100)]
        public string ItemName { get; set; }

        [StringLength(100)] // Define a reasonable length for category
        public string Category { get; set; } // UPDATED from Description

        [Required]
        public int CurrentStock { get; set; } // UPDATED from Quantity

        //[Column(TypeName = "decimal(18, 2)")] // For currency or precise decimal values
        //public decimal UnitPrice { get; set; }

        // Foreign key to link inventory to a specific hotel
        [Required] // Making HotelID required, assuming inventory must belong to a hotel
        public int HotelID { get; set; }
        [ForeignKey("HotelID")]
        public virtual Hotel? Hotel { get; set; } // Navigation property

        // Standard audit fields
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Inventory()
        {
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow; // Initialize when item is created
        }
    }
}