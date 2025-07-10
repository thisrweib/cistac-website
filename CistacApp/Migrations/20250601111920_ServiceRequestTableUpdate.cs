using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CistacApp.Migrations
{
    /// <inheritdoc />
    public partial class ServiceRequestTableUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedDate",
                table: "ServiceRequests");

            migrationBuilder.DropColumn(
                name: "RequestDate",
                table: "ServiceRequests");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CompletedDate",
                table: "ServiceRequests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RequestDate",
                table: "ServiceRequests",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
