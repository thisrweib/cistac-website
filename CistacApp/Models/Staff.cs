using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CistacApp.Models;

[Index("EMail", Name = "UQ__Staff__410EDA2FBB11187F", IsUnique = true)]
public partial class Staff
{
    [Key]
    [Column("StaffID")]
    public int StaffId { get; set; }

    [Column("HotelID")]
    public int HotelId { get; set; }

    [StringLength(255)]
    public string Name { get; set; } = null!;

    [StringLength(255)]
    public string Surname { get; set; } = null!;

    [StringLength(100)]
    public string Position { get; set; } = null!;

    [Column("eMail")]
    [StringLength(255)]
    public string? EMail { get; set; }

    [StringLength(50)]
    public string? Shift { get; set; }

    [Column("Phone_Number")]
    [StringLength(50)]
    public string? PhoneNumber { get; set; }

    [Column("Created_At")]
    public DateTime? CreatedAt { get; set; }

    [Column("Updated_At")]
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("HotelId")]
    [InverseProperty("Staff")]
    public virtual Hotel? Hotel { get; set; }
}
