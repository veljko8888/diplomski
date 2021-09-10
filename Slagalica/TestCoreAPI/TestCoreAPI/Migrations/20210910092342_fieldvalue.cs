using Microsoft.EntityFrameworkCore.Migrations;

namespace TestCoreAPI.Migrations
{
    public partial class fieldvalue : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FieldName",
                table: "MultiplayerGames",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Value",
                table: "MultiplayerGames",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FieldName",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "MultiplayerGames");
        }
    }
}
