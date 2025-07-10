using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CistacApp.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInventoryTable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Hotels_HotelID",
                table: "Inventories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Inventories",
                table: "Inventories");

            migrationBuilder.RenameTable(
                name: "Inventories",
                newName: "Inventory");

            migrationBuilder.RenameIndex(
                name: "IX_Inventories_HotelID",
                table: "Inventory",
                newName: "IX_Inventory_HotelID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Inventory",
                table: "Inventory",
                column: "InventoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventory_Hotels_HotelID",
                table: "Inventory",
                column: "HotelID",
                principalTable: "Hotels",
                principalColumn: "HotelID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inventory_Hotels_HotelID",
                table: "Inventory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Inventory",
                table: "Inventory");

            migrationBuilder.RenameTable(
                name: "Inventory",
                newName: "Inventories");

            migrationBuilder.RenameIndex(
                name: "IX_Inventory_HotelID",
                table: "Inventories",
                newName: "IX_Inventories_HotelID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Inventories",
                table: "Inventories",
                column: "InventoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Hotels_HotelID",
                table: "Inventories",
                column: "HotelID",
                principalTable: "Hotels",
                principalColumn: "HotelID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
