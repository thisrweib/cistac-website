using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CistacApp.Models;

public partial class Booking
{
    [Key]
    [Column("BookingID")]
    public int BookingId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("HotelID")]
    public int HotelId { get; set; }

    [Column("RoomID")]
    public int RoomId { get; set; }

    [Column("PaymentID")]
    public int? PaymentId { get; set; }

    [Column("Check_In_Date")]
    public DateOnly CheckInDate { get; set; }

    [Column("Check_Out_Date")]
    public DateOnly CheckOutDate { get; set; }

    [Column("Booking_Status")]
    [StringLength(50)]
    public string BookingStatus { get; set; } = null!;

    [Column("Created_At")]
    public DateTime? CreatedAt { get; set; }

    [Column("Updated_At")]
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("HotelId")]
    [InverseProperty("Bookings")]
    public virtual Hotel Hotel { get; set; } = null!;

    [ForeignKey("PaymentId")]
    [InverseProperty("Bookings")]
    public virtual Payment? Payment { get; set; }

    [InverseProperty("Booking")]
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    [ForeignKey("RoomId")]
    [InverseProperty("Bookings")]
    public virtual Room Room { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Bookings")]
    public virtual User User { get; set; } = null!;
}
