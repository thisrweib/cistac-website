using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CistacApp.Models;

public partial class Payment
{
    [Key]
    [Column("PaymentID")]
    public int PaymentId { get; set; }

    [Column("BookingID")]
    public int? BookingId { get; set; }

    [Column("Payment_Method")]
    [StringLength(50)]
    public string PaymentMethod { get; set; } = null!;

    [Column("Payment_Status")]
    [StringLength(50)]
    public string PaymentStatus { get; set; } = null!;

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Amount { get; set; }

    [Column("Transaction_Date")]
    public DateTime? TransactionDate { get; set; }

    [Column("Created_At")]
    public DateTime? CreatedAt { get; set; }

    [Column("Updated_At")]
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("BookingId")]
    [InverseProperty("Payments")]
    public virtual Booking? Booking { get; set; }

    [InverseProperty("Payment")]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
