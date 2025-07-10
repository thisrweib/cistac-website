using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CistacApp.Models;

[Index("EMail", Name = "UQ__Users__410EDA2F7A52129C", IsUnique = true)]
public partial class User
{
    [Key]
    [Column("UserID")]
    public int UserId { get; set; }

    [StringLength(255)]
    public string Name { get; set; } = null!;

    [StringLength(255)]
    public string Surname { get; set; } = null!;

    [StringLength(255)]
    public string Password { get; set; } = null!;

    [Column("Phone_Number")]
    [StringLength(50)]
    public string? PhoneNumber { get; set; }

    [Column("eMail")]
    [StringLength(255)]
    public string EMail { get; set; } = null!;

    [StringLength(50)]
    public string Role { get; set; } = null!;

    [Column("Created_At")]
    public DateTime? CreatedAt { get; set; }

    [Column("Updated_At")]
    public DateTime? UpdatedAt { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    [InverseProperty("User")]
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
