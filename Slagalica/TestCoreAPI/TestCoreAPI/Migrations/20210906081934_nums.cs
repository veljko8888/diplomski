using Microsoft.EntityFrameworkCore.Migrations;

namespace TestCoreAPI.Migrations
{
    public partial class nums : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Nums",
                table: "MultiplayerGames",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nums",
                table: "MultiplayerGames");
        }
    }
}
