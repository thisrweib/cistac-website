using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CistacApp.Models;

[Table("Promotion")]
public partial class Promotion
{
    [Key]
    [Column("PromotionID")]
    public int PromotionId { get; set; }

    [Column("HotelID")]
    public int HotelId { get; set; }

    [StringLength(255)]
    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    [Column("Discount_Percentage", TypeName = "decimal(5, 2)")]
    public decimal DiscountPercentage { get; set; }

    [Column("Valid_From")]
    public DateOnly ValidFrom { get; set; }

    [Column("Valid_To")]
    public DateOnly ValidTo { get; set; }

    [Column("Created_At")]
    public DateTime? CreatedAt { get; set; }

    [Column("Updated_At")]
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("HotelId")]
    [InverseProperty("Promotions")]
    public virtual Hotel Hotel { get; set; } = null!;
}
