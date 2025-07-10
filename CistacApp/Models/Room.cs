using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CistacApp.Models;

public partial class Room
{
    [Key]
    [Column("RoomID")]
    public int RoomId { get; set; }

    [Column("HotelID")]
    public int HotelId { get; set; }

    [Column("Room_Number")]
    [StringLength(50)]
    public string RoomNumber { get; set; } = null!;

    [StringLength(50)]
    public string Type { get; set; } = null!;

    [Column("Price_Per_Night", TypeName = "decimal(10, 2)")]
    public decimal PricePerNight { get; set; }

    [Column("Availability_Status")]
    [StringLength(50)]
    public string AvailabilityStatus { get; set; } = null!;

    public int Capacity { get; set; }

    [Column("Room_Amenities")]
    public string? RoomAmenities { get; set; }

    [Column("Created_At")]
    public DateTime? CreatedAt { get; set; }

    [Column("Updated_At")]
    public DateTime? UpdatedAt { get; set; }

    [InverseProperty("Room")]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    [ForeignKey("HotelId")]
    [InverseProperty("Rooms")]
    public virtual Hotel? Hotel { get; set; }

    [InverseProperty("Room")]
    [JsonIgnore]
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
