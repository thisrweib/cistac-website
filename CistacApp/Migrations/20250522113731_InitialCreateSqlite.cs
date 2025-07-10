using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CistacApp.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateSqlite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Hotels",
                columns: table => new
                {
                    HotelID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Location = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Rating = table.Column<decimal>(type: "decimal(3, 2)", nullable: true),
                    Phone_Number = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    eMail = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Hotel_Amenities = table.Column<string>(type: "TEXT", nullable: true),
                    Created_At = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "(sysdatetime())"),
                    Updated_At = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Hotels__46023BBF2AAF9269", x => x.HotelID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Surname = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Password = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Phone_Number = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    eMail = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Role = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Created_At = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "(sysdatetime())"),
                    Updated_At = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__1788CCACD915F11F", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "Promotion",
                columns: table => new
                {
                    PromotionID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    HotelID = table.Column<int>(type: "INTEGER", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Discount_Percentage = table.Column<decimal>(type: "decimal(5, 2)", nullable: false),
                    Valid_From = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    Valid_To = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    Created_At = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "(sysdatetime())"),
                    Updated_At = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Promotio__52C42F2F9BCD3B64", x => x.PromotionID);
                    table.ForeignKey(
                        name: "FK_Promotion_Hotels",
                        column: x => x.HotelID,
                        principalTable: "Hotels",
                        principalColumn: "HotelID");
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    RoomID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    HotelID = table.Column<int>(type: "INTEGER", nullable: false),
                    Room_Number = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Type = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Price_Per_Night = table.Column<decimal>(type: "decimal(10, 2)", nullable: false),
                    Availability_Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "Available"),
                    Capacity = table.Column<int>(type: "INTEGER", nullable: false),
                    Room_Amenities = table.Column<string>(type: "TEXT", nullable: true),
                    Created_At = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "(sysdatetime())"),
                    Updated_At = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Rooms__32863919689C63C6", x => x.RoomID);
                    table.ForeignKey(
                        name: "FK_Rooms_Hotels",
                        column: x => x.HotelID,
                        principalTable: "Hotels",
                        principalColumn: "HotelID");
                });

            migrationBuilder.CreateTable(
                name: "Staff",
                columns: table => new
                {
                    StaffID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    HotelID = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Surname = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Position = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    eMail = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Shift = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    Phone_Number = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    Created_At = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "(sysdatetime())"),
                    Updated_At = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Staff__96D4AAF76F483233", x => x.StaffID);
                    table.ForeignKey(
                        name: "FK_Staff_Hotels",
                        column: x => x.HotelID,
                        principalTable: "Hotels",
                        principalColumn: "HotelID");
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    ReviewID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserID = table.Column<int>(type: "INTEGER", nullable: false),
                    RoomID = table.Column<int>(type: "INTEGER", nullable: false),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false),
                    Comment = table.Column<string>(type: "TEXT", nullable: true),
                    Created_At = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "(sysdatetime())"),
                    Updated_At = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Reviews__74BC79AEBF50D19F", x => x.ReviewID);
                    table.ForeignKey(
                        name: "FK_Reviews_Rooms",
                        column: x => x.RoomID,
                        principalTable: "Rooms",
                        principalColumn: "RoomID");
                    table.ForeignKey(
                        name: "FK_Reviews_Users",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    BookingID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserID = table.Column<int>(type: "INTEGER", nullable: false),
                    HotelID = table.Column<int>(type: "INTEGER", nullable: false),
                    RoomID = table.Column<int>(type: "INTEGER", nullable: false),
                    PaymentID = table.Column<int>(type: "INTEGER", nullable: true),
                    Check_In_Date = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    Check_Out_Date = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    Booking_Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "Pending"),
                    Created_At = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "(sysdatetime())"),
                    Updated_At = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Bookings__73951ACD091BC9C2", x => x.BookingID);
                    table.ForeignKey(
                        name: "FK_Bookings_Hotels",
                        column: x => x.HotelID,
                        principalTable: "Hotels",
                        principalColumn: "HotelID");
                    table.ForeignKey(
                        name: "FK_Bookings_Rooms",
                        column: x => x.RoomID,
                        principalTable: "Rooms",
                        principalColumn: "RoomID");
                    table.ForeignKey(
                        name: "FK_Bookings_Users",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BookingID = table.Column<int>(type: "INTEGER", nullable: true),
                    Payment_Method = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Payment_Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(10, 2)", nullable: false),
                    Transaction_Date = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "(sysdatetime())"),
                    Created_At = table.Column<DateTime>(type: "TEXT", nullable: true, defaultValueSql: "(sysdatetime())"),
                    Updated_At = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Payments__9B556A582B4EC6D7", x => x.PaymentID);
                    table.ForeignKey(
                        name: "FK_Payments_Bookings",
                        column: x => x.BookingID,
                        principalTable: "Bookings",
                        principalColumn: "BookingID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_HotelID",
                table: "Bookings",
                column: "HotelID");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_PaymentID",
                table: "Bookings",
                column: "PaymentID");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_RoomID",
                table: "Bookings",
                column: "RoomID");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserID",
                table: "Bookings",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "UQ__Hotels__410EDA2F9ECB1D46",
                table: "Hotels",
                column: "eMail",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_BookingID",
                table: "Payments",
                column: "BookingID");

            migrationBuilder.CreateIndex(
                name: "IX_Promotion_HotelID",
                table: "Promotion",
                column: "HotelID");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_RoomID",
                table: "Reviews",
                column: "RoomID");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserID",
                table: "Reviews",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_HotelID",
                table: "Rooms",
                column: "HotelID");

            migrationBuilder.CreateIndex(
                name: "IX_Staff_HotelID",
                table: "Staff",
                column: "HotelID");

            migrationBuilder.CreateIndex(
                name: "UQ__Staff__410EDA2FBB11187F",
                table: "Staff",
                column: "eMail",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__Users__410EDA2F7A52129C",
                table: "Users",
                column: "eMail",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Payments",
                table: "Bookings",
                column: "PaymentID",
                principalTable: "Payments",
                principalColumn: "PaymentID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Hotels",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Hotels",
                table: "Rooms");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Payments",
                table: "Bookings");

            migrationBuilder.DropTable(
                name: "Promotion");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "Staff");

            migrationBuilder.DropTable(
                name: "Hotels");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
