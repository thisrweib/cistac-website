using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CistacApp.Models;

[Index("EMail", Name = "UQ__Hotels__410EDA2F9ECB1D46", IsUnique = true)]
public partial class Hotel
{
    [Key]
    [Column("HotelID")]
    public int HotelId { get; set; }

    [StringLength(255)]
    public string Name { get; set; } = null!;

    [StringLength(255)]
    public string Location { get; set; } = null!;

    [Column(TypeName = "decimal(3, 2)")]
    public decimal? Rating { get; set; }

    [Column("Phone_Number")]
    [StringLength(50)]
    public string? PhoneNumber { get; set; }

    [Column("eMail")]
    [StringLength(255)]
    public string? EMail { get; set; }

    [Column("Hotel_Amenities")]
    public string? HotelAmenities { get; set; }

    [Column("Created_At")]
    public DateTime? CreatedAt { get; set; }

    [Column("Updated_At")]
    public DateTime? UpdatedAt { get; set; }

    [InverseProperty("Hotel")]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    [InverseProperty("Hotel")]
    public virtual ICollection<Promotion> Promotions { get; set; } = new List<Promotion>();

    [InverseProperty("Hotel")]
    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();

    [InverseProperty("Hotel")]
    public virtual ICollection<Staff> Staff { get; set; } = new List<Staff>();
}
