using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CistacApp.Migrations
{
    /// <inheritdoc />
    public partial class Recommendations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Recommendations",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    user_id = table.Column<int>(type: "INTEGER", nullable: false),
                    recommended_room_id = table.Column<int>(type: "INTEGER", nullable: false),
                    predicted_score = table.Column<double>(type: "REAL", nullable: false),
                    Created_At = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recommendations", x => x.id);
                    table.ForeignKey(
                        name: "FK_Recommendations_Rooms_recommended_room_id",
                        column: x => x.recommended_room_id,
                        principalTable: "Rooms",
                        principalColumn: "RoomID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Recommendations_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Recommendations_recommended_room_id",
                table: "Recommendations",
                column: "recommended_room_id");

            migrationBuilder.CreateIndex(
                name: "IX_Recommendations_user_id",
                table: "Recommendations",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Recommendations");
        }
    }
}
