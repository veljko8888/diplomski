using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TestCoreAPI.Migrations
{
    public partial class slagalicaenddatetime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SlagalicaGameEnds",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SlagalicaGameEnds",
                table: "MultiplayerGames");
        }
    }
}
