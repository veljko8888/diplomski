using Microsoft.EntityFrameworkCore.Migrations;

namespace TestCoreAPI.Migrations
{
    public partial class gamespoints : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Player1AsocijacijePoints",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Player1MojBrojPoints",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Player1SkockoPoints",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Player1SlagalicaPoints",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Player1SpojnicePoints",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Player2AsocijacijePoints",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Player2MojBrojPoints",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Player2SkockoPoints",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Player2SlagalicaPoints",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Player2SpojnicePoints",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Player1AsocijacijePoints",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Player1MojBrojPoints",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Player1SkockoPoints",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Player1SlagalicaPoints",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Player1SpojnicePoints",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Player2AsocijacijePoints",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Player2MojBrojPoints",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Player2SkockoPoints",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Player2SlagalicaPoints",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Player2SpojnicePoints",
                table: "MultiplayerGames");
        }
    }
}
