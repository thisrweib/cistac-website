using System;
using System.Collections.Generic;
using CistacApp.Models;
using Microsoft.EntityFrameworkCore;

namespace CistacApp.Data;

public partial class CistacDbContext : DbContext
{
    public CistacDbContext()
    {
    }

    public CistacDbContext(DbContextOptions<CistacDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<Hotel> Hotels { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Promotion> Promotions { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<Room> Rooms { get; set; }

    public virtual DbSet<Staff> Staff { get; set; }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Inventory> Inventory { get; set; }
    public virtual DbSet<ServiceRequest> ServiceRequests { get; set; }

    public virtual DbSet<Recommendation> Recommendations { get; set; }

    //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
    // => optionsBuilder.UseSqlServer("Server=cistac.database.windows.net;Database=CISTAC;User ID=cistac;Password=0Kuzen2025!_;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__Bookings__73951ACD091BC9C2");

            entity.Property(e => e.BookingStatus).HasDefaultValue("Pending");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Hotel).WithMany(p => p.Bookings)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Bookings_Hotels");

            entity.HasOne(d => d.Payment).WithMany(p => p.Bookings).HasConstraintName("FK_Bookings_Payments");

            entity.HasOne(d => d.Room).WithMany(p => p.Bookings)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Bookings_Rooms");

            entity.HasOne(d => d.User).WithMany(p => p.Bookings)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Bookings_Users");
        });

        modelBuilder.Entity<Hotel>(entity =>
        {
            entity.HasKey(e => e.HotelId).HasName("PK__Hotels__46023BBF2AAF9269");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A582B4EC6D7");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.TransactionDate).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Booking).WithMany(p => p.Payments).HasConstraintName("FK_Payments_Bookings");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.PromotionId).HasName("PK__Promotio__52C42F2F9BCD3B64");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Hotel).WithMany(p => p.Promotions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Promotion_Hotels");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__Reviews__74BC79AEBF50D19F");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Room).WithMany(p => p.Reviews)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Reviews_Rooms");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Reviews_Users");
        });

        modelBuilder.Entity<Room>(entity =>
        {
            entity.HasKey(e => e.RoomId).HasName("PK__Rooms__32863919689C63C6");

            entity.Property(e => e.AvailabilityStatus).HasDefaultValue("Available");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Hotel).WithMany(p => p.Rooms)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Rooms_Hotels");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.StaffId).HasName("PK__Staff__96D4AAF76F483233");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Hotel).WithMany(p => p.Staff)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Staff_Hotels");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCACD915F11F");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
