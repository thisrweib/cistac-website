using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CistacApp.Models;

public partial class Review
{
    [Key]
    [Column("ReviewID")]
    public int ReviewId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("RoomID")]
    public int RoomId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    [Column("Created_At")]
    public DateTime? CreatedAt { get; set; }

    [Column("Updated_At")]
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey("RoomId")]
    [InverseProperty("Reviews")]
    [BindNever]               // Model bindingden çıkarır
    [JsonIgnore]             // JSON parse edilirken ignore edilir
    public virtual Room? Room { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("Reviews")]
    [BindNever]
    [JsonIgnore]
    public virtual User? User { get; set; }
}
